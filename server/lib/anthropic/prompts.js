/**
 * Company Profile Synthesis Prompt
 */
export function companyProfilePrompt(extractedContent, researchData) {
  return `Synthesize the following research data into a structured company profile:

<research_data>
${researchData}
</research_data>

<website_content>
${extractedContent}
</website_content>

CRITICAL ANTI-HALLUCINATION RULES:
1. NEVER fabricate data. If you cannot find information, use "unknown" or null.
2. Employee counts for well-known companies should be researched carefully:
   - Major brands/subsidiaries typically have thousands of employees
   - If a company is a subsidiary of a Fortune 500 (like GM, Ford, etc.), note this relationship
   - When unsure, say "unknown" rather than guess wrong
3. For any claim, you MUST have a source from the research data. No invented facts.
4. If research mentions a parent company (e.g., "OnStar is a subsidiary of General Motors"), ALWAYS include this in parentCompany.
5. Tech maturity ratings must include SPECIFIC evidence, not generic statements.

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:

{
  "basics": {
    "name": "Official company name",
    "domain": "company.com",
    "industry": "Primary industry",
    "subIndustry": "More specific classification or null",
    "headquarters": "City, State/Country",
    "foundedYear": 2010,
    "employeeRange": "100-500 or 'unknown' - NEVER guess for large companies",
    "revenueRange": "$10M-$50M or 'unknown'",
    "ownershipType": "private|public|subsidiary|pe-backed|family-owned|unknown",
    "description": "One paragraph company description"
  },
  "parentCompany": {
    "name": "Parent company name if subsidiary, or null",
    "relationship": "wholly-owned subsidiary|majority-owned|division|brand|null",
    "implication": "What this ownership means for decision-making and budget"
  },
  "businessModel": {
    "primaryProducts": ["Product 1", "Product 2"],
    "targetCustomers": ["Customer segment 1", "Customer segment 2"],
    "geographicMarkets": ["Region 1", "Region 2"],
    "revenueModel": "subscription|one-time|services|hybrid",
    "valueProposition": "Core value proposition in one sentence"
  },
  "technologySignals": {
    "currentTechStack": ["Known tools/platforms - only include if found in research"],
    "techMaturity": "low|medium|high",
    "techMaturityEvidence": "SPECIFIC evidence: job postings, tech announcements, integrations found",
    "techMaturityContext": "For a [industry] company, what 'high' vs 'low' actually means",
    "recentTechInvestments": ["Specific initiatives with dates if available"],
    "techRelatedHiring": ["Relevant job postings with role titles"]
  },
  "socialMediaPresence": {
    "linkedin": { "url": "linkedin URL or null", "followers": "count or null", "activity": "active|moderate|minimal|unknown" },
    "twitter": { "url": "twitter URL or null", "followers": "count or null", "activity": "active|moderate|minimal|unknown" },
    "otherPlatforms": ["List any other significant social media found"],
    "contentThemes": ["Main topics they post about"]
  },
  "recentPress": [
    {
      "headline": "News headline or announcement",
      "date": "Approximate date or timeframe",
      "source": "Publication name",
      "relevance": "Why this matters for sales conversation"
    }
  ],
  "hiringSignals": {
    "activeJobCount": "Number of open positions or 'unknown'",
    "keyRoles": ["Notable open positions that reveal priorities"],
    "techRoles": ["Technology-related positions"],
    "hiringTrends": "Growing|stable|contracting|unknown",
    "painPointsFromJobs": ["Specific phrases from job postings that reveal problems, e.g., 'manual Excel processes'"]
  },
  "painPointIndicators": [
    {
      "signal": "What we observed - be SPECIFIC",
      "source": "Exact source: 'Glassdoor review from March 2024' or 'Job posting for Data Analyst'",
      "sourceUrl": "URL if available, or null",
      "implication": "What this suggests about their needs",
      "confidence": "high|medium|low"
    }
  ],
  "customerSignals": {
    "reviews": {
      "platforms": ["G2", "Glassdoor", "Google", etc. - which were checked"],
      "overallSentiment": "positive|mixed|negative|unknown",
      "commonComplaints": ["Specific complaint themes found"],
      "commonPraises": ["Specific praise themes found"]
    },
    "notableClients": ["Any known customers mentioned in research"]
  },
  "growthSignals": [
    {
      "signal": "What we observed",
      "source": "Specific source",
      "implication": "What this means for sales opportunity"
    }
  ],
  "competitivePosition": {
    "marketPosition": "Description of their position with evidence",
    "knownCompetitors": ["Competitors mentioned in research"],
    "differentiators": ["What they claim makes them different"],
    "marketThreats": ["Emerging threats: tech giants entering space, substitute products, etc."]
  },
  "dataQuality": {
    "overallConfidence": "high|medium|low",
    "strongDataAreas": ["Areas where we have good data"],
    "weakDataAreas": ["Areas where data is limited or uncertain"],
    "dataGaps": ["What we couldn't find that would be helpful"]
  },
  "analysisNotes": "Important caveats about this profile, or null"
}

GUIDELINES:
- VERIFY before including: If you're unsure about employee count for a major brand, say "unknown"
- Parent companies matter: A subsidiary of GM has very different dynamics than a startup
- Sources required: Every painPointIndicator must have a real source from the research
- Tech maturity context: "high" for a tech company means something different than "high" for manufacturing
- Be specific: "Manual Excel processes mentioned in Data Analyst job posting" not "They use spreadsheets"
- For painPointIndicators, look especially for job postings mentioning manual processes, Excel, outdated systems
- Confidence should be "high" if multiple sources confirm, "medium" if single strong source, "low" if inferred`;
}

