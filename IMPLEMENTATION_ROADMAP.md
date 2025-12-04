# Aurora Analysis System - Implementation Roadmap

## Overview

This roadmap outlines porting the **real Parallel API + Anthropic Claude integration** from the original Next.js Aurora build to the Vite build. Currently, the Vite build only has mock data - this work will make the analysis system fully functional.

---

## Current State

**What exists:**
- Frontend: Full UI with progress display, polling every 5 seconds
- Backend: Express routes for creating/listing analyses
- Mock analysis: Simulates progress with 2-second delays
- Webhook endpoint: Ready to receive Parallel API updates

**What's missing:**
- Real Parallel API integration (data gathering)
- Real Anthropic Claude integration (AI synthesis)
- Job queue for long-running tasks
- All prompts and queries from original build

---

## Architecture

```
User enters URL
       ↓
┌─────────────────────────────────────────────────────────────┐
│                    PARALLEL API                              │
│  (Data Gathering - can take hours)                          │
│                                                              │
│  • extract() - Get website content                          │
│  • deepResearch() - Company research across sources         │
│  • findAll() - Discover competitors                         │
│  • enrich() - Get company details                           │
│  • deepDive() - Deep competitor analysis                    │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│                  ANTHROPIC CLAUDE                            │
│  (AI Synthesis - uses claude-sonnet-4-20250514)                     │
│                                                              │
│  • synthesizeCompanyProfile() - Create profile from data    │
│  • analyzeCompetitiveLandscape() - Analyze competitors      │
│  • identifyOpportunities() - Find TOP 3 opportunities       │
│  • scoreAIReadiness() - 0-100 readiness score               │
│  • generateCheatSheet() - 3-min sales prep                  │
└─────────────────────────────────────────────────────────────┘
       ↓
   Final Report
```

---

## Implementation Phases

### Phase 1: Parallel API Gateway
**Files to create:**
- `server/lib/parallel/gateway.js` - API client wrapper
- `server/lib/parallel/queries.js` - All query builders
- `server/lib/parallel/types.js` - TypeScript types (optional)

**Queries to port:**
1. `buildCompanyResearchQuery()` - 9-section deep research
2. `buildRegionalCompetitorQuery()` - FindAll regional competitors
3. `buildGlobalCompetitorQuery()` - FindAll global competitors
4. `buildCompetitorDeepDiveQuery()` - Deep dive each competitor
5. `buildIndustryTrendsQuery()` - AI/automation trends
6. `buildCaseStudyQuery()` - ROI case studies
7. `buildCompetitorTechQuery()` - Competitor technology analysis

---

### Phase 2: Anthropic Claude Service
**Files to create:**
- `server/lib/anthropic/service.js` - Claude API client
- `server/lib/anthropic/prompts.js` - All 5 prompts
- `server/lib/anthropic/schemas.js` - JSON response schemas

**Prompts to port:**

1. **companyProfilePrompt()** - Synthesize company profile
   - Input: Extracted website content + research data
   - Output: Structured CompanyProfile JSON

2. **competitiveAnalysisPrompt()** - Analyze competitive landscape
   - Input: Target company + competitors + deep dive data
   - Output: CompetitiveAnalysis JSON

3. **opportunityIdentificationPrompt()** - Identify TOP 3 opportunities
   - CRITICAL: Frames as "what we BUILD", not "buy"
   - Input: Company profile + competitive analysis + trends
   - Output: Array of 3 ranked opportunities

4. **aiReadinessPrompt()** - Score AI readiness (0-100)
   - Input: Full analysis context
   - Output: AIReadinessScorecard JSON

5. **cheatSheetPrompt()** - Generate sales cheat sheet
   - Input: All above + opportunities
   - Output: CheatSheet JSON (3-minute pre-call prep)

---

### Phase 3: Analysis Worker (Orchestration)
**Files to create:**
- `server/lib/jobs/queue.js` - BullMQ queue setup (optional - can use in-process)
- `server/lib/jobs/worker.js` - Full 4-phase orchestration

**4-Phase Pipeline:**

```
PHASE 1: Company Deep Dive (5-30%)
├── 1a. Extract website content (Parallel extract)
├── 1b. Deep research company (Parallel deepResearch)
└── 1c. Synthesize profile (Claude companyProfilePrompt)

PHASE 2: Competitive Landscape (30-70%)
├── 2a. Find regional competitors (Parallel findAll regional)
├── 2b. Find global competitors (Parallel findAll global)
├── 2c. Enrich all competitors (Parallel enrich)
├── 2d. Deep dive top competitors (Parallel deepDive x5)
└── 2e. Analyze landscape (Claude competitiveAnalysisPrompt)

PHASE 3: Opportunity Mapping (75-88%)
├── 3a. Research industry trends (Parallel deepResearch)
├── 3b. Analyze competitor tech (Parallel deepResearch)
├── 3c. Find case studies (Parallel deepResearch)
├── 3d. Identify opportunities (Claude opportunityPrompt)
└── 3e. Score AI readiness (Claude aiReadinessPrompt)

PHASE 4: Generate Outputs (90-100%)
├── 4a. Generate cheat sheet (Claude cheatSheetPrompt)
└── 4b. Generate full report (Claude reportPrompt)
```

---

### Phase 4: Integration & Progress Updates
**Files to modify:**
- `server/routes/analysis.js` - Use real worker instead of mock

**Progress updates flow:**
```
Worker runs → Updates database status/progress
                         ↓
            Frontend polls every 5 seconds
                         ↓
            UI shows real-time progress
```

---

## File Structure After Implementation

```
server/
├── lib/
│   ├── parallel/
│   │   ├── gateway.js      # Parallel API client
│   │   ├── queries.js      # All query builders
│   │   └── types.js        # TypeScript types
│   ├── anthropic/
│   │   ├── service.js      # Claude API client
│   │   ├── prompts.js      # All 5 prompts
│   │   └── schemas.js      # JSON response schemas
│   └── jobs/
│       ├── queue.js        # Optional BullMQ setup
│       └── worker.js       # 4-phase orchestration
├── routes/
│   ├── analysis.js         # Updated to use real worker
│   └── webhook.js          # Already exists
└── index.js
```

---

## Environment Variables Required

```env
# Parallel API
PARALLEL_API_KEY=your-parallel-api-key
PARALLEL_API_URL=https://api.parallel.ai
PARALLEL_WEBHOOK_SECRET=your-webhook-secret

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Webhook (for long-running analyses)
WEBHOOK_BASE_URL=https://your-deployed-app.com

# Feature flag (remove after implementation)
USE_MOCK_ANALYSIS=false
```

---

## Testing Plan

1. **Unit tests:** Each Parallel query builder
2. **Unit tests:** Each Claude prompt with sample data
3. **Integration test:** Full pipeline with mock APIs
4. **E2E test:** Real analysis with test company URL
5. **Load test:** Multiple concurrent analyses

---

## Estimated Effort

| Phase | Description | Complexity |
|-------|-------------|------------|
| 1 | Parallel API Gateway | Medium |
| 2 | Anthropic Claude Service | Medium |
| 3 | Analysis Worker | High |
| 4 | Integration | Low |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Parallel API rate limits | Implement queue with rate limiting |
| Long-running analyses timeout | Use webhooks, not direct responses |
| Claude API costs | Cache results, use sonnet model |
| Missing API keys in production | Fallback to mock mode |

---

## Ready for Approval

This roadmap covers the complete implementation of the real Parallel + Anthropic analysis system. The frontend is already set up to display progress in real-time.

**Awaiting your approval to begin implementation.**
