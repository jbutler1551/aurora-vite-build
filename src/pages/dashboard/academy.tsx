import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Sparkles,
  Zap,
  Brain,
  FileText,
  MessageSquare,
  Layers,
  Trophy,
  Target,
  Briefcase,
  Search,
  Bot,
  Shield,
  DollarSign,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useTheme } from '@/lib/theme-context';

// Solution Tracks - Problem-first learning
const solutionTracks = [
  {
    id: 'document-intelligence',
    name: 'Document Intelligence',
    tagline: 'Turn unstructured documents into actionable data',
    description: 'Master Intelligent Document Processing (IDP) solutions. Learn to identify document automation opportunities and prescribe the right AI tools.',
    icon: FileText,
    color: '#5C4A2A',
    modules: 6,
    duration: '3 hours',
    problems: ['Manual data entry from PDFs', 'Invoice processing bottlenecks', 'Contract review delays', 'Form digitization needs'],
    tools: ['OpenAI Vision', 'AWS Textract', 'Azure Document Intelligence', 'Google Document AI'],
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'conversational-ai',
    name: 'Conversational AI',
    tagline: 'Build intelligent customer interactions',
    description: 'Design and sell AI chatbots, virtual agents, and conversational interfaces. Know when to use which platform and how to scope projects.',
    icon: MessageSquare,
    color: '#8B7355',
    modules: 8,
    duration: '4 hours',
    problems: ['24/7 customer support needs', 'Call center cost reduction', 'Lead qualification automation', 'Internal helpdesk scaling'],
    tools: ['Claude', 'GPT-4', 'Dialogflow', 'Amazon Lex', 'Azure Bot Service'],
    progress: 35,
    status: 'in_progress',
  },
  {
    id: 'knowledge-search',
    name: 'Knowledge & Search',
    tagline: 'Unlock organizational knowledge',
    description: 'Implement RAG systems, enterprise search, and knowledge assistants. Help clients capture and leverage their institutional knowledge.',
    icon: Search,
    color: '#3D3124',
    modules: 7,
    duration: '3.5 hours',
    problems: ['Tribal knowledge loss', 'Slow information retrieval', 'Documentation scattered across systems', 'Onboarding inefficiency'],
    tools: ['Vector Databases', 'Embeddings APIs', 'LangChain', 'Pinecone', 'Weaviate'],
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'process-automation',
    name: 'Process Automation',
    tagline: 'Eliminate repetitive work',
    description: 'Combine RPA with AI for intelligent automation. Learn to identify automation opportunities and build business cases.',
    icon: Zap,
    color: '#8B7355',
    modules: 6,
    duration: '3 hours',
    problems: ['Manual data entry across systems', 'Email processing overload', 'Report generation delays', 'Legacy system integration'],
    tools: ['UiPath', 'Automation Anywhere', 'Power Automate', 'Zapier + AI'],
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'ai-agents',
    name: 'AI Agents & Assistants',
    tagline: 'Deploy autonomous AI workers',
    description: 'Build and sell AI agents that can reason, plan, and execute complex tasks. The cutting edge of enterprise AI.',
    icon: Bot,
    color: '#5C4A2A',
    modules: 8,
    duration: '4 hours',
    problems: ['Complex multi-step workflows', 'Decision support needs', 'Research automation', 'Task orchestration'],
    tools: ['Claude Agent SDK', 'OpenAI Assistants', 'AutoGPT patterns', 'LangGraph'],
    progress: 0,
    status: 'locked',
  },
  {
    id: 'ai-analytics',
    name: 'AI-Powered Analytics',
    tagline: 'Transform data into decisions',
    description: 'Sell predictive analytics, anomaly detection, and BI augmentation. Help clients make data-driven decisions faster.',
    icon: BarChart3,
    color: '#3D3124',
    modules: 5,
    duration: '2.5 hours',
    problems: ['Manual reporting processes', 'Reactive vs. predictive insights', 'Data silos', 'Forecasting accuracy'],
    tools: ['Amazon SageMaker', 'Azure ML', 'Vertex AI', 'DataRobot'],
    progress: 0,
    status: 'locked',
  },
];

