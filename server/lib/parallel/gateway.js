import { createHash } from 'crypto';

/**
 * Parallel API cost estimates per request type
 */
const PARALLEL_COST_PER_REQUEST = {
  extract: 0.05,
  'task-core': 0.10,
  'task-pro': 0.25,
  'task-premium': 0.50,
  findall: 0.15,
  enrich: 0.08,
  chat: 0.02,
};

const DEFAULT_CONFIG = {
  apiKey: process.env.PARALLEL_API_KEY || '',
  baseUrl: process.env.PARALLEL_BASE_URL || 'https://api.parallel.ai',
  rateLimitPerMinute: 600,
  cacheEnabled: true,
  cacheTTLSeconds: 3600, // 1 hour
};

/**
 * Rate limiter using token bucket algorithm
 */
class RateLimiter {
  constructor(requestsPerMinute) {
    this.maxTokens = requestsPerMinute;
    this.tokens = requestsPerMinute;
    this.refillRate = requestsPerMinute / 60; // tokens per second
    this.lastRefill = Date.now();
  }

  async acquire() {
    this.refill();

    if (this.tokens < 1) {
      const waitTime = Math.ceil((1 - this.tokens) / this.refillRate) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refill();
    }

    this.tokens -= 1;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

/**
 * Simple in-memory cache
 */
class Cache {
  constructor(ttlSeconds) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  async get(key) {
    const entry = this.cache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value;
    }
    this.cache.delete(key);
    return null;
  }

  async set(key, value) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  generateKey(data) {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(data));
    return `parallel:${hash.digest('hex')}`;
  }
}

/**
 * Cost tracker for usage reporting
 */
class CostTracker {
  constructor() {
    this.costs = [];
  }

  record(endpoint, costUSD, requestId) {
    this.costs.push({
      timestamp: new Date(),
      endpoint,
      costUSD,
      requestId,
    });

    // Keep last 1000 records in memory
    if (this.costs.length > 1000) {
      this.costs = this.costs.slice(-1000);
    }
  }

  getTotalCost(sinceTimestamp) {
    const since = sinceTimestamp || new Date(0);
    return this.costs
      .filter((c) => c.timestamp >= since)
      .reduce((sum, c) => sum + c.costUSD, 0);
  }

  getRecentCosts(limit = 100) {
    return this.costs.slice(-limit);
  }
}

/**
 * Parallel.ai Gateway Service
 * Handles all API calls with rate limiting, caching, and cost tracking
 */
