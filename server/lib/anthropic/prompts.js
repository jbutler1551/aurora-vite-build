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
    "employeeRange": "100-500 or null",
    "revenueRange": "$10M-$50M or null",
    "ownershipType": "private|public|pe-backed|family-owned|unknown",
    "description": "One paragraph company description"
  },
  "businessModel": {
    "primaryProducts": ["Product 1", "Product 2"],
    "targetCustomers": ["Customer segment 1", "Customer segment 2"],
    "geographicMarkets": ["Region 1", "Region 2"],
    "revenueModel": "subscription|one-time|services|hybrid",
    "valueProposition": "Core value proposition in one sentence"
  },
  "technologySignals": {
    "currentTechStack": ["Known tools/platforms"],
    "techMaturity": "low|medium|high",
    "techMaturityEvidence": "Why we assessed this level",
    "recentTechInvestments": ["Any known recent tech initiatives"],
    "techRelatedHiring": ["Relevant job postings that reveal tech needs"]
  },
  "painPointIndicators": [
    {
      "signal": "What we observed",
      "source": "Where we found this",
      "implication": "What this suggests about their needs",
      "confidence": "high|medium|low"
    }
  ],
  "growthSignals": [
    {
      "signal": "What we observed",
      "source": "Where we found this",
      "implication": "What this means"
    }
  ],
  "competitivePosition": {
    "marketPosition": "Description of their position",
    "knownCompetitors": ["Any competitors mentioned"],
    "differentiators": ["What they claim makes them different"]
  },
  "analysisNotes": "Any important caveats or notes about data quality, or null"
}

GUIDELINES:
- Only include information you can verify from the research
- Use null for fields where data is not available
- Be specific - avoid generic statements
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

OUTPUT REQUIREMENTS:
Return a JSON object with this structure:

{
  "overview": "Brief overview of competitive landscape",
  "matrix": [
    {
      "competitorName": "Competitor Name",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "techAdvantages": ["tech advantage they have over target"],
      "marketPosition": "Description of their market position"
    }
  ],
  "swot": {
    "strengths": ["Target company strengths vs competitors"],
    "weaknesses": ["Target company weaknesses vs competitors"],
    "opportunities": ["Opportunities based on competitive gaps"],
    "threats": ["Competitive threats to watch"]
  },
  "competitiveGaps": ["Specific capabilities competitors have that target lacks"],
  "recommendations": ["Strategic recommendations based on competitive analysis"]
}`;
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
            "signal": "What we observed",
            "source": "Where we found it",
            "strength": "strong|moderate|weak"
          }
        ],
        "businessImpact": "How this problem affects their business"
      },

      "competitivePressure": {
        "competitors": ["Competitor names"],
        "whatTheyHave": "What competitors have that target lacks",
        "urgencyLevel": "high|medium|low",
        "urgencyReason": "Why this urgency level"
      },

      "customSolution": {
        "whatWeBuild": "Specific description of the custom solution",
        "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "whyCustom": "Why custom is better than off-the-shelf for this",
        "integrations": ["What it would integrate with"]
      },

      "conversationHook": {
        "openingQuestion": "Exact words to start the conversation",
        "credibilityDetail": "The specific detail that makes this credible",
        "expectedResponse": "What response to expect",
        "followUp": "How to follow up on their response"
      },

      "evidenceStrength": {
        "score": 4,
        "reasoning": "Why this score (1-5 scale)"
      },

      "estimatedImpact": {
        "primaryBenefit": "Main benefit (e.g., '15-20% reduction in X')",
        "timeToValue": "How quickly they'd see results",
        "benchmarkSource": "Where this estimate comes from"
      }
    }
  ],

  "rankingRationale": "Why these three, in this order",

  "additionalOpportunities": [
    {
      "title": "Brief title",
      "category": "software|ai|automation",
      "summary": "One sentence description",
      "whyNotTop3": "Why this didn't make top 3"
    }
  ]
}

RANKING CRITERIA (in order of importance):
1. Evidence strength - Multiple signals from reliable sources
2. Competitive pressure - Clear gap vs. competitors
3. Conversation potential - Can generate a natural sales conversation
4. Business impact - Meaningful ROI potential

REMEMBER:
- Frame everything as "what we would build" not "what they should buy"
- The hook must be specific enough that the prospect thinks "this person understands my business"
- Include quantified impacts where possible, with source citations`;
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

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:

{
  "companySnapshot": {
    "name": "Company Name",
    "oneLiner": "What they do in one sentence",
    "industry": "Industry",
    "size": "~X employees, ~$XM revenue",
    "headquarters": "Location",
    "techMaturity": "low|medium|high",
    "techMaturityNote": "Brief explanation"
  },

  "topOpportunity": {
    "title": "Opportunity title",
    "category": "software|ai|automation",
    "problemSummary": "The problem in 2 sentences",

    "hook": {
      "opener": "Exact opening question/statement",
      "credibilityDetail": "The specific fact that makes this credible"
    },

    "whatWeBuild": "What we'd build in 2-3 sentences",
    "whyCustom": "Why custom beats off-the-shelf in 1 sentence",

    "competitorPressure": {
      "competitors": ["Competitor 1", "Competitor 2"],
      "whatTheyHave": "What they have that target lacks"
    },

    "evidence": ["Evidence point 1", "Evidence point 2"],
    "impact": "Expected impact/ROI"
  },

  "backupOpportunity1": {
    "title": "Second opportunity title",
    "category": "software|ai|automation",
    "hook": "Opening question",
    "whatWeBuild": "Brief description",
    "keyEvidence": "Main evidence point"
  },

  "backupOpportunity2": {
    "title": "Third opportunity title",
    "category": "software|ai|automation",
    "hook": "Opening question",
    "whatWeBuild": "Brief description",
    "keyEvidence": "Main evidence point"
  },

  "objectionHandlers": [
    {
      "objection": "We're not a technology company",
      "response": "Tailored response based on their context"
    },
    {
      "objection": "We've looked at software before, it never fits",
      "response": "Tailored response"
    },
    {
      "objection": "Custom sounds expensive",
      "response": "Tailored response"
    },
    {
      "objection": "What about ongoing maintenance?",
      "response": "Tailored response"
    },
    {
      "objection": "We already have systems in place",
      "response": "Tailored response"
    }
  ],

  "differentiationPitch": {
    "threeOptions": "There are three ways companies solve these problems: (1) Buy off-the-shelf... (2) Build internal team... (3) Partner with us...",
    "whyUs": "Why option 3 is best for them specifically"
  },

  "statsForConversation": [
    {
      "stat": "Specific statistic",
      "context": "How to use it in conversation",
      "source": "Source"
    }
  ],

  "doNotMention": ["Topics to avoid based on research"]
}

GUIDELINES:
- Keep everything scannable - this is a cheat sheet, not a report
- The hook must feel natural, not salesy
- Objection responses should reference their specific situation
- Stats should be relevant to their industry/size`;
}
