import { useState, useEffect } from 'react';
import { Cpu, Box, Search, Users, Bell, Database, Shield, Network, Terminal, FileCode, Heart, Play, Pause } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

// --- Types ---
interface NodeConfig {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  label: string;
  icon?: string;
}

interface ConnectionConfig {
  id: string;
  from: string;
  to: string;
  color: string;
}

// --- Aurora Core Diagram Data (scaled to fit card width) ---
const SCALE = 0.72;
const OFFSET_X = 160;
const OFFSET_Y = -30;

const scaleNode = (node: NodeConfig): NodeConfig => ({
  ...node,
  x: (node.x + OFFSET_X) * SCALE,
  y: (node.y + OFFSET_Y) * SCALE,
  w: node.w * SCALE,
  h: node.h * SCALE,
});

const BASE_NODES: NodeConfig[] = [
  { id: "node1764559203558", x: 367.53, y: 450.08, w: 141, h: 464, type: "blue", label: "AURORA CORE", icon: "cpu" },
  { id: "node1764559228473", x: 731.73, y: 249.31, w: 269, h: 377, type: "group", label: "REAL-TIME WEB AGENTS" },
  { id: "node1764559324441", x: 735.03, y: 116.70, w: 204, h: 61, type: "gateway", label: "EXTRACTOR", icon: "box" },
  { id: "node1764559345221", x: 732.42, y: 202.79, w: 200, h: 58, type: "gateway", label: "DEEP RESEARCH", icon: "search" },
  { id: "node1764559674543", x: 731.87, y: 292.32, w: 197, h: 60, type: "gateway", label: "COMPETITOR SCOUT", icon: "users" },
  { id: "node1764559704509", x: 730.47, y: 380.39, w: 199, h: 56, type: "gateway", label: "MONITOR", icon: "bell" },
  { id: "node1764559886876", x: 612.63, y: 622.67, w: 157, h: 59, type: "service-yellow", label: "SYNTHESIZER", icon: "database" },
  { id: "node1764560027343", x: 839.35, y: 521.16, w: 140, h: 60, type: "service-yellow", label: "SWOT AGENT", icon: "shield" },
  { id: "node1764560121525", x: 834.66, y: 728.63, w: 190, h: 50, type: "service-green", label: "REPORT ARCHITECT", icon: "network" },
  { id: "node1764560248869", x: 111.03, y: 449.51, w: 180, h: 56, type: "service-green", label: "USER INPUT URL", icon: "terminal" },
  { id: "node1764560311218", x: 1145.54, y: 458.56, w: 140, h: 336, type: "red", label: "FINAL REPORT", icon: "file-code" },
  { id: "node1764560887642", x: 1147.34, y: 724.67, w: 140, h: 60, type: "blue", label: "TALK TRACKS", icon: "heart" }
];

const AURORA_NODES = BASE_NODES.map(scaleNode);

interface ConnectionWithColors extends ConnectionConfig {
  auroraColorLight: string;
  auroraColorDark: string;
  vibrantColorLight: string;
  vibrantColorDark: string;
}