/**
 * Competitive Analysis Prompt
 */
export function competitiveAnalysisPrompt(targetCompany, competitors, deepDiveData) {
  return `Analyze the competitive landscape for the target company:

<target_company>
${targetCompany}
</target_company>

<competitors>
${competitors}
</competitors>

<competitor_deep_dives>
${deepDiveData}
</competitor_deep_dives>

CRITICAL: THINK BEYOND DIRECT COMPETITORS

Competition is NOT just "companies that sell the same product." Consider:

1. DIRECT COMPETITORS: Companies selling similar products/services
2. MARKET DISRUPTORS: Tech giants (Google, Amazon, Apple, Microsoft) entering this space
3. SUBSTITUTE PRODUCTS: Alternative solutions customers might choose instead
   - For OnStar example: smartphone apps, Apple CarPlay, Android Auto, OEM alternatives
4. EMERGING THREATS: Startups or new entrants with innovative approaches
5. CUSTOMER DIY OPTIONS: What happens if customers just do it themselves?

For each threat type, consider:
- Is this an ACTUAL threat today or a POTENTIAL future threat?
- How does this affect the target company's positioning?
- What's the timeline for this threat to materialize?

OUTPUT REQUIREMENTS:
Return a JSON object with this structure:

{
  "overview": "Brief overview of competitive landscape - include ALL threat types identified",

  "competitorsByType": {
    "directCompetitors": [
      {
        "name": "Company Name",
        "description": "What they do",
        "threatLevel": "high|medium|low",
        "threatReason": "Why this threat level"
      }
    ],
    "marketDisruptors": [
      {
        "name": "Tech giant or large company entering space",
        "description": "What they're doing in this market",
        "entryStatus": "already active|announced plans|rumored|potential",
        "threatLevel": "high|medium|low",
        "threatReason": "Why this matters",
        "source": "How we know this (news article, announcement, etc.)"
      }
    ],
    "substituteProducts": [
      {
        "name": "Alternative solution",
        "description": "What it does that competes",
        "adoptionTrend": "growing|stable|declining",
        "threatLevel": "high|medium|low",
        "threatReason": "Why customers might choose this instead"
      }
    ],
    "emergingThreats": [
      {
        "name": "Startup or new entrant",
        "description": "Their approach",
        "timeline": "immediate|1-2 years|3+ years",
        "threatLevel": "high|medium|low"
      }
    ]
  },

  "matrix": [
    {
      "competitorName": "Competitor Name",
      "competitorType": "direct|disruptor|substitute|emerging",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "techAdvantages": ["tech advantage they have over target"],
      "marketPosition": "Description of their market position"
    }
  ],

  "swot": {
    "strengths": ["Target company strengths - be SPECIFIC to their situation"],
    "weaknesses": ["Target company weaknesses - be SPECIFIC and actionable"],
    "opportunities": ["Opportunities based on competitive gaps - with context"],
    "threats": [
      {
        "threat": "Specific competitive threat",
        "source": "Which competitor/disruptor causes this",
        "timeline": "How urgent is this",
        "mitigation": "How target company could address this"
      }
    ]
  },

  "competitiveGaps": [
    {
      "gap": "Specific capability that competitors have",
      "whoHasIt": ["Competitor 1", "Competitor 2"],
      "impactOnTarget": "How this gap affects the target company",
      "difficultyToClose": "easy|medium|hard",
      "recommendation": "What target should do about this"
    }
  ],

  "recommendations": [
    {
      "recommendation": "Strategic recommendation",
      "rationale": "Why this is important based on competitive analysis",
      "priority": "immediate|short-term|long-term",
      "competitorContext": "Which competitive threat this addresses"
    }
  ]
}

GUIDELINES:
- Don't just list "similar companies" - think about what ACTUALLY threatens this business
- For tech-enabled services (like OnStar), consider smartphone alternatives and tech giant entry
- Include timeline context - is this threat immediate or future?
- Be specific about WHY something is a threat, not just that it exists`;
}

