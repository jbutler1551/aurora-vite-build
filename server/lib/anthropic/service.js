import Anthropic from '@anthropic-ai/sdk';
import {
  companyProfilePrompt,
  competitiveAnalysisPrompt,
  opportunityIdentificationPrompt,
  aiReadinessPrompt,
  cheatSheetPrompt,
} from './prompts.js';

const DEFAULT_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  model: 'claude-sonnet-4-20250514',
  maxTokens: 8192,
  temperature: 0.3,
};

/**
 * Extract JSON from a response that may contain markdown code blocks
 */
function extractJson(response) {
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  return response;
}

/**
 * Validate and parse JSON response
 */
function validateAndParse(response) {
  const jsonStr = extractJson(response);
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonStr);
    throw new Error(`Failed to parse Claude response as JSON: ${error.message}`);
  }
}

/**
 * Claude Analysis Service
 * Handles all AI synthesis and report generation
 */
export class ClaudeAnalysisService {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = new Anthropic({ apiKey: this.config.apiKey });
  }

  /**
   * Make a completion request to Claude
   */
  async complete(systemPrompt, userPrompt) {
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return textBlock.text;
  }

  /**
   * Phase 1: Synthesize company profile from research data
   */
  async synthesizeCompanyProfile(extractedContent, researchData) {
    const systemPrompt = `You are an expert business analyst synthesizing research about a company for a sales intelligence platform. Always output valid JSON.`;

    const userPrompt = companyProfilePrompt(
      JSON.stringify(extractedContent, null, 2),
      JSON.stringify(researchData, null, 2)
    );

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Phase 2: Analyze competitive landscape
   */
  async analyzeCompetitiveLandscape(targetCompany, competitors, deepDiveData) {
    const systemPrompt = `You are a competitive intelligence analyst creating actionable competitive analysis. Always output valid JSON.`;

    const userPrompt = competitiveAnalysisPrompt(
      JSON.stringify(targetCompany, null, 2),
      JSON.stringify(competitors, null, 2),
      JSON.stringify(deepDiveData, null, 2)
    );

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Phase 3: Identify opportunities
   */
  async identifyOpportunities(context) {
    const systemPrompt = `You are a technology consultant identifying opportunities to build CUSTOM software, AI, and automation solutions.

CRITICAL CONTEXT:
- We do NOT recommend off-the-shelf SaaS products
- We identify problems and frame them as opportunities to BUILD CUSTOM SOLUTIONS
- The pitch is always "We build exactly what you need" - not "Buy this tool"
- We sell custom development services, not software licenses

Always output valid JSON.`;

    const userPrompt = opportunityIdentificationPrompt(
      JSON.stringify(context.companyData.profile, null, 2),
      JSON.stringify(context.competitorData, null, 2),
      JSON.stringify(context.industryData, null, 2),
      JSON.stringify(context.caseStudies, null, 2)
    );

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Phase 3: Score AI readiness
   */
  async scoreAIReadiness(context) {
    const systemPrompt = `You are an AI readiness assessment expert evaluating a company's preparedness for AI and automation investments. Always output valid JSON.`;

    const userPrompt = aiReadinessPrompt(
      JSON.stringify(context.companyData.profile, null, 2),
      JSON.stringify(context.competitorData, null, 2),
      JSON.stringify(context.industryData, null, 2)
    );

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Phase 4: Generate cheat sheet
   */
  async generateCheatSheet(context, opportunities) {
    const systemPrompt = `You are creating a sales cheat sheet that a sales rep can review in 3 minutes before a call. Be concise, specific, and actionable. Always output valid JSON.`;

    const userPrompt = cheatSheetPrompt(
      JSON.stringify(context.companyData.profile, null, 2),
      JSON.stringify(opportunities, null, 2),
      JSON.stringify(context.competitorData, null, 2)
    );

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Generate full consulting report
   */
  async generateFullReport(context, opportunities, scorecard) {
    const systemPrompt = `You are generating a comprehensive consulting-grade report on AI and automation opportunities. Always output valid JSON with structured sections.`;

    const userPrompt = `Generate a full consulting report based on:

COMPANY PROFILE:
${JSON.stringify(context.companyData.profile, null, 2)}

OPPORTUNITIES:
${JSON.stringify(opportunities, null, 2)}

AI READINESS:
${JSON.stringify(scorecard, null, 2)}

COMPETITIVE DATA:
${JSON.stringify(context.competitorData, null, 2)}

INDUSTRY DATA:
${JSON.stringify(context.industryData, null, 2)}

Output a comprehensive report with these sections:
1. Executive Summary
2. Company Analysis
3. Competitive Landscape
4. Technology Gap Analysis
5. Recommended Solutions (TOP 5)
6. Implementation Roadmap
7. Expected ROI
8. Risk Assessment
9. Next Steps

Format as JSON with clear section structure.`;

    const response = await this.complete(systemPrompt, userPrompt);
    return validateAndParse(response);
  }

  /**
   * Chat with context
   */
  async chat(messages, context) {
    const systemPrompt = `You are a helpful AI assistant for Aurora, a sales intelligence platform. You have access to research about ${context.companyData.profile.basics.name}.

CONTEXT:
${JSON.stringify(context.companyData.profile, null, 2)}

Your role:
1. Answer questions about this company and the analysis
2. Help refine talking points and conversation hooks
3. Provide source citations when asked
4. Suggest alternative approaches or phrasings
5. Help prepare for specific objections

IMPORTANT:
- We sell CUSTOM solutions, not off-the-shelf software
- Always frame opportunities as "what we would build"
- Be specific and cite sources when possible
- If you don't have information, say so clearly`;

    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    const content = textBlock?.type === 'text' ? textBlock.text : '';

    return {
      content,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    };
  }
}

// Export singleton instance
let serviceInstance = null;

export function getClaudeService() {
  if (!serviceInstance) {
    serviceInstance = new ClaudeAnalysisService();
  }
  return serviceInstance;
}

export default ClaudeAnalysisService;