const AURORA_CONNECTIONS: ConnectionWithColors[] = [
  { id: "c1764559570456", from: "node1764559203558", to: "node1764559324441", color: "#d4c4a8", auroraColorLight: "#d4c4a8", auroraColorDark: "#22d3ee", vibrantColorLight: "#3b82f6", vibrantColorDark: "#888888" },
  { id: "c1764559582325", from: "node1764559203558", to: "node1764559345221", color: "#d4c4a8", auroraColorLight: "#d4c4a8", auroraColorDark: "#22d3ee", vibrantColorLight: "#3b82f6", vibrantColorDark: "#888888" },
  { id: "c1764559608823", from: "node1764559324441", to: "node1764559203558", color: "#c9b896", auroraColorLight: "#c9b896", auroraColorDark: "#a855f7", vibrantColorLight: "#a855f7", vibrantColorDark: "#666666" },
  { id: "c1764559640074", from: "node1764559345221", to: "node1764559203558", color: "#c9b896", auroraColorLight: "#c9b896", auroraColorDark: "#a855f7", vibrantColorLight: "#a855f7", vibrantColorDark: "#666666" },
  { id: "c1764559734906", from: "node1764559203558", to: "node1764559674543", color: "#d4c4a8", auroraColorLight: "#d4c4a8", auroraColorDark: "#22d3ee", vibrantColorLight: "#3b82f6", vibrantColorDark: "#888888" },
  { id: "c1764559740623", from: "node1764559203558", to: "node1764559704509", color: "#d4c4a8", auroraColorLight: "#d4c4a8", auroraColorDark: "#22d3ee", vibrantColorLight: "#3b82f6", vibrantColorDark: "#888888" },
  { id: "c1764559753923", from: "node1764559674543", to: "node1764559203558", color: "#c9b896", auroraColorLight: "#c9b896", auroraColorDark: "#a855f7", vibrantColorLight: "#a855f7", vibrantColorDark: "#666666" },
  { id: "c1764559759307", from: "node1764559704509", to: "node1764559203558", color: "#c9b896", auroraColorLight: "#c9b896", auroraColorDark: "#a855f7", vibrantColorLight: "#a855f7", vibrantColorDark: "#666666" },
  { id: "c1764559923426", from: "node1764559886876", to: "node1764559203558", color: "#8B7355", auroraColorLight: "#8B7355", auroraColorDark: "#c084fc", vibrantColorLight: "#eab308", vibrantColorDark: "#777777" },
  { id: "c1764559941107", from: "node1764559203558", to: "node1764559886876", color: "#F5EFE4", auroraColorLight: "#F5EFE4", auroraColorDark: "#e0f7fa", vibrantColorLight: "#ffffff", vibrantColorDark: "#cccccc" },
  { id: "c1764560041710", from: "node1764560027343", to: "node1764559886876", color: "#8B7355", auroraColorLight: "#8B7355", auroraColorDark: "#c084fc", vibrantColorLight: "#f97316", vibrantColorDark: "#777777" },
  { id: "c1764560059191", from: "node1764559886876", to: "node1764560027343", color: "#F5EFE4", auroraColorLight: "#F5EFE4", auroraColorDark: "#e0f7fa", vibrantColorLight: "#ffffff", vibrantColorDark: "#cccccc" },
  { id: "c1764560075358", from: "node1764559203558", to: "node1764560027343", color: "#F5EFE4", auroraColorLight: "#F5EFE4", auroraColorDark: "#e0f7fa", vibrantColorLight: "#ffffff", vibrantColorDark: "#cccccc" },
  { id: "c1764560143925", from: "node1764559203558", to: "node1764560121525", color: "#F5EFE4", auroraColorLight: "#F5EFE4", auroraColorDark: "#e0f7fa", vibrantColorLight: "#ffffff", vibrantColorDark: "#cccccc" },
  { id: "c1764560169692", from: "node1764560121525", to: "node1764560027343", color: "#5C4A2A", auroraColorLight: "#5C4A2A", auroraColorDark: "#22d3ee", vibrantColorLight: "#22c55e", vibrantColorDark: "#888888" },
  { id: "c1764560176942", from: "node1764560121525", to: "node1764559886876", color: "#5C4A2A", auroraColorLight: "#5C4A2A", auroraColorDark: "#22d3ee", vibrantColorLight: "#22c55e", vibrantColorDark: "#888888" },
  { id: "c1764560194522", from: "node1764559886876", to: "node1764560121525", color: "#8B7355", auroraColorLight: "#8B7355", auroraColorDark: "#c084fc", vibrantColorLight: "#eab308", vibrantColorDark: "#777777" },
  { id: "c1764560207344", from: "node1764560027343", to: "node1764560121525", color: "#8B7355", auroraColorLight: "#8B7355", auroraColorDark: "#c084fc", vibrantColorLight: "#eab308", vibrantColorDark: "#777777" },
  { id: "c1764560268350", from: "node1764560248869", to: "node1764559203558", color: "#5C4A2A", auroraColorLight: "#5C4A2A", auroraColorDark: "#22d3ee", vibrantColorLight: "#22c55e", vibrantColorDark: "#888888" },
  { id: "c1764560341203", from: "node1764559203558", to: "node1764560311218", color: "#d4c4a8", auroraColorLight: "#d4c4a8", auroraColorDark: "#22d3ee", vibrantColorLight: "#ec4899", vibrantColorDark: "#888888" },
  { id: "c1764560905507", from: "node1764560311218", to: "node1764560887642", color: "#c9b896", auroraColorLight: "#c9b896", auroraColorDark: "#a855f7", vibrantColorLight: "#22d3ee", vibrantColorDark: "#666666" }
];

