/**
 * Standard competitor enrichment fields
 */
export const COMPETITOR_ENRICHMENT_FIELDS = [
  { name: 'founding_year', description: 'Year the company was founded' },
  { name: 'employee_count', description: 'Approximate number of employees' },
  { name: 'employee_range', description: 'Employee count range (e.g., 50-100, 100-500)' },
  { name: 'headquarters', description: 'City and country of headquarters' },
  { name: 'funding_raised', description: 'Total funding raised (if private) or market cap indicator (if public)' },
  { name: 'key_products', description: 'Main products or services offered' },
  { name: 'target_customers', description: 'Primary customer segments they serve' },
  { name: 'pricing_model', description: 'How they charge (subscription, one-time, freemium, etc.)' },
  { name: 'notable_clients', description: 'Any publicly known customers or case studies' },
  { name: 'recent_news', description: 'Any significant recent announcements or news' },
  { name: 'technology_focus', description: 'Any AI, automation, or technology initiatives they have publicized' },
];

/**
 * Build company deep research query
 */
export function buildCompanyResearchQuery(companyName, companyUrl) {
  return `Comprehensive analysis of ${companyName} (${companyUrl}):

RESEARCH OBJECTIVES:
1. COMPANY OVERVIEW
   - Official company name and any DBAs
   - Year founded
   - Headquarters location
   - Company size (employees)
   - Revenue estimates (if available)
   - Ownership structure (public, private, PE-backed, family-owned)

2. BUSINESS MODEL
   - Primary products and services
   - Target customer segments
   - Geographic markets
   - Pricing model (if discernible)
   - Key value propositions

3. WEB PRESENCE ANALYSIS
   - Website quality and messaging
   - Social media presence (LinkedIn, Twitter, Facebook)
   - Content marketing activity
   - Online reviews and ratings

4. REVIEWS AND REPUTATION
   - Glassdoor employee reviews (look for pain points, tech mentions)
   - G2/Capterra reviews (if B2B software)
   - Google reviews (if B2C/local)
   - BBB rating and complaints
   - Industry-specific review sites

5. JOB POSTINGS ANALYSIS
   - Current open positions
   - Technology mentions in job descriptions
   - Skill requirements (reveals tech stack)
   - Growth signals (hiring velocity)
   - Pain point signals ("Excel-based", "manual process", etc.)

6. PRESS AND NEWS
   - Recent press releases
   - News mentions
   - Industry coverage
   - Awards and recognition

7. TECHNOLOGY SIGNALS
   - Tech stack mentions (BuiltWith, job postings, press)
   - Software/tools they use
   - Recent technology investments
   - Digital maturity indicators

8. LEADERSHIP
   - Key executives
   - Recent leadership changes
   - Executive backgrounds

9. FINANCIAL SIGNALS (if available)
   - Funding history
   - Recent investments
   - Growth indicators

Provide detailed, citation-backed findings for each section.`;
}

/**
 * Build regional competitor discovery query
 */
export function buildRegionalCompetitorQuery(companyName, industry, region, marketSegment) {
  return {
    entityType: 'companies',
    matchLimit: 10,
    generator: 'core',
    matchConditions: [
      {
        name: 'same_industry',
        description: `Company operates in the ${industry} industry`,
      },
      {
        name: 'regional_presence',
        description: `Company has significant operations or presence in ${region}`,
      },
      {
        name: 'competitive_overlap',
        description: `Company competes directly with ${companyName} in ${marketSegment}`,
      },
      {
        name: 'active_business',
        description: 'Company is currently active and operational (not defunct)',
      },
    ],
  };
}

/**
 * Build global competitor discovery query
 */
export function buildGlobalCompetitorQuery(companyName, industry, marketSegment) {
  return {
    entityType: 'companies',
    matchLimit: 10,
    generator: 'core',
    matchConditions: [
      {
        name: 'industry_leader',
        description: `Company is a recognized leader or significant player in ${industry}`,
      },
      {
        name: 'market_overlap',
        description: `Company competes in ${marketSegment}, regardless of geography`,
      },
      {
        name: 'scale',
        description: 'Company has meaningful market presence (not a tiny startup)',
      },
    ],
  };
}

/**
 * Build competitor deep dive query
 */
