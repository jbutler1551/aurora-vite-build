import { GraduationCap, BookOpen, Video, Trophy, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

const courses = [
  {
    id: 'fundamentals',
    title: 'Competitive Intelligence Fundamentals',
    description: 'Learn the basics of competitive intelligence and how to use Aurora effectively.',
    modules: 5,
    duration: '2 hours',
    progress: 100,
    icon: BookOpen,
    unlocked: true,
  },
  {
    id: 'advanced-analysis',
    title: 'Advanced Analysis Techniques',
    description: 'Deep dive into competitor research, market analysis, and strategic planning.',
    modules: 8,
    duration: '4 hours',
    progress: 60,
    icon: Trophy,
    unlocked: true,
  },
  {
    id: 'sales-mastery',
    title: 'Sales Intelligence Mastery',
    description: 'Convert competitive insights into winning sales strategies.',
    modules: 6,
    duration: '3 hours',
    progress: 0,
    icon: Video,
    unlocked: false,
  },
];

export default function AcademyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aurora Academy</h1>
        <p className="text-muted-foreground mt-1">
          Master competitive intelligence with our comprehensive courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Available Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Trophy className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">9 hrs</p>
              <p className="text-sm text-muted-foreground">Total Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className={cn(
                'bg-card border border-border rounded-xl p-6 transition-all',
                course.unlocked
                  ? 'hover:border-primary cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    course.progress === 100
                      ? 'bg-green-500/10'
                      : course.unlocked
                      ? 'bg-primary/10'
                      : 'bg-muted'
                  )}
                >
                  {course.unlocked ? (
                    <course.icon
                      className={
                        course.progress === 100 ? 'text-green-600' : 'text-primary'
                      }
                      size={24}
                    />
                  ) : (
                    <Lock className="text-muted-foreground" size={24} />
                  )}
                </div>
                {course.progress === 100 && (
                  <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{course.modules} modules</span>
                <span>{course.duration}</span>
              </div>

              {course.unlocked && course.progress > 0 && course.progress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