// --- Icon mapping ---
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  cpu: Cpu,
  box: Box,
  search: Search,
  users: Users,
  bell: Bell,
  database: Database,
  shield: Shield,
  network: Network,
  terminal: Terminal,
  'file-code': FileCode,
  heart: Heart,
};

// --- Color interpolation helper ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

const lerpColor = (color1: string, color2: string, t: number) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
};

// Aurora brand colors - Light mode
const AURORA_COLORS_LIGHT = {
  blue: { bg: '#5C4A2A', border: '#d4c4a8', text: '#F5EFE4' },
  gateway: { bg: '#3D3124', border: '#8B7355', text: '#d4c4a8' },
  serviceGreen: { bg: '#5C4A2A', border: '#8B7355', text: '#d4c4a8' },
  serviceYellow: { bg: '#8B7355', border: '#d4c4a8', text: '#F5EFE4' },
  red: { bg: '#5C4A2A', border: '#d4c4a8', text: '#F5EFE4' },
  group: { bg: '#3D3124', border: '#8B7355', text: '#d4c4a8' },
};

// Aurora brand colors - Dark mode
const AURORA_COLORS_DARK = {
  blue: { bg: '#0c1929', border: '#22d3ee', text: '#e0f7fa' },
  gateway: { bg: '#0a1628', border: '#a855f7', text: '#e9d5ff' },
  serviceGreen: { bg: '#0c1929', border: '#22d3ee', text: '#cffafe' },
  serviceYellow: { bg: '#1a1033', border: '#c084fc', text: '#f3e8ff' },
  red: { bg: '#0c1929', border: '#22d3ee', text: '#e0f7fa' },
  group: { bg: '#0a1628', border: '#a855f7', text: '#e9d5ff' },
};

// Vibrant colors - Light mode
const VIBRANT_COLORS_LIGHT = {
  blue: { bg: '#1e293b', border: '#0ea5e9', text: '#e0f2fe' },
  gateway: { bg: '#0f172a', border: '#6366f1', text: '#c7d2fe' },
  serviceGreen: { bg: '#064e3b', border: '#10b981', text: '#d1fae5' },
  serviceYellow: { bg: '#78350f', border: '#f59e0b', text: '#fef3c7' },
  red: { bg: '#7f1d1d', border: '#ef4444', text: '#fee2e2' },
  group: { bg: '#0f172a', border: '#f97316', text: '#fed7aa' },
};

// Vibrant colors - Dark mode
const VIBRANT_COLORS_DARK = {
  blue: { bg: '#1a1a1a', border: '#666666', text: '#e5e5e5' },
  gateway: { bg: '#141414', border: '#555555', text: '#d4d4d4' },
  serviceGreen: { bg: '#1a1a1a', border: '#666666', text: '#e5e5e5' },
  serviceYellow: { bg: '#1f1f1f', border: '#777777', text: '#f5f5f5' },
  red: { bg: '#1a1a1a', border: '#666666', text: '#e5e5e5' },
  group: { bg: '#141414', border: '#555555', text: '#d4d4d4' },
};