/**
 * Opportunity Identification Prompt
 */
export function opportunityIdentificationPrompt(companyProfile, competitiveAnalysis, industryTrends, caseStudies) {
  return `Identify the TOP 3 opportunities for custom software, AI, or automation builds:

<company_profile>
${companyProfile}
</company_profile>

<competitive_analysis>
${competitiveAnalysis}
</competitive_analysis>

<industry_trends>
${industryTrends}
</industry_trends>

<case_studies>
${caseStudies}
</case_studies>

CRITICAL VALIDATION RULES:

1. NO UNSOURCED CLAIMS: Every strategic reference (like "expansion plans", "new market entry") MUST have a public source:
   - Press release, earnings call, news article, job posting
   - If you cannot cite a source, DO NOT mention it
   - Example of BAD: "Their insurance expansion plans suggest..." (where did you learn this?)
   - Example of GOOD: "Their Q3 2024 earnings call mentioned insurance partnerships, suggesting..."

2. CONVERSATION HOOK SENSITIVITY:
   - NEVER imply criticism of their current approach
   - NEVER assume knowledge of internal strategic plans
   - NEVER use language that could embarrass the prospect
   - DO frame hooks as curiosity and interest, not "we noticed you're struggling with..."

   BAD HOOKS:
   - "I noticed you're still using manual processes..." (implies they're behind)
   - "Your expansion into insurance isn't going well..." (assumes internal knowledge)

   GOOD HOOKS:
   - "I'm curious how you're thinking about [X] given the industry trends..."
   - "Companies in your space are exploring [Y] - is that on your radar?"

3. EVIDENCE VALIDATION:
   - For each opportunity, list ONLY evidence you can cite from the research
   - If evidence is weak (only 1-2 signals), lower the rank or exclude
   - Don't elevate opportunities just because they sound good - they need backing

4. INDUSTRY CONTEXT REQUIRED:
   - Any industry-specific term or trend must be explained
   - Don't assume the sales rep knows what "connected car ecosystem" means

OUTPUT REQUIREMENTS:
Return a JSON object with this structure:

{
  "opportunities": [
    {
      "rank": 1,
      "title": "Clear, specific title (e.g., 'Custom AI Demand Forecasting System')",
      "category": "software|ai|automation",

      "problem": {
        "description": "Specific problem they have",
        "evidence": [
          {
            "signal": "What we observed - SPECIFIC",
            "source": "EXACT source with date if available (e.g., 'Job posting for Data Analyst, Nov 2024')",
            "sourceUrl": "URL if available",
            "strength": "strong|moderate|weak"
          }
        ],
        "businessImpact": "How this problem affects their business",
        "howWeKnow": "Why we believe this is a real problem, not an assumption"
      },

      "competitivePressure": {
        "competitors": ["Competitor names"],
        "whatTheyHave": "What competitors have that target lacks",
        "source": "How we know competitors have this",
        "urgencyLevel": "high|medium|low",
        "urgencyReason": "Why this urgency level - with evidence"
      },

      "customSolution": {
        "whatWeBuild": "Specific description of the custom solution",
        "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "whyCustom": "Why custom is better than off-the-shelf for this specific company",
        "integrations": ["What it would integrate with"],
        "differentiator": "What makes our approach unique"
      },

      "conversationHook": {
        "openingQuestion": "Curiosity-based question - MUST NOT imply criticism",
        "credibilityDetail": "The specific PUBLIC fact that makes this credible",
        "credibilitySource": "Where we learned this fact",
        "expectedResponse": "What response to expect",
        "followUp": "How to follow up on their response",
        "sensitivityCheck": "Confirm this hook won't embarrass or upset the prospect"
      },

      "evidenceStrength": {
        "score": 4,
        "reasoning": "Why this score (1-5 scale) - reference specific evidence",
        "strongestSignal": "The single most compelling piece of evidence",
        "gaps": "What evidence would make this stronger"
      },

      "estimatedImpact": {
        "primaryBenefit": "Main benefit (e.g., '15-20% reduction in X')",
        "timeToValue": "How quickly they'd see results",
        "benchmarkSource": "SPECIFIC source for this estimate (industry report name, case study company)",
        "caveats": "Any caveats or assumptions in this estimate"
      },

      "industryContext": {
        "relevantTerms": [
          {
            "term": "Any jargon used",
            "meaning": "What it means in plain English"
          }
        ],
        "whyNow": "Why this opportunity is timely - with evidence"
      }
    }
  ],

  "rankingRationale": "Why these three, in this order - reference evidence strength",

  "qualityAssurance": {
    "sourceCoverage": "How much of this analysis is backed by specific sources vs. inference",
    "confidenceLevel": "Overall confidence in these recommendations",
    "keyAssumptions": ["List any assumptions we're making"],
    "whatWeCouldntVerify": ["Things we tried to find but couldn't confirm"]
  },

  "additionalOpportunities": [
    {
      "title": "Brief title",
      "category": "software|ai|automation",
      "summary": "One sentence description",
      "whyNotTop3": "Why this didn't make top 3 - usually weak evidence"
    }
  ]
}

RANKING CRITERIA (in order of importance):
1. Evidence strength - Multiple signals from reliable, specific sources
2. Competitive pressure - Clear gap vs. competitors (with evidence)
3. Conversation potential - Can generate a natural, non-offensive sales conversation
4. Business impact - Meaningful ROI potential (with benchmark sources)

REMEMBER:
- Frame everything as "what we would build" not "what they should buy"
- The hook must be specific enough that the prospect thinks "this person understands my business"
- BUT the hook must NEVER imply criticism or assume internal knowledge
- Include quantified impacts where possible, with REAL source citations
- If you can't find good evidence, say so - don't fabricate`;
}

