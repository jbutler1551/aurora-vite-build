import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Plus,
  Clock,
  AlertCircle,
  Pause,
  MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Monitor {
  id: string;
  name: string;
  query: string;
  type: string;
  cadence: string;
  status: string;
  company?: { name: string };
  _count?: { alerts: number };
}

const monitorTypeLabels: Record<string, string> = {
  NEWS: 'Company News',
  COMPETITOR: 'Competitor Activity',
  INDUSTRY: 'Industry Trends',
  TECHNOLOGY: 'Technology Updates',
  HIRING: 'Hiring Signals',
};

const cadenceLabels: Record<string, string> = {
  HOURLY: 'Every hour',
  DAILY: 'Once a day',
  WEEKLY: 'Once a week',
};

export default function MonitorsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMonitor, setNewMonitor] = useState({
    name: '',
    query: '',
    type: 'NEWS' as 'NEWS' | 'COMPETITOR' | 'INDUSTRY' | 'TECHNOLOGY' | 'HIRING',
    cadence: 'DAILY' as 'HOURLY' | 'DAILY' | 'WEEKLY',
  });
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchMonitors();
  }, []);

  async function fetchMonitors() {
    try {
      const res = await fetch(`${API_URL}/api/monitors?limit=50`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setMonitors(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch monitors:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateMonitor = async () => {
    if (!newMonitor.name || !newMonitor.query) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/monitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMonitor),
      });
      if (res.ok) {
        toast.success('Monitor created!');
        setIsCreateOpen(false);
        setNewMonitor({ name: '', query: '', type: 'NEWS', cadence: 'DAILY' });
        fetchMonitors();
      } else {
        toast.error('Failed to create monitor');
      }
    } catch {
      toast.error('Failed to create monitor');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/monitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Monitor updated!');
        fetchMonitors();
      }
    } catch {
      toast.error('Failed to update monitor');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/monitors/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Monitor deleted!');
        fetchMonitors();
      }
    } catch {
      toast.error('Failed to delete monitor');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Glassmorphism */}
      <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-2xl border shadow-2xl transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border-white/10'
          : 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 border-white/40'
      }`}>
        {/* Decorative gradient orbs */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${
          isDark ? 'from-cyan-500/20' : 'from-[#d4c4a8]/40'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-to-tr to-transparent rounded-full blur-2xl translate-y-1/2 transition-colors duration-500 ${
          isDark ? 'from-cyan-500/20' : 'from-[#c9b896]/30'
        }`} />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-2 w-2 rounded-full animate-pulse ${
                isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
              }`} />
              <span className={`text-sm font-medium tracking-widest uppercase transition-colors duration-500 ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>Monitors</span>
            </div>
            <h1 className={`text-3xl font-light tracking-wide transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>Track Updates</h1>
            <p className={`mt-1 font-light transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
            }`}>
              Track companies and get notified about important updates.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className={`gap-2 rounded-2xl px-6 py-5 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] ${
                isDark
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                  : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20 hover:shadow-[#5C4A2A]/30'
              }`}>
                <Plus className="h-4 w-4" />
                <span className="tracking-wide">New Monitor</span>
              </Button>
            </DialogTrigger>
            <DialogContent className={`backdrop-blur-2xl rounded-3xl shadow-2xl transition-colors duration-500 ${
              isDark ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-white/40'
            }`}>
              <DialogHeader>
                <DialogTitle className={`font-medium tracking-wide text-xl transition-colors duration-500 ${
                  isDark ? 'text-white' : 'text-[#3D3124]'
                }`}>Create Monitor</DialogTitle>
                <DialogDescription className={`font-light transition-colors duration-500 ${
                  isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                }`}>
                  Set up automated tracking for companies, competitors, or industry trends.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={`font-medium transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>Monitor Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Competitor News Tracker"
                    value={newMonitor.name}
                    onChange={(e) => setNewMonitor({ ...newMonitor, name: e.target.value })}
                    className={`backdrop-blur-sm rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-500/40 focus:ring-cyan-500/20'
                        : 'bg-white/70 border-[#5C4A2A]/15 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:border-[#8B7355]/40 focus:ring-[#8B7355]/20'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className={`font-medium transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>Monitor Type</Label>
                  <Select
                    value={newMonitor.type}
                    onValueChange={(value) =>
                      setNewMonitor({
                        ...newMonitor,
                        type: value as typeof newMonitor.type,
                      })
                    }
                  >
                    <SelectTrigger className={`backdrop-blur-sm rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white/70 border-[#5C4A2A]/15 text-[#3D3124]'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`backdrop-blur-xl rounded-xl transition-colors duration-500 ${
                      isDark ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-[#5C4A2A]/10'
                    }`}>
                      {Object.entries(monitorTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className={`rounded-lg transition-colors duration-500 ${
                          isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                        }`}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="query" className={`font-medium transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>Search Query</Label>
                  <Textarea
                    id="query"
                    placeholder="Enter keywords or company names to track..."
                    value={newMonitor.query}
                    onChange={(e) => setNewMonitor({ ...newMonitor, query: e.target.value })}
                    rows={3}
                    className={`backdrop-blur-sm rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-500/40 focus:ring-cyan-500/20'
                        : 'bg-white/70 border-[#5C4A2A]/15 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:border-[#8B7355]/40 focus:ring-[#8B7355]/20'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cadence" className={`font-medium transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-[#3D3124]'
                  }`}>Check Frequency</Label>
                  <Select
                    value={newMonitor.cadence}
                    onValueChange={(value) =>
                      setNewMonitor({
                        ...newMonitor,
                        cadence: value as typeof newMonitor.cadence,
                      })
                    }
                  >
                    <SelectTrigger className={`backdrop-blur-sm rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white/70 border-[#5C4A2A]/15 text-[#3D3124]'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`backdrop-blur-xl rounded-xl transition-colors duration-500 ${
                      isDark ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-[#5C4A2A]/10'
                    }`}>
                      {Object.entries(cadenceLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className={`rounded-lg transition-colors duration-500 ${
                          isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                        }`}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className={`rounded-xl transition-colors duration-500 ${
                  isDark
                    ? 'border-white/10 text-white hover:bg-white/5'
                    : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                }`}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMonitor} disabled={isCreating} className={`rounded-xl shadow-lg transition-colors duration-500 ${
                  isDark
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                    : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20'
                }`}>
                  {isCreating ? 'Creating...' : 'Create Monitor'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Monitors List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl border shadow-lg p-5 transition-colors duration-500 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
            }`}>
              <div className="flex items-center gap-4">
                <Skeleton className={`h-12 w-12 rounded-2xl transition-colors duration-500 ${
                  isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                }`} />
                <div className="flex-1 space-y-2">
                  <Skeleton className={`h-4 w-48 rounded-lg transition-colors duration-500 ${
                    isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                  }`} />
                  <Skeleton className={`h-3 w-32 rounded-lg transition-colors duration-500 ${
                    isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                  }`} />
                </div>
                <Skeleton className={`h-6 w-20 rounded-lg transition-colors duration-500 ${
                  isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                }`} />
              </div>
            </div>
          ))}
        </div>
      ) : monitors.length === 0 ? (
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl transition-colors duration-500 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br to-transparent rounded-full blur-2xl transition-colors duration-500 ${
            isDark ? 'from-cyan-500/20' : 'from-[#d4c4a8]/30'
          }`} />
          <div className="relative flex flex-col items-center justify-center py-16">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br border transition-colors duration-500 ${
              isDark
                ? 'from-cyan-500/20 to-purple-500/10 border-cyan-500/20'
                : 'from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
            }`}>
              <Bell className={`h-7 w-7 transition-colors duration-500 ${
                isDark ? 'text-cyan-400/50' : 'text-[#5C4A2A]/50'
              }`} />
            </div>
            <h3 className={`mt-5 font-medium tracking-wide text-lg transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>No monitors yet</h3>
            <p className={`mt-2 font-light transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
            }`}>
              Create a monitor to track companies and get alerts.
            </p>
            <Button className={`mt-6 gap-2 rounded-2xl px-6 shadow-lg transition-colors duration-500 ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20'
            }`} onClick={() => setIsCreateOpen(true)}>
              Create Monitor
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {monitors.map((monitor) => (
            <div key={monitor.id} className={`group relative overflow-hidden rounded-2xl backdrop-blur-2xl border shadow-lg hover:shadow-2xl transition-all duration-500 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white/60 border-white/40 hover:bg-white/70'
            }`}>
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'from-cyan-500/10 to-purple-500/5' : 'from-[#5C4A2A]/5 to-[#8B7355]/5'
              }`} />

              <div className="relative p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105 ${
                        monitor.status === 'ACTIVE'
                          ? isDark
                            ? 'bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/20'
                            : 'bg-gradient-to-br from-[#5C4A2A]/15 to-[#8B7355]/10 border border-[#5C4A2A]/10'
                          : monitor.status === 'PAUSED'
                          ? isDark
                            ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/10'
                            : 'bg-gradient-to-br from-[#8B7355]/10 to-[#c9b896]/10 border border-[#8B7355]/10'
                          : isDark
                          ? 'bg-white/5 border border-white/5'
                          : 'bg-[#5C4A2A]/5 border border-[#5C4A2A]/5'
                      }`}
                    >
                      {monitor.status === 'ACTIVE' ? (
                        <Bell className={`h-5 w-5 transition-colors duration-500 ${
                          isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                        }`} />
                      ) : monitor.status === 'PAUSED' ? (
                        <Pause className={`h-5 w-5 transition-colors duration-500 ${
                          isDark ? 'text-purple-400' : 'text-[#8B7355]'
                        }`} />
                      ) : (
                        <AlertCircle className={`h-5 w-5 transition-colors duration-500 ${
                          isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium tracking-wide transition-colors duration-500 ${
                        isDark
                          ? 'text-white group-hover:text-cyan-400'
                          : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                      }`}>{monitor.name}</h3>
                      <div className={`flex items-center gap-2 text-sm transition-colors duration-500 ${
                        isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                      }`}>
                        <Badge variant="outline" className={`text-xs rounded-lg transition-colors duration-500 ${
                          isDark
                            ? 'border-white/10 text-cyan-400 bg-white/5'
                            : 'border-[#5C4A2A]/20 text-[#5C4A2A] bg-white/50'
                        }`}>
                          {monitorTypeLabels[monitor.type] || monitor.type}
                        </Badge>
                        <span className="flex items-center gap-1 font-light">
                          <Clock className="h-3 w-3" />
                          {cadenceLabels[monitor.cadence] || monitor.cadence}
                        </span>
                        {monitor.company && (
                          <span className="font-light">• {monitor.company.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`rounded-lg font-medium border-0 transition-colors duration-500 ${
                        monitor.status === 'ACTIVE'
                          ? isDark
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-[#5C4A2A]/10 text-[#5C4A2A]'
                          : isDark
                          ? 'bg-white/5 text-white/60'
                          : 'bg-[#5C4A2A]/5 text-[#5C4A2A]/60'
                      }`}
                    >
                      {monitor._count?.alerts || 0} alerts
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className={`rounded-xl transition-colors duration-500 ${
                          isDark
                            ? 'text-white hover:bg-white/10'
                            : 'text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                        }`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className={`backdrop-blur-xl rounded-xl transition-colors duration-500 ${
                        isDark ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-[#5C4A2A]/10'
                      }`}>
                        <DropdownMenuItem asChild className={`rounded-lg transition-colors duration-500 ${
                          isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                        }`}>
                          <Link to={`/dashboard/monitors/${monitor.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {monitor.status === 'ACTIVE' ? (
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(monitor.id, 'PAUSED')}
                            className={`rounded-lg transition-colors duration-500 ${
                              isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                            }`}
                          >
                            Pause Monitor
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(monitor.id, 'ACTIVE')}
                            className={`rounded-lg transition-colors duration-500 ${
                              isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                            }`}
                          >
                            Resume Monitor
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className={`transition-colors duration-500 ${
                          isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                        }`} />
                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 rounded-lg"
                          onClick={() => handleDelete(monitor.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