// --- Helper Functions ---
const getNodeStyle = (type: string, colorBlend: number, isDark: boolean) => {
  const AURORA_COLORS = isDark ? AURORA_COLORS_DARK : AURORA_COLORS_LIGHT;
  const VIBRANT_COLORS = isDark ? VIBRANT_COLORS_DARK : VIBRANT_COLORS_LIGHT;

  const getBlendedStyle = (auroraKey: keyof typeof AURORA_COLORS_LIGHT) => {
    const aurora = AURORA_COLORS[auroraKey];
    const vibrant = VIBRANT_COLORS[auroraKey];
    const bg = lerpColor(aurora.bg, vibrant.bg, colorBlend);
    const border = lerpColor(aurora.border, vibrant.border, colorBlend);
    const text = lerpColor(aurora.text, vibrant.text, colorBlend);
    return { bg, border, text };
  };

  switch (type) {
    case 'blue': {
      const c = getBlendedStyle('blue');
      return { className: "rounded-lg", style: { backgroundColor: `${c.bg}cc`, borderColor: `${c.border}99`, color: c.text, borderWidth: '1px', borderStyle: 'solid' as const } };
    }
    case 'gateway': {
      const c = getBlendedStyle('gateway');
      return { className: "rounded-lg", style: { backgroundColor: `${c.bg}e6`, borderColor: c.border, color: c.text, borderWidth: '2px', borderStyle: 'solid' as const } };
    }
    case 'service-green': {
      const c = getBlendedStyle('serviceGreen');
      return { className: "rounded-md", style: { backgroundColor: `${c.bg}99`, borderColor: `${c.border}cc`, color: c.text, borderWidth: '1px', borderStyle: 'solid' as const } };
    }
    case 'service-yellow': {
      const c = getBlendedStyle('serviceYellow');
      return { className: "rounded-md", style: { backgroundColor: `${c.bg}80`, borderColor: `${c.border}b3`, color: c.text, borderWidth: '1px', borderStyle: 'solid' as const } };
    }
    case 'red': {
      const c = getBlendedStyle('red');
      return { className: "rounded-lg", style: { backgroundColor: c.bg, borderColor: c.border, color: c.text, borderWidth: '1px', borderStyle: 'solid' as const } };
    }
    case 'group': {
      const c = getBlendedStyle('group');
      return { className: "rounded-xl", style: { backgroundColor: `${c.bg}4d`, borderColor: `${c.border}66`, color: c.text, borderWidth: '1px', borderStyle: 'solid' as const } };
    }
    default:
      return { className: "", style: { backgroundColor: '#5C4A2A80', borderColor: '#8B7355' } };
  }
};

// Smart connection point calculation
const getSmartConnectionPoints = (fromNode: NodeConfig, toNode: NodeConfig) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  const fromRight = fromNode.x + fromNode.w / 2;
  const fromLeft = fromNode.x - fromNode.w / 2;
  const fromTop = fromNode.y - fromNode.h / 2;
  const fromBottom = fromNode.y + fromNode.h / 2;

  const toRight = toNode.x + toNode.w / 2;
  const toLeft = toNode.x - toNode.w / 2;
  const toTop = toNode.y - toNode.h / 2;
  const toBottom = toNode.y + toNode.h / 2;

  let startX: number, startY: number, endX: number, endY: number;
  let startDir: 'left' | 'right' | 'up' | 'down';
  let endDir: 'left' | 'right' | 'up' | 'down';

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (absX > absY * 0.5) {
    if (dx > 0) {
      startX = fromRight; startY = fromNode.y;
      endX = toLeft; endY = toNode.y;
      startDir = 'right'; endDir = 'left';
    } else {
      startX = fromLeft; startY = fromNode.y;
      endX = toRight; endY = toNode.y;
      startDir = 'left'; endDir = 'right';
    }
  } else {
    if (dy > 0) {
      startX = fromNode.x; startY = fromBottom;
      endX = toNode.x; endY = toTop;
      startDir = 'down'; endDir = 'up';
    } else {
      startX = fromNode.x; startY = fromTop;
      endX = toNode.x; endY = toBottom;
      startDir = 'up'; endDir = 'down';
    }
  }

  return { startX, startY, endX, endY, startDir, endDir };
};