export class ParallelGateway {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rateLimiter = new RateLimiter(this.config.rateLimitPerMinute);
    this.cache = new Cache(this.config.cacheTTLSeconds);
    this.costTracker = new CostTracker();
  }

  /**
   * Generic request method
   */
  async request(options) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    // Check cache first
    if (this.config.cacheEnabled && !options.bypassCache && options.method === 'GET') {
      const cacheKey = options.cacheKey || this.cache.generateKey({
        endpoint: options.endpoint,
        body: options.body,
      });
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return {
          data: cached,
          cached: true,
          estimatedCostUSD: 0,
          latencyMs: Date.now() - startTime,
          requestId,
        };
      }
    }

    // Acquire rate limit token
    await this.rateLimiter.acquire();

    // Make request
    const url = `${this.config.baseUrl}${options.endpoint}`;
    const response = await fetch(url, {
      method: options.method,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'parallel-beta': 'search-extract-2025-10-10',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Parallel API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    // Estimate cost
    const costKey = options.processorTier
      ? `task-${options.processorTier}`
      : options.endpoint.split('/').pop() || 'unknown';
    const estimatedCostUSD = PARALLEL_COST_PER_REQUEST[costKey] || 0.01;

    // Track cost
    this.costTracker.record(options.endpoint, estimatedCostUSD, requestId);

    // Cache result
    if (this.config.cacheEnabled && options.method === 'POST' && options.cacheKey) {
      await this.cache.set(options.cacheKey, data);
    }

    return {
      data,
      cached: false,
      estimatedCostUSD,
      latencyMs,
      requestId,
    };
  }

  /**
   * Extract API - Pull structured content from URLs
   */
  async extract(urls, options = {}) {
    return this.request({
      endpoint: '/v1beta/extract',
      method: 'POST',
      body: {
        urls,
        objective: options.objective || 'Extract all company information',
        excerpts: options.excerpts ?? true,
        fullContent: options.fullContent ?? true,
      },
      cacheKey: this.cache.generateKey({ extract: urls, ...options }),
    });
  }

  /**
   * Deep Research (Task API) - Comprehensive web research
   */
  async deepResearch(query, options = {}) {
    const processor = options.processor || 'pro';

    return this.request({
      endpoint: '/v1/tasks/runs',
      method: 'POST',
      body: {
        task: 'research',
        input: query,
        processor,
        output_format: options.outputFormat || 'json',
        schema: options.schema,
        max_results: options.maxResults,
      },
      processorTier: processor,
      cacheKey: this.cache.generateKey({ research: query, processor }),
    });
  }

  /**
   * FindAll API - Discover entities matching conditions
   * Uses the FindAllRunPayload format with findall_spec and processor
   * Docs: https://docs.parallel.ai/findall-api/findall-api
   */
  async findAll(query, options = {}) {
    const processor = options.processor || 'base';
    const resultLimit = options.resultLimit || 10;

    // Build columns based on what we're searching for
    const columns = options.columns || [
      { name: 'entity_name', description: 'Name of the company', type: 'enrichment', order_direction: null },
      { name: 'website', description: 'Company website URL', type: 'enrichment', order_direction: null },
      { name: 'description', description: 'Brief description of what the company does', type: 'enrichment', order_direction: null },
    ];

    // Add constraint columns if match conditions provided
    if (options.matchConditions && options.matchConditions.length > 0) {
      options.matchConditions.forEach((condition, idx) => {
        columns.push({
          name: `constraint_${idx}`,
          description: condition,
          type: 'constraint',
          order_direction: null,
        });
      });
    }

    return this.request({
      endpoint: '/v1beta/findall/runs',
      method: 'POST',
      body: {
        findall_spec: {
          name: options.specName || 'competitor_search',
          query: query,
          columns: columns,
        },
        processor,
        result_limit: resultLimit,
      },
      processorTier: processor,
      cacheKey: this.cache.generateKey({ findall: query, processor, resultLimit }),
    });
  }

  /**
   * Enrichment API - Add structured data to entities
   */
  async enrich(entities, fields, options = {}) {
    return this.request({
      endpoint: '/v1/tasks/runs',
      method: 'POST',
      body: {
        task: 'enrich',
        entities,
        fields,
        processor: options.processor || 'core',
      },
      processorTier: options.processor || 'core',
      cacheKey: this.cache.generateKey({ enrich: entities, fields }),
    });
  }

  /**
   * Poll task status (generic tasks)
   */
  async pollTaskStatus(taskId) {
    return this.request({
      endpoint: `/v1/tasks/runs/${taskId}`,
      method: 'GET',
      bypassCache: true,
    });
  }

  /**
   * Poll FindAll task status
   * FindAll uses a different endpoint: /v1beta/findall/runs/{id}
   * Completion is when BOTH is_active AND are_enrichments_active are false
   */
  async pollFindAllStatus(findallId) {
    return this.request({
      endpoint: `/v1beta/findall/runs/${findallId}`,
      method: 'GET',
      bypassCache: true,
    });
  }

  /**
   * Get task result
   */
  async getTaskResult(taskId) {
    return this.request({
      endpoint: `/v1/tasks/runs/${taskId}/result`,
      method: 'GET',
    });
  }

  /**
   * Get FindAll result
   */
  async getFindAllResult(findallId) {
    return this.request({
      endpoint: `/v1beta/findall/runs/${findallId}`,
      method: 'GET',
    });
  }

  /**
   * Wait for task completion with polling
   */
  async waitForTask(taskId, options = {}) {
    const maxWait = options.maxWaitMs || 300000; // 5 minutes
    const pollInterval = options.pollIntervalMs || 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const status = await this.pollTaskStatus(taskId);

      if (status.data.status === 'completed') {
        const result = await this.getTaskResult(taskId);
        return result.data;
      }

      if (status.data.status === 'failed') {
        throw new Error(`Task failed: ${status.data.error || 'Unknown error'}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Task timed out after ${maxWait}ms`);
  }

  /**
   * Get usage statistics
   */
  getUsageStats(sinceTimestamp) {
    return {
      totalCostUSD: this.costTracker.getTotalCost(sinceTimestamp),
      recentCosts: this.costTracker.getRecentCosts(),
    };
  }

  /**
   * Estimate cost for a processor tier
   */
  estimateCost(processorTier) {
    return PARALLEL_COST_PER_REQUEST[`task-${processorTier}`] || 0.10;
  }
}

// Export singleton instance
let gatewayInstance = null;

export function getParallelGateway() {
  if (!gatewayInstance) {
    gatewayInstance = new ParallelGateway();
  }
  return gatewayInstance;
}

export default ParallelGateway;