/**
 * AI Readiness Scoring Prompt
 */
export function aiReadinessPrompt(companyProfile, competitorData, industryData) {
  return `Evaluate the company's AI readiness based on research:

<company_profile>
${companyProfile}
</company_profile>

<competitor_data>
${competitorData}
</competitor_data>

<industry_data>
${industryData}
</industry_data>

OUTPUT REQUIREMENTS:
Return a JSON object with this structure:

{
  "overallScore": 65,
  "overallRating": "low|medium|high|very-high",
  "generatedAt": "${new Date().toISOString()}",

  "dimensions": {
    "digitalMaturity": {
      "score": 70,
      "weight": 0.20,
      "weightedScore": 14,
      "rating": "medium",
      "evidence": ["evidence point 1", "evidence point 2"],
      "explanation": "Why this score"
    },
    "dataInfrastructure": {
      "score": 50,
      "weight": 0.20,
      "weightedScore": 10,
      "rating": "low",
      "evidence": ["evidence point"],
      "explanation": "Why this score"
    },
    "competitivePressure": {
      "score": 80,
      "weight": 0.15,
      "weightedScore": 12,
      "rating": "high",
      "evidence": ["evidence point"],
      "explanation": "Why this score"
    },
    "industryAdoption": {
      "score": 60,
      "weight": 0.15,
      "weightedScore": 9,
      "rating": "medium",
      "evidence": ["evidence point"],
      "explanation": "Why this score"
    },
    "organizationalSignals": {
      "score": 55,
      "weight": 0.15,
      "weightedScore": 8.25,
      "rating": "medium",
      "evidence": ["evidence point"],
      "explanation": "Why this score"
    },
    "resourceCapacity": {
      "score": 70,
      "weight": 0.15,
      "weightedScore": 10.5,
      "rating": "medium",
      "evidence": ["evidence point"],
      "explanation": "Why this score"
    }
  },

  "summary": "One paragraph summary of overall readiness",
  "keyStrengths": ["strength 1", "strength 2"],
  "keyGaps": ["gap 1", "gap 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Scoring Guidelines:
- 0-30: Low readiness (significant barriers)
- 31-60: Medium readiness (some foundation, gaps remain)
- 61-80: High readiness (good foundation, ready for investment)
- 81-100: Very high readiness (already investing, expand scope)`;
}