// Platform Knowledge (supporting reference)
const platformCourses = [
  {
    id: 'anthropic-claude',
    name: 'Anthropic & Claude',
    description: 'Claude models, API patterns, pricing, and best use cases.',
    color: '#D97757',
    modules: 5,
    duration: '2 hours',
    progress: 65,
    status: 'in_progress',
  },
  {
    id: 'openai-gpt',
    name: 'OpenAI & GPT',
    description: 'GPT-4, Assistants API, Vision, pricing models, and positioning.',
    color: '#10A37F',
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'google-gemini',
    name: 'Google AI & Gemini',
    description: 'Gemini, Vertex AI, Document AI, and Google Cloud AI services.',
    color: '#4285F4',
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'aws-ai',
    name: 'AWS AI Services',
    description: 'Bedrock, SageMaker, Textract, and the AWS AI ecosystem.',
    color: '#FF9900',
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'microsoft-azure-ai',
    name: 'Microsoft & Azure AI',
    description: 'Azure OpenAI, Copilot, Document Intelligence, and enterprise AI.',
    color: '#00A4EF',
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
];

// Sales Skills
const salesSkills = [
  {
    id: 'ai-discovery-mastery',
    name: 'AI Discovery Mastery',
    description: 'Ask the right questions to uncover AI opportunities in any conversation.',
    icon: Lightbulb,
    modules: 4,
    duration: '1.5 hours',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'roi-business-cases',
    name: 'ROI & Business Cases',
    description: 'Build compelling ROI models and business cases for AI investments.',
    icon: DollarSign,
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'ai-objection-handling',
    name: 'AI Objection Handling',
    description: 'Overcome common objections: security, cost, complexity, and change management.',
    icon: Shield,
    modules: 4,
    duration: '1.5 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'technical-credibility',
    name: 'Technical Credibility',
    description: 'Speak confidently about infrastructure, security, and implementation without being an engineer.',
    icon: Brain,
    modules: 5,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'tech-acronyms-mastery',
    name: 'Tech Acronyms Mastery',
    description: 'Never blank on an acronym again. Master 80+ essential tech and AI acronyms using memory palace techniques.',
    icon: Brain,
    modules: 7,
    duration: '2 hours',
    progress: 0,
    status: 'not_started',
  },
];

// Certifications earned
const certifications = [
  {
    id: 'cert-discovery',
    name: 'AI Discovery Specialist',
    description: 'Certified to identify and qualify AI opportunities in sales conversations.',
    earnedDate: '2024-01-15',
    badge: '🎯',
  },
];

// User stats
const userStats = {
  tracksCompleted: 0,
  tracksInProgress: 1,
  certificationsEarned: 1,
  totalHoursLearned: 8,
  currentStreak: 5,
};

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState('solutions');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className={isDark ? "bg-emerald-500/20 text-emerald-400 border-0 rounded-lg" : "bg-green-100 text-green-700 border-0 rounded-lg"}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className={isDark ? "bg-cyan-500/20 text-cyan-400 border-0 rounded-lg" : "bg-[#5C4A2A]/10 text-[#5C4A2A] border-0 rounded-lg"}>
            <Play className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'locked':
        return (
          <Badge className={isDark ? "bg-white/10 text-white/50 border-0 rounded-lg" : "bg-gray-100 text-gray-500 border-0 rounded-lg"}>
            <Lock className="h-3 w-3 mr-1" />
            Complete Prerequisites
          </Badge>
        );
      default:
        return (
          <Badge className={isDark ? "bg-purple-500/20 text-purple-400 border-0 rounded-lg" : "bg-[#8B7355]/10 text-[#8B7355] border-0 rounded-lg"}>
            Start Learning
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-2xl shadow-2xl border ${
        isDark
          ? 'bg-gradient-to-br from-white/5 via-white/3 to-white/2 border-white/10'
          : 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 border-white/40'
      }`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${
          isDark
            ? 'bg-gradient-to-br from-cyan-500/30 to-transparent'
            : 'bg-gradient-to-br from-[#d4c4a8]/40 to-transparent'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-48 h-48 rounded-full blur-2xl translate-y-1/2 ${
          isDark
            ? 'bg-gradient-to-tr from-purple-500/30 to-transparent'
            : 'bg-gradient-to-tr from-[#c9b896]/30 to-transparent'
        }`} />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-2 w-2 rounded-full animate-pulse ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                  : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
              }`} />
              <span className={`text-sm font-medium tracking-widest uppercase ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>AI Sales Academy</span>
            </div>
            <h1 className={`text-3xl font-light tracking-wide ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>Become the AI Expert Your Prospects Need</h1>
            <p className={`mt-1 font-light max-w-xl ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
            }`}>
              Master AI solutions, diagnose problems on the fly, and close deals with confidence.
              Earn certifications that prove your expertise.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-sm ${
              isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-white/50 border border-white/50'
            }`}>
              <Trophy className={`h-5 w-5 ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`} />
              <div className="text-right">
                <p className={`text-xs font-light ${
                  isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                }`}>Certifications</p>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-[#3D3124]'
                }`}>{userStats.certificationsEarned}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-sm ${
              isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-white/50 border border-white/50'
            }`}>
              <Sparkles className={`h-5 w-5 ${
                isDark ? 'text-purple-400' : 'text-[#8B7355]'
              }`} />
              <div className="text-right">
                <p className={`text-xs font-light ${
                  isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                }`}>Day Streak</p>
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-[#3D3124]'
                }`}>{userStats.currentStreak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Tracks In Progress', value: userStats.tracksInProgress, icon: Play, color: isDark ? 'text-cyan-400' : 'text-[#8B7355]' },
          { label: 'Hours Learned', value: userStats.totalHoursLearned, icon: Clock, color: isDark ? 'text-purple-400' : 'text-[#5C4A2A]' },
          { label: 'Certifications', value: userStats.certificationsEarned, icon: Award, color: isDark ? 'text-cyan-400' : 'text-[#8B7355]' },
          { label: 'Day Streak', value: userStats.currentStreak, icon: Zap, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl shadow-lg p-5 ${
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/60 border border-white/40'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-white/10'
                  : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
              }`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-light ${
                  isDark ? 'text-white' : 'text-[#3D3124]'
                }`}>{stat.value}</p>
                <p className={`text-sm font-light ${
                  isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                }`}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl shadow-lg p-2 ${
          isDark
            ? 'bg-white/5 border border-white/10'
            : 'bg-white/60 border border-white/40'
        }`}>
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 h-auto p-0">
            {[
              { value: 'solutions', label: 'Solution Tracks', icon: Target },
              { value: 'platforms', label: 'Platform Knowledge', icon: Layers },
              { value: 'skills', label: 'Sales Skills', icon: Briefcase },
              { value: 'certifications', label: 'Certifications', icon: Award },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 h-auto transition-all border-0 ${
                  isDark
                    ? 'bg-transparent text-white/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/10 data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm'
                    : 'bg-transparent text-[#5C4A2A]/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5C4A2A]/15 data-[state=active]:to-[#8B7355]/10 data-[state=active]:text-[#5C4A2A] data-[state=active]:shadow-sm'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium tracking-wide">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Solution Tracks Tab */}
        <TabsContent value="solutions" className="space-y-6">
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <h2 className={`text-xl font-medium tracking-wide ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>Solution Tracks</h2>
              <p className={`text-sm font-light mt-1 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>
                Learn to identify business problems and prescribe the right AI solutions
              </p>
            </div>
            <div className="p-6 grid gap-5 md:grid-cols-2">
              {solutionTracks.map((track) => (
                <Link key={track.id} to={track.status !== 'locked' ? `/dashboard/academy/${track.id}/learn` : '#'}>
                  <div className={`group relative overflow-hidden rounded-2xl border transition-all p-6 h-full ${
                    isDark
                      ? `bg-white/5 border-white/10 ${track.status !== 'locked' ? 'hover:bg-white/10 hover:shadow-lg cursor-pointer' : 'opacity-60'}`
                      : `bg-white/50 border-white/50 ${track.status !== 'locked' ? 'hover:bg-white/70 hover:shadow-lg cursor-pointer' : 'opacity-60'}`
                  }`}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isDark
                        ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10'
                        : 'bg-gradient-to-br from-[#5C4A2A]/5 to-[#8B7355]/5'
                    }`} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                            isDark
                              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-white/10'
                              : ''
                          }`}
                          style={!isDark ? {
                            backgroundColor: `${track.color}10`,
                            borderColor: `${track.color}20`
                          } : undefined}
                        >
                          <track.icon className={`h-7 w-7 ${isDark ? 'text-cyan-400' : ''}`} style={!isDark ? { color: track.color } : undefined} />
                        </div>
                        {getStatusBadge(track.status)}
                      </div>
                      <h3 className={`text-lg font-medium mb-1 transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-cyan-400'
                          : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                      }`}>{track.name}</h3>
                      <p className={`text-xs font-medium mb-2 ${
                        isDark ? 'text-cyan-400' : 'text-[#8B7355]'
                      }`}>{track.tagline}</p>
                      <p className={`text-sm font-light mb-4 ${
                        isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                      }`}>{track.description}</p>

                      {/* Problems you'll solve */}
                      <div className="mb-4">
                        <p className={`text-xs font-medium mb-2 ${
                          isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'
                        }`}>Problems you'll solve:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {track.problems.slice(0, 3).map((problem) => (
                            <span key={problem} className={`text-xs px-2 py-1 rounded-lg ${
                              isDark
                                ? 'bg-white/10 text-white/70'
                                : 'bg-[#5C4A2A]/5 text-[#5C4A2A]/70'
                            }`}>
                              {problem}
                            </span>
                          ))}
                        </div>
                      </div>

                      {track.status === 'in_progress' && (
                        <div className="mb-4">
                          <div className={`flex items-center justify-between text-xs mb-1 ${
                            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                          }`}>
                            <span>Progress</span>
                            <span>{track.progress}%</span>
                          </div>
                          <Progress value={track.progress} className={`h-2 ${
                            isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                          }`} />
                        </div>
                      )}

                      <div className={`flex items-center gap-4 text-xs ${
                        isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                      }`}>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {track.modules} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Platform Knowledge Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <h2 className={`text-xl font-medium tracking-wide ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>Platform Knowledge</h2>
              <p className={`text-sm font-light mt-1 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>
                Deep-dive into each AI ecosystem. Know the strengths, pricing, and positioning for each platform.
              </p>
            </div>
            <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platformCourses.map((course) => (
                <Link key={course.id} to={`/dashboard/academy/${course.id}/learn`}>
                  <div className={`group relative overflow-hidden rounded-2xl border transition-all p-5 cursor-pointer h-full ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg'
                      : 'bg-white/50 border-white/50 hover:bg-white/70 hover:shadow-lg'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border shrink-0 group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: `${course.color}10`,
                          borderColor: `${course.color}20`
                        }}
                      >
                        <GraduationCap className="h-6 w-6" style={{ color: course.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium transition-colors ${
                            isDark
                              ? 'text-white group-hover:text-cyan-400'
                              : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                          }`}>{course.name}</h3>
                        </div>
                        <p className={`text-sm font-light mb-3 ${
                          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                        }`}>{course.description}</p>

                        {course.status === 'in_progress' && (
                          <div className="mb-3">
                            <div className={`flex items-center justify-between text-xs mb-1 ${
                              isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                            }`}>
                              <span>{course.progress}% complete</span>
                            </div>
                            <Progress value={course.progress} className={`h-1.5 ${
                              isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                            }`} />
                          </div>
                        )}

                        <div className={`flex items-center gap-3 text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                        }`}>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {course.modules} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Comparison Quick Reference */}
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <h2 className={`text-xl font-medium tracking-wide ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>Quick Comparison Guide</h2>
              <p className={`text-sm font-light mt-1 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>
                Know when to recommend each platform
              </p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${
                      isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
                    }`}>
                      <th className={`text-left py-3 px-4 font-medium ${
                        isDark ? 'text-white' : 'text-[#3D3124]'
                      }`}>Platform</th>
                      <th className={`text-left py-3 px-4 font-medium ${
                        isDark ? 'text-white' : 'text-[#3D3124]'
                      }`}>Best For</th>
                      <th className={`text-left py-3 px-4 font-medium ${
                        isDark ? 'text-white' : 'text-[#3D3124]'
                      }`}>Pricing Model</th>
                      <th className={`text-left py-3 px-4 font-medium ${
                        isDark ? 'text-white' : 'text-[#3D3124]'
                      }`}>Key Differentiator</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'}>
                    <tr className={`border-b ${
                      isDark ? 'border-white/5' : 'border-[#5C4A2A]/5'
                    }`}>
                      <td className="py-3 px-4 font-medium" style={{ color: '#D97757' }}>Claude</td>
                      <td className="py-3 px-4">Long-form content, analysis, coding</td>
                      <td className="py-3 px-4">Per token</td>
                      <td className="py-3 px-4">200K context, safety, reasoning</td>
                    </tr>
                    <tr className={`border-b ${
                      isDark ? 'border-white/5' : 'border-[#5C4A2A]/5'
                    }`}>
                      <td className="py-3 px-4 font-medium" style={{ color: '#10A37F' }}>GPT-4</td>
                      <td className="py-3 px-4">General purpose, vision, assistants</td>
                      <td className="py-3 px-4">Per token</td>
                      <td className="py-3 px-4">Ecosystem, plugins, market leader</td>
                    </tr>
                    <tr className={`border-b ${
                      isDark ? 'border-white/5' : 'border-[#5C4A2A]/5'
                    }`}>
                      <td className="py-3 px-4 font-medium" style={{ color: '#4285F4' }}>Gemini</td>
                      <td className="py-3 px-4">Multimodal, Google integration</td>
                      <td className="py-3 px-4">Per token</td>
                      <td className="py-3 px-4">Google ecosystem, 1M context</td>
                    </tr>
                    <tr className={`border-b ${
                      isDark ? 'border-white/5' : 'border-[#5C4A2A]/5'
                    }`}>
                      <td className="py-3 px-4 font-medium" style={{ color: '#FF9900' }}>AWS Bedrock</td>
                      <td className="py-3 px-4">Enterprise, multi-model, AWS shops</td>
                      <td className="py-3 px-4">Per token</td>
                      <td className="py-3 px-4">Model choice, enterprise security</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium" style={{ color: '#00A4EF' }}>Azure OpenAI</td>
                      <td className="py-3 px-4">Microsoft shops, compliance-heavy</td>
                      <td className="py-3 px-4">Per token</td>
                      <td className="py-3 px-4">Enterprise compliance, M365 integration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Sales Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <h2 className={`text-xl font-medium tracking-wide ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>Sales Skills</h2>
              <p className={`text-sm font-light mt-1 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>
                Core consulting and sales skills for AI solution selling
              </p>
            </div>
            <div className="p-6 space-y-4">
              {salesSkills.map((skill) => (
                <Link key={skill.id} to={`/dashboard/academy/${skill.id}/learn`}>
                  <div className={`group relative overflow-hidden rounded-2xl border transition-all p-5 cursor-pointer ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg'
                      : 'bg-white/50 border-white/50 hover:bg-white/70 hover:shadow-lg'
                  }`}>
                    <div className="flex items-center gap-5">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border shrink-0 group-hover:scale-105 transition-transform ${
                        isDark
                          ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-white/10'
                          : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                      }`}>
                        <skill.icon className={`h-7 w-7 ${
                          isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-medium transition-colors ${
                            isDark
                              ? 'text-white group-hover:text-cyan-400'
                              : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                          }`}>{skill.name}</h3>
                          {getStatusBadge(skill.status)}
                        </div>
                        <p className={`text-sm font-light mb-2 ${
                          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                        }`}>{skill.description}</p>
                        <div className={`flex items-center gap-4 text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                        }`}>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {skill.modules} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {skill.duration}
                          </span>
                        </div>
                      </div>
                      {skill.status === 'in_progress' && (
                        <div className="w-24 shrink-0">
                          <div className={`flex items-center justify-between text-xs mb-1 ${
                            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                          }`}>
                            <span>{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className={`h-2 ${
                            isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                          }`} />
                        </div>
                      )}
                      {skill.status === 'completed' && (
                        <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                      )}
                      <ChevronRight className={`h-5 w-5 shrink-0 group-hover:translate-x-1 transition-all ${
                        isDark
                          ? 'text-white/30 group-hover:text-cyan-400'
                          : 'text-[#5C4A2A]/30 group-hover:text-[#5C4A2A]'
                      }`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          {/* Earned Certifications */}
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <div className="flex items-center gap-3 mb-1">
                <Trophy className={`h-5 w-5 ${
                  isDark ? 'text-cyan-400' : 'text-[#8B7355]'
                }`} />
                <h2 className={`text-xl font-medium tracking-wide ${
                  isDark ? 'text-white' : 'text-[#3D3124]'
                }`}>Your Certifications</h2>
              </div>
              <p className={`text-sm font-light ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>Credentials that prove your AI consulting expertise</p>
            </div>
            <div className="p-6">
              {certifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border mx-auto ${
                    isDark
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-white/10'
                      : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                  }`}>
                    <Award className={`h-7 w-7 ${
                      isDark ? 'text-cyan-400/50' : 'text-[#5C4A2A]/50'
                    }`} />
                  </div>
                  <h3 className={`mt-5 font-medium tracking-wide text-lg ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>No certifications yet</h3>
                  <p className={`mt-2 font-light ${
                    isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                  }`}>
                    Complete solution tracks to earn your first certification!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className={`group relative overflow-hidden rounded-2xl border p-6 ${
                      isDark
                        ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-white/10'
                        : 'bg-gradient-to-br from-[#5C4A2A]/5 to-[#8B7355]/5 border-[#5C4A2A]/10'
                    }`}>
                      <div className="absolute top-4 right-4 text-4xl">{cert.badge}</div>
                      <div>
                        <Badge className={isDark ? "bg-emerald-500/20 text-emerald-400 border-0 rounded-lg mb-3" : "bg-green-100 text-green-700 border-0 rounded-lg mb-3"}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Earned
                        </Badge>
                        <h3 className={`text-lg font-medium mb-2 ${
                          isDark ? 'text-white' : 'text-[#3D3124]'
                        }`}>{cert.name}</h3>
                        <p className={`text-sm font-light mb-4 ${
                          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                        }`}>{cert.description}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                        }`}>
                          Earned on {new Date(cert.earnedDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className={`rounded-xl ${
                          isDark
                            ? 'border-white/20 text-cyan-400 hover:bg-white/10'
                            : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                        }`}>
                          View Certificate
                        </Button>
                        <Button variant="outline" size="sm" className={`rounded-xl ${
                          isDark
                            ? 'border-white/20 text-cyan-400 hover:bg-white/10'
                            : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                        }`}>
                          Share on LinkedIn
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Certifications */}
          <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40'
          }`}>
            <div className={`p-6 border-b ${
              isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
            }`}>
              <h2 className={`text-xl font-medium tracking-wide ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>Certification Paths</h2>
              <p className={`text-sm font-light mt-1 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
              }`}>Complete solution tracks to earn these credentials</p>
            </div>
            <div className="p-6 grid gap-4 md:grid-cols-3">
              {[
                { name: 'Document Intelligence Specialist', track: 'Document Intelligence', icon: FileText, progress: 0 },
                { name: 'Conversational AI Expert', track: 'Conversational AI', icon: MessageSquare, progress: 35 },
                { name: 'Knowledge Systems Architect', track: 'Knowledge & Search', icon: Search, progress: 0 },
                { name: 'Process Automation Pro', track: 'Process Automation', icon: Zap, progress: 0 },
                { name: 'AI Agent Developer', track: 'AI Agents & Assistants', icon: Bot, progress: 0 },
                { name: 'AI Analytics Consultant', track: 'AI-Powered Analytics', icon: BarChart3, progress: 0 },
              ].map((cert) => (
                <div key={cert.name} className={`group rounded-2xl border p-5 transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-lg'
                    : 'bg-white/50 border-white/50 hover:bg-white/70 hover:shadow-lg'
                }`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border mb-4 ${
                    isDark
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-white/10'
                      : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                  }`}>
                    <cert.icon className={`h-6 w-6 ${
                      isDark ? 'text-cyan-400/50' : 'text-[#5C4A2A]/50'
                    }`} />
                  </div>
                  <h4 className={`font-medium mb-1 ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>{cert.name}</h4>
                  <p className={`text-xs mb-3 ${
                    isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                  }`}>Complete: {cert.track}</p>
                  <div className="space-y-1">
                    <div className={`flex items-center justify-between text-xs ${
                      isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                    }`}>
                      <span>Progress</span>
                      <span>{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className={`h-1.5 ${
                      isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