// --- Components ---
const DiagramNode = ({ node, colorBlend, isDark }: { node: NodeConfig; colorBlend: number; isDark: boolean }) => {
  const nodeStyleData = getNodeStyle(node.type, colorBlend, isDark);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: node.x,
    top: node.y,
    width: node.w,
    height: node.h,
    transform: 'translate(-50%, -50%)',
    zIndex: node.type === 'group' ? 1 : 10,
    ...nodeStyleData.style,
  };

  const IconComponent = node.icon ? iconMap[node.icon] : null;

  if (node.type === 'group') {
    return (
      <div className={nodeStyleData.className} style={style}>
        <div className="absolute -top-5 left-3 px-2 text-[10px] font-mono tracking-wider" style={{ backgroundColor: nodeStyleData.style.backgroundColor, color: nodeStyleData.style.color }}>
          {node.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-[9px] font-bold shadow-lg ${nodeStyleData.className} backdrop-blur-sm`}
      style={style}
    >
      <div className="flex items-center justify-center gap-1.5 px-1.5">
        {IconComponent && <IconComponent size={12} className="flex-shrink-0" />}
        <span className="text-center leading-tight">{node.label}</span>
      </div>
    </div>
  );
};

interface ConnectionLineProps {
  connection: ConnectionWithColors;
  nodes: NodeConfig[];
  speed: number;
  opacity: number;
  colorBlend: number;
  isDark: boolean;
}

const ConnectionLine = ({ connection, nodes, speed, opacity, colorBlend, isDark }: ConnectionLineProps) => {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);

  if (!fromNode || !toNode) return null;

  const auroraColor = isDark ? connection.auroraColorDark : connection.auroraColorLight;
  const vibrantColor = isDark ? connection.vibrantColorDark : connection.vibrantColorLight;
  const lineColor = lerpColor(auroraColor, vibrantColor, colorBlend);
  const { startX, startY, endX, endY, startDir, endDir } = getSmartConnectionPoints(fromNode, toNode);

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(Math.max(distance * 0.4, 20), 100);

  let cp1x: number, cp1y: number, cp2x: number, cp2y: number;

  switch (startDir) {
    case 'right': cp1x = startX + offset; cp1y = startY; break;
    case 'left': cp1x = startX - offset; cp1y = startY; break;
    case 'down': cp1x = startX; cp1y = startY + offset; break;
    case 'up': cp1x = startX; cp1y = startY - offset; break;
  }

  switch (endDir) {
    case 'right': cp2x = endX + offset; cp2y = endY; break;
    case 'left': cp2x = endX - offset; cp2y = endY; break;
    case 'down': cp2x = endX; cp2y = endY + offset; break;
    case 'up': cp2x = endX; cp2y = endY - offset; break;
  }

  const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  const duration = 5 - (speed / 100) * 4;

  const bgLineColor = isDark ? '#0c1929' : '#5C4A2A';

  return (
    <g>
      <path d={pathD} stroke={bgLineColor} strokeWidth={1.5} fill="none" className="opacity-40" />
      <path d={pathD} stroke={lineColor} strokeWidth="0.75" fill="none" strokeDasharray="4,4" className="opacity-25" />
      <circle r="3" fill={lineColor} style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }} opacity={opacity}>
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
      <circle r="2" fill={lineColor} style={{ filter: `drop-shadow(0 0 2px ${lineColor})` }} opacity={opacity * 0.6}>
        <animateMotion dur={`${duration}s`} begin={`${duration/2}s`} repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
      <circle cx={endX} cy={endY} r="2" fill={lineColor} />
    </g>
  );
};

// --- Main Component ---
export function AuroraCoreDiagram() {
  const [isActive, setIsActive] = useState(true);
  const [speed, setSpeed] = useState(70);
  const [opacity, setOpacity] = useState(0.9);
  const [colorBlend, setColorBlend] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setIsActive(true);
  }, []);

  const gridColor = isDark ? '#22d3ee' : '#F5EFE4';
  const controllerBg = isDark ? 'bg-black/80' : 'bg-[#3D3124]/95';
  const controllerBorder = isDark ? 'border-cyan-500/30' : 'border-[#8B7355]/50';
  const iconColor = isDark ? 'text-cyan-400' : 'text-[#d4c4a8]';
  const titleColor = isDark ? 'text-white' : 'text-[#F5EFE4]';
  const labelColor = isDark ? 'text-white/90' : 'text-[#d4c4a8]';
  const sliderBg = isDark ? 'bg-white/10' : 'bg-[#5C4A2A]';
  const sliderAccent = isDark ? 'accent-cyan-400' : 'accent-[#d4c4a8]';
  const buttonBg = isDark ? 'bg-white/10 hover:bg-white/20 border-cyan-500/30' : 'bg-[#5C4A2A]/80 hover:bg-[#5C4A2A] border-[#8B7355]/50';

  return (
    <div className="w-full h-[560px] relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className={`absolute top-4 left-4 z-20 ${controllerBg} backdrop-blur-sm border ${controllerBorder} rounded-lg p-3 w-48 shadow-lg`}>
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={14} className={iconColor} />
          <span className={`text-[11px] font-semibold ${titleColor} tracking-wide`}>AURORA CORE</span>
        </div>

        <div className="mb-3">
          <label className={`text-[9px] ${labelColor} uppercase tracking-wider mb-1 block`}>Flow Speed</label>
          <input
            type="range"
            min="10"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className={`w-full h-1 ${sliderBg} rounded-lg appearance-none cursor-pointer ${sliderAccent}`}
          />
        </div>

        <div className="mb-3">
          <label className={`text-[9px] ${labelColor} uppercase tracking-wider mb-1 block`}>Particle Opacity</label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className={`w-full h-1 ${sliderBg} rounded-lg appearance-none cursor-pointer ${sliderAccent}`}
          />
        </div>

        <div className="mb-3">
          <label className={`text-[9px] ${labelColor} uppercase tracking-wider mb-1 block`}>Color Theme</label>
          <input
            type="range"
            min="0"
            max="100"
            value={colorBlend * 100}
            onChange={(e) => setColorBlend(Number(e.target.value) / 100)}
            className={`w-full h-1 ${sliderBg} rounded-lg appearance-none cursor-pointer ${sliderAccent}`}
          />
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-full flex items-center justify-center gap-2 py-1.5 ${buttonBg} border rounded text-[10px] ${titleColor} transition-colors`}
        >
          {isActive ? <Pause size={12} /> : <Play size={12} />}
          {isActive ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="relative w-full h-full">
        <svg className="absolute top-0 left-0 w-full h-full z-0">
          <defs>
            <filter id="glow-aurora">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {isActive && AURORA_CONNECTIONS.map((conn) => (
            <ConnectionLine
              key={conn.id}
              connection={conn}
              nodes={AURORA_NODES}
              speed={speed}
              opacity={opacity}
              colorBlend={colorBlend}
              isDark={isDark}
            />
          ))}
        </svg>

        {AURORA_NODES.map((node) => (
          <DiagramNode key={node.id} node={node} colorBlend={colorBlend} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}