/**
 * Cheat Sheet Generation Prompt
 */
export function cheatSheetPrompt(companyProfile, opportunities, competitiveAnalysis) {
  return `Generate a sales cheat sheet for a 3-minute pre-call review:

<company_profile>
${companyProfile}
</company_profile>

<opportunities>
${opportunities}
</opportunities>

<competitive_analysis>
${competitiveAnalysis}
</competitive_analysis>

CRITICAL RULES FOR QUALITY OUTPUT:

1. CONTEXT IS MANDATORY: If you mention any industry-specific term, strategic initiative, or market trend (e.g., "insurance expansion"), you MUST:
   - Explain what it means in 1 sentence
   - Cite where you learned about it (press release, earnings call, etc.)
   - If you cannot cite a source, DO NOT mention it

2. PARENT COMPANY AWARENESS: If company is a subsidiary (check parentCompany in profile):
   - Note this prominently in companySnapshot
   - Consider how parent company affects decision-making, budgets, vendor selection
   - Example: "OnStar is wholly-owned by General Motors - decisions likely involve GM corporate"

3. OBJECTION HANDLERS MUST BE SPECIFIC:
   - Reference actual facts from the research
   - Include specific examples from their industry or situation
   - Generic responses are NOT acceptable

4. DO NOT MENTION SECTION:
   - Must include WHY each topic should be avoided
   - Based on actual research findings (negative reviews, sensitive topics, etc.)

5. CONVERSATION HOOKS - SENSITIVITY CHECK:
   - Never assume knowledge of internal strategic plans unless publicly announced
   - Don't use hooks that imply criticism of their current approach
   - Frame as curiosity, not "we noticed you're failing at..."

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:

{
  "companySnapshot": {
    "name": "Company Name",
    "oneLiner": "What they do in one sentence",
    "industry": "Industry",
    "size": "~X employees, ~$XM revenue (or 'size unknown' if not confirmed)",
    "headquarters": "Location",
    "parentCompany": "Parent company name if subsidiary, otherwise null",
    "parentCompanyNote": "If subsidiary, note: 'Wholly-owned by X - expect corporate approval processes'",
    "techMaturity": "low|medium|high",
    "techMaturityNote": "SPECIFIC evidence: 'Based on [job postings for X / announcement of Y / tech stack Z]'"
  },

  "keyContext": {
    "mustKnowFacts": [
      {
        "fact": "Important context like parent company, recent merger, public vs private",
        "whyItMatters": "How this affects the sales conversation"
      }
    ],
    "recentDevelopments": [
      {
        "development": "Recent news or announcement",
        "date": "When (if known)",
        "source": "Where you found this",
        "conversationUse": "How to reference this naturally"
      }
    ]
  },

  "topOpportunity": {
    "title": "Opportunity title",
    "category": "software|ai|automation",
    "problemSummary": "The problem in 2 sentences",

    "hook": {
      "opener": "Exact opening question/statement - must be curiosity-based, not critical",
      "credibilityDetail": "The specific PUBLIC fact that makes this credible",
      "source": "Where you learned this (job posting, press release, etc.)"
    },

    "whatWeBuild": "What we'd build in 2-3 sentences",
    "whyCustom": "Why custom beats off-the-shelf in 1 sentence",

    "competitorPressure": {
      "competitors": ["Competitor 1", "Competitor 2"],
      "whatTheyHave": "What they have that target lacks",
      "source": "How we know this"
    },

    "evidence": ["Evidence point 1 with source", "Evidence point 2 with source"],
    "impact": "Expected impact/ROI - cite benchmark source if quantified"
  },

  "backupOpportunity1": {
    "title": "Second opportunity title",
    "category": "software|ai|automation",
    "hook": "Opening question - curiosity-based",
    "whatWeBuild": "Brief description",
    "keyEvidence": "Main evidence point with source"
  },

  "backupOpportunity2": {
    "title": "Third opportunity title",
    "category": "software|ai|automation",
    "hook": "Opening question - curiosity-based",
    "whatWeBuild": "Brief description",
    "keyEvidence": "Main evidence point with source"
  },

  "objectionHandlers": [
    {
      "objection": "We're not a technology company",
      "response": "Tailored response referencing THEIR specific situation from research",
      "evidenceToUse": "The specific fact from research that supports this response"
    },
    {
      "objection": "We've looked at software before, it never fits",
      "response": "Tailored response - acknowledge their specific industry challenges",
      "evidenceToUse": "Reference their industry's common software problems"
    },
    {
      "objection": "Custom sounds expensive",
      "response": "Tailored response with industry-specific ROI context",
      "evidenceToUse": "Cite relevant benchmark or case study from research"
    },
    {
      "objection": "What about ongoing maintenance?",
      "response": "Tailored response",
      "evidenceToUse": "How similar companies handle this"
    },
    {
      "objection": "We already have systems in place",
      "response": "Tailored response - integration-focused",
      "evidenceToUse": "What you learned about their current tech stack"
    }
  ],

  "differentiationPitch": {
    "threeOptions": "There are three ways companies solve these problems: (1) Buy off-the-shelf... (2) Build internal team... (3) Partner with us...",
    "whyUs": "Why option 3 is best for THEM specifically - reference their situation"
  },

  "statsForConversation": [
    {
      "stat": "Specific statistic",
      "context": "How to use it in conversation",
      "source": "Exact source - publication name, date if available"
    }
  ],

  "doNotMention": [
    {
      "topic": "Topic to avoid",
      "reason": "WHY this should be avoided - e.g., 'negative Glassdoor reviews about this' or 'ongoing lawsuit'"
    }
  ],

  "industryTermsGlossary": [
    {
      "term": "Any industry jargon used in this cheat sheet",
      "meaning": "What it means in plain English",
      "context": "Why it's relevant to this prospect"
    }
  ]
}

GUIDELINES:
- Keep everything scannable - this is a cheat sheet, not a report
- The hook must feel natural, not salesy - curiosity > criticism
- Objection responses MUST reference specific facts from research
- Stats should be relevant to their industry/size with REAL sources
- If you mention something like "insurance expansion plans" - explain what this means and where you learned it
- Parent company status is CRITICAL - a GM subsidiary has different dynamics than a startup`;
}