export function buildCompetitorDeepDiveQuery(competitorName) {
  return `Analyze ${competitorName}'s technology investments and digital capabilities:

1. TECHNOLOGY INVESTMENTS
   - AI/automation initiatives they've announced
   - Digital transformation projects
   - Technology partnerships
   - Tech-related acquisitions

2. DIGITAL CAPABILITIES
   - Customer-facing technology (portals, apps, APIs)
   - Internal systems mentioned (ERP, CRM, etc.)
   - Data/analytics capabilities
   - Automation level of operations

3. COMPETITIVE ADVANTAGES
   - What technology capabilities do they advertise?
   - What digital services do they offer that others don't?
   - Technology-based case studies

4. RECENT DEVELOPMENTS
   - Technology announcements in past 12 months
   - New hires in technology roles
   - Funding for tech initiatives

Provide specific, citation-backed findings.`;
}

/**
 * Build industry trends research query
 */
export function buildIndustryTrendsQuery(industry) {
  return `Research AI and automation trends in the ${industry} industry:

1. ADOPTION RATES
   - What percentage of ${industry} companies have adopted AI/automation?
   - How has this changed in the past 2-3 years?
   - What's the projected growth?

2. COMMON USE CASES
   - What are the most common AI/automation applications in ${industry}?
   - Which use cases have the highest ROI?
   - What technologies are most frequently deployed?

3. BARRIERS AND CHALLENGES
   - What prevents ${industry} companies from adopting AI?
   - Common implementation challenges
   - Skills gaps

4. VENDOR LANDSCAPE
   - Key technology vendors serving ${industry}
   - Notable partnerships
   - Market leaders vs. emerging players

5. REGULATORY CONSIDERATIONS
   - Any regulations affecting AI/automation adoption
   - Compliance requirements

6. CASE STUDIES
   - Successful AI/automation implementations in ${industry}
   - ROI figures and outcomes
   - Implementation timelines

Provide specific data points with sources.`;
}

/**
 * Build case study research query
 */
export function buildCaseStudyQuery(industry) {
  return `Find specific ROI case studies for AI and automation implementations in ${industry}:

1. DEMAND FORECASTING / INVENTORY OPTIMIZATION
   - Companies that implemented AI forecasting
   - Specific ROI percentages
   - Implementation timeline
   - Vendor/solution used (if custom or off-shelf)

2. PROCESS AUTOMATION
   - Companies that automated manual processes
   - Time/cost savings achieved
   - Specific processes automated

3. CUSTOMER EXPERIENCE
   - Self-service portal implementations
   - Chatbot/AI assistant deployments
   - Customer satisfaction improvements

4. DATA ANALYTICS / BUSINESS INTELLIGENCE
   - Analytics platform implementations
   - Decision-making improvements
   - Revenue impact

For each case study found, provide:
- Company name and size
- Problem they were solving
- Solution implemented (custom vs. off-shelf)
- Quantified results
- Timeline to value
- Source/citation`;
}

/**
 * Build competitor technology research query
 */
export function buildCompetitorTechQuery(competitorNames) {
  return `Analyze what technology investments these competitors have made:

COMPETITORS TO ANALYZE:
${competitorNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}

FOR EACH COMPETITOR, FIND:

1. TECHNOLOGY ANNOUNCEMENTS
   - AI/automation initiatives
   - Digital transformation projects
   - Technology partnerships
   - Recent tech-related news

2. VISIBLE CAPABILITIES
   - Customer portals or apps
   - API offerings
   - Self-service features
   - Automation level visible to customers

3. JOB POSTING SIGNALS
   - Tech roles being hired
   - Technologies mentioned in job posts
   - Team size indicators

4. VENDOR RELATIONSHIPS
   - Known software vendors they use
   - Technology partners mentioned
   - Integration announcements

Provide specific examples with dates and sources where possible.`;
}

/**
 * Build competitor monitor query
 */
export function buildCompetitorMonitorQuery(competitorName) {
  return `Monitor news and announcements about ${competitorName}:
- Product launches and updates
- Funding announcements or M&A activity
- Leadership changes (new CEO, CTO, etc.)
- Technology partnerships or integrations
- Major customer wins or case studies
- Pricing changes
- Layoffs or expansion news`;
}

/**
 * Build industry technology monitor query
 */
export function buildIndustryTechMonitorQuery(industry) {
  return `Monitor AI and automation developments in ${industry}:
- New AI/automation vendors entering the space
- Major technology implementations by industry players
- Regulatory changes affecting technology adoption
- Industry reports on digital transformation
- Significant partnerships between tech vendors and ${industry} companies`;
}
