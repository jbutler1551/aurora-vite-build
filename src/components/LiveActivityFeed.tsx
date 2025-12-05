import { useEffect, useRef, useState } from 'react';

interface ActivityEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'milestone';
  phase?: string;
}

interface LiveActivityFeedProps {
  analysisId: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export default function LiveActivityFeed({ analysisId, isActive }: LiveActivityFeedProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  // Fetch and poll activity log
  useEffect(() => {
    if (!analysisId) return;

    const fetchActivityLog = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analysis/${analysisId}/activity`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.log && Array.isArray(data.log)) {
            setEntries(data.log);
          }
        }
      } catch (error) {
        console.error('Failed to fetch activity log:', error);
      }
    };

    // Initial fetch
    fetchActivityLog();

    // Poll every 3 seconds while active
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(fetchActivityLog, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [analysisId, isActive]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getTypeColor = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'milestone':
        return 'text-cyan-400 font-semibold';
      default:
        return 'text-gray-300';
    }
  };

  const getTypeIcon = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'milestone':
        return '◆';
      default:
        return '›';
    }
  };

  if (entries.length === 0 && !isActive) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm font-mono">Live Activity Feed</span>
          {isActive && (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <span className="text-gray-500 text-xs">{entries.length} events</span>
      </div>

      {/* Log entries */}
      <div
        ref={containerRef}
        className="h-64 overflow-y-auto font-mono text-sm p-3 space-y-1"
        style={{ backgroundColor: '#0d1117' }}
      >
        {entries.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Waiting for activity...
          </div>
        ) : (
          entries.map((entry, index) => (
            <div key={index} className="flex gap-2 hover:bg-gray-800/30 px-1 rounded">
              <span className="text-gray-500 shrink-0">[{formatTime(entry.timestamp)}]</span>
              <span className={`shrink-0 w-4 ${getTypeColor(entry.type)}`}>
                {getTypeIcon(entry.type)}
              </span>
              <span className={getTypeColor(entry.type)}>{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
