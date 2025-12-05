# Aurora Analysis System

## Overview

Aurora is an AI-powered sales intelligence platform that performs deep competitive analysis and market research for B2B companies. The system combines real-time web scraping (via Parallel API) with AI synthesis (via Anthropic Claude) to generate comprehensive sales intelligence reports, including company profiles, competitive landscapes, SWOT analyses, and actionable sales talk tracks.

The application is built as a full-stack Vite + React + Express application with Prisma ORM for database management. It features a dual-theme UI (light "old money" cream/brown aesthetic and dark mode with aurora borealis effects) and provides real-time progress tracking for long-running analysis jobs that can take hours to complete.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** Vite + React 19 with TypeScript
- **UI Components:** Radix UI primitives with custom styling
- **Styling:** Tailwind CSS with custom theme configuration
- **3D Graphics:** Three.js for decorative sphere visualizations
- **Routing:** React Router v6 with protected routes
- **State Management:** React Context API for auth and theme
- **Form Handling:** React Hook Form with resolvers

**Design System:**
- Dual theme support (light/dark mode)
- Light mode: Warm cream/brown "old money" aesthetic (#ebe3d3 background, #5C4A2A accents)
- Dark mode: Black background (#0a0a0a) with aurora borealis gradient effects (cyan, emerald, purple, pink)
- Glassmorphism effects with backdrop-blur for modern UI elements
- Custom theme toggle with carved-in switch appearance

**Key Pages:**
- Marketing pages: Home, Why Aurora, Features, Pricing
- Authentication: Login/Signup with separate auth layout
- Dashboard: Analysis management, company tracking, monitors, reports, AI academy
- Protected routes with authentication middleware

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js (ES modules)
- **Framework:** Express.js v5
- **ORM:** Prisma Client
- **Authentication:** JWT with bcrypt password hashing
- **Session Management:** Cookie-based with httpOnly cookies

**API Structure:**
- `/api/auth` - Authentication endpoints (login, register, logout, session check)
- `/api/analysis` - Analysis CRUD and job management
- `/api/company` - Company data endpoints
- `/api/webhooks` - Webhook receivers for Parallel API callbacks
- `/health` and `/api/health` - Health check endpoints (critical for deployment)

**Analysis Pipeline:**
The analysis workflow is divided into 6 phases with progress tracking:

1. **Phase 1 (0-15%):** Website extraction using Parallel Extract API
2. **Phase 2 (15-30%):** Deep company research via Parallel Deep Research
3. **Phase 3 (30-50%):** Competitor discovery using Parallel FindAll
4. **Phase 4 (50-70%):** Competitor analysis with enrichment
5. **Phase 5 (70-90%):** SWOT analysis and competitive positioning via Claude
6. **Phase 6 (90-100%):** Sales talk tracks and final report generation

**Job Processing:**
- Long-running analyses are processed asynchronously via worker functions
- Progress updates are stored in the database and polled by the frontend
- Activity logging system sanitizes technical details for user-friendly display
- Real-time activity feed via server-sent events (SSE) using EventEmitter

**Mock vs Real Mode:**
- System automatically detects if API keys are configured
- Falls back to mock analysis if Parallel or Anthropic keys are missing
- Environment variable `USE_MOCK_ANALYSIS=true` forces mock mode
- Mock mode simulates progress with 2-second delays for testing

### Data Storage

**Database:** PostgreSQL (via Prisma ORM)

**Schema Design:**
- `User` - User accounts with password hashing
- `Team` - Multi-tenant organization structure
- `Company` - Tracked companies with domain-based deduplication
- `Analysis` - Analysis jobs with progress tracking and JSON results
- `ActivityLog` - Real-time activity feed entries
- `Monitor` - Scheduled monitoring jobs (future feature)

**Key Relationships:**
- Users belong to Teams (many-to-one)
- Companies belong to Teams (many-to-one)
- Analyses belong to Companies (many-to-one)
- Unique constraint on company domain per team

**JSON Storage:**
Analysis results are stored as JSON fields in the Analysis table:
- `companyProfile` - Structured company overview
- `competitiveAnalysis` - Competitor landscape data
- `opportunities` - Top 3 identified opportunities
- `aiReadinessScore` - 0-100 readiness assessment
- `cheatSheet` - Sales talk tracks and objection handlers

### Authentication & Authorization

**Authentication Flow:**
- JWT-based authentication with 7-day expiration
- Passwords hashed with bcrypt (10 rounds)
- Tokens stored in httpOnly cookies
- Auth context provider on frontend for session management

**Authorization:**
- Role-based access control (admin/user roles defined)
- Team-based data isolation (users only see their team's data)
- Protected routes on frontend redirect to login
- Auth middleware on backend validates tokens

**Session Management:**
- `/api/auth/me` endpoint for session validation
- Frontend checks auth on mount and shows loading state
- Automatic logout on token expiration

## External Dependencies

### Third-Party APIs

**Parallel API (Data Gathering):**
- Provider: parallel.ai
- Purpose: Real-time web scraping and research
- Endpoints used:
  - `extract()` - Website content extraction
  - `deepResearch()` - Multi-source company research
  - `findAll()` - Competitor discovery
  - `enrich()` - Company data enrichment
  - `deepDive()` - Detailed competitor analysis
- Configuration: `PARALLEL_API_KEY`, `PARALLEL_BASE_URL`
- Webhook: Receives progress updates at `/api/webhooks/parallel`
- Rate limiting: 600 requests/minute with token bucket algorithm
- Cost tracking: Estimates per request type for usage monitoring

**Anthropic Claude (AI Synthesis):**
- Provider: Anthropic
- Model: `claude-sonnet-4-20250514`
- Purpose: AI-powered analysis synthesis
- Functions:
  - `synthesizeCompanyProfile()` - Create structured company profiles
  - `analyzeCompetitiveLandscape()` - Analyze competitor positioning
  - `identifyOpportunities()` - Find top 3 sales opportunities
  - `scoreAIReadiness()` - Calculate 0-100 AI readiness score
  - `generateCheatSheet()` - Create sales talk tracks
- Configuration: `ANTHROPIC_API_KEY`
- Temperature: 0.3 for consistent outputs
- Max tokens: 8192 for detailed responses
- JSON response parsing with markdown code block extraction

### Database

**PostgreSQL:**
- ORM: Prisma Client v5.22.0
- Connection: via `DATABASE_URL` environment variable
- Schema management: Prisma migrations
- Seeding: Demo user and team data via `prisma/seed.js`

### Production Deployment

**Replit-Specific:**
- Health check endpoints required for uptime monitoring
- Concurrent dev mode: Vite dev server + Express server
- Production mode: Express serves built Vite app from `/dist`
- Environment detection via `NODE_ENV`

**CORS Configuration:**
- Development: Allows `http://localhost:5173` (Vite dev server)
- Production: No CORS needed (same origin)

**Critical Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - JWT signing secret
- `PARALLEL_API_KEY` - Parallel API authentication
- `ANTHROPIC_API_KEY` - Anthropic API authentication
- `PARALLEL_WEBHOOK_SECRET` - Webhook verification (optional)
- `USE_MOCK_ANALYSIS` - Force mock mode for testing
- `NODE_ENV` - Environment detection

### UI Component Libraries

**Radix UI:**
- Accessible headless components
- Used primitives: Dialog, Dropdown Menu, Popover, Tabs, Progress, Switch, Tooltip, Accordion, Avatar, Label, Scroll Area, Select, Separator
- Custom styling with Tailwind classes

**Additional UI:**
- `lucide-react` - Icon library
- `sonner` - Toast notifications
- `pdfmake` - PDF report generation
- `class-variance-authority` - Component variant system
- `tailwind-merge` + `clsx` - Class name utilities

### Development Tools

- `concurrently` - Run Vite and Express servers simultaneously
- `typescript-eslint` - TypeScript linting
- `autoprefixer` - CSS vendor prefixing
- `@tailwindcss/postcss` - Tailwind processing