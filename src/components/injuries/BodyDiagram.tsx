"use client";

import type { BodyPartHeatmap } from "@/lib/types";

interface BodyDiagramProps {
  heatmap: BodyPartHeatmap[];
  onSelectBodyPart?: (bodyPart: string) => void;
}

const BODY_REGION_PATHS: Record<
  string,
  { front?: { d: string; cx?: number; cy?: number }; back?: { d: string; cx?: number; cy?: number } }
> = {
  Head: {
    front: { cx: 100, cy: 30, d: "circle" },
  },
  Neck: {
    front: { cx: 100, cy: 55, d: "rect:80,50,40,12" },
  },
  Shoulders: {
    front: { d: "M60,68 L80,62 L120,62 L140,68 L140,78 L120,72 L80,72 L60,78 Z" },
    back: { d: "M60,68 L80,62 L120,62 L140,68 L140,78 L120,72 L80,72 L60,78 Z" },
  },
  Chest: {
    front: { d: "M75,75 L125,75 L130,105 L70,105 Z" },
  },
  "Upper back": {
    back: { d: "M75,75 L125,75 L130,105 L70,105 Z" },
  },
  "Core/Abs": {
    front: { d: "M80,108 L120,108 L122,150 L78,150 Z" },
  },
  "Lower back": {
    back: { d: "M80,108 L120,108 L122,150 L78,150 Z" },
  },
  Biceps: {
    front: { d: "M55,80 L65,80 L63,115 L53,115 Z|M135,80 L145,80 L147,115 L137,115 Z" },
  },
  Forearms: {
    front: { d: "M52,118 L64,118 L60,155 L48,155 Z|M136,118 L148,118 L152,155 L140,155 Z" },
  },
  Wrists: {
    front: { d: "M48,157 L61,157 L59,168 L46,168 Z|M139,157 L152,157 L154,168 L141,168 Z" },
  },
  Hips: {
    front: { d: "M72,148 L128,148 L130,165 L70,165 Z" },
  },
  Glutes: {
    back: { d: "M72,148 L128,148 L130,175 L70,175 Z" },
  },
  Quads: {
    front: { d: "M72,168 L95,168 L93,230 L70,230 Z|M105,168 L128,168 L130,230 L107,230 Z" },
  },
  Hamstrings: {
    back: { d: "M72,178 L95,178 L93,235 L70,235 Z|M105,178 L128,178 L130,235 L107,235 Z" },
  },
  "IT Band": {
    front: { d: "M63,168 L72,168 L70,230 L61,230 Z|M128,168 L137,168 L139,230 L130,230 Z" },
  },
  Knees: {
    front: { cx: 82, cy: 238, d: "circle:8|cx:118,cy:238,circle:8" },
  },
  Shins: {
    front: { d: "M74,248 L90,248 L88,300 L72,300 Z|M110,248 L126,248 L128,300 L112,300 Z" },
  },
  Calves: {
    back: { d: "M74,242 L92,242 L90,296 L72,296 Z|M108,242 L126,242 L128,296 L110,296 Z" },
  },
  Ankles: {
    front: { cx: 81, cy: 308, d: "circle:6|cx:119,cy:308,circle:6" },
  },
  Feet: {
    front: { d: "M72,315 L92,315 L92,330 L72,330 Z|M108,315 L128,315 L128,330 L108,330 Z" },
  },
};

function getHeatmapColor(
  heatmap: BodyPartHeatmap[],
  bodyPart: string
): string {
  const entry = heatmap.find((h) => h.body_part === bodyPart);
  if (!entry) return "#1f2937"; // gray-800 — no data

  if (entry.active_count > 0) {
    // Active injury — red intensity based on severity
    const intensity = Math.min(entry.max_severity / 10, 1);
    const r = Math.round(180 + intensity * 75);
    const g = Math.round(40 * (1 - intensity));
    const b = Math.round(40 * (1 - intensity));
    return `rgb(${r},${g},${b})`;
  }

  // Past injuries only — amber/yellow
  const intensity = Math.min(entry.injury_count / 5, 1);
  const r = Math.round(180 + intensity * 75);
  const g = Math.round(140 + intensity * 40);
  const b = Math.round(30 * (1 - intensity));
  return `rgb(${r},${g},${b})`;
}

function parsePathSegments(d: string): string[] {
  return d.split("|");
}

function renderRegion(
  pathDef: { d: string; cx?: number; cy?: number },
  color: string,
  bodyPart: string,
  onClick?: () => void
) {
  const segments = parsePathSegments(pathDef.d);
  return segments.map((seg, i) => {
    const key = `${bodyPart}-${i}`;
    const props = {
      fill: color,
      fillOpacity: 0.7,
      stroke: color === "#1f2937" ? "#374151" : color,
      strokeWidth: 0.5,
      className: "cursor-pointer transition-opacity hover:opacity-100",
      opacity: 0.8,
      onClick,
    };

    // Circle syntax: "circle" or "circle:R" or "cx:N,cy:N,circle:R"
    if (seg.includes("circle")) {
      let cx = pathDef.cx || 0;
      let cy = pathDef.cy || 0;
      let r = 12;

      const cxMatch = seg.match(/cx:(\d+)/);
      const cyMatch = seg.match(/cy:(\d+)/);
      const rMatch = seg.match(/circle:(\d+)/);

      if (cxMatch) cx = parseInt(cxMatch[1]);
      if (cyMatch) cy = parseInt(cyMatch[1]);
      if (rMatch) r = parseInt(rMatch[1]);

      return <circle key={key} cx={cx} cy={cy} r={r} {...props} />;
    }

    // Rect syntax: "rect:x,y,w,h"
    if (seg.startsWith("rect:")) {
      const [x, y, w, h] = seg.replace("rect:", "").split(",").map(Number);
      return <rect key={key} x={x} y={y} width={w} height={h} rx={3} {...props} />;
    }

    // Path
    return <path key={key} d={seg.trim()} {...props} />;
  });
}

// Simple body outline for context
function BodyOutline() {
  return (
    <path
      d="M100,18 C88,18 80,28 80,38 C80,48 88,55 100,55 C112,55 120,48 120,38 C120,28 112,18 100,18 Z
         M80,60 L60,72 L50,110 L55,112 L65,80 L78,72 L78,155 L70,168 L62,230 L60,250 L58,310 L56,330 L72,332 L74,315 L76,280 L80,248 L84,230 L95,170 L105,170 L116,230 L120,248 L124,280 L126,315 L128,332 L144,330 L142,310 L140,250 L138,230 L130,168 L122,155 L122,72 L135,80 L145,112 L150,110 L140,72 L120,60 Z"
      fill="none"
      stroke="#374151"
      strokeWidth={1}
      opacity={0.5}
    />
  );
}

export default function BodyDiagram({
  heatmap,
  onSelectBodyPart,
}: BodyDiagramProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Body Map</h3>
      <p className="text-xs text-gray-500 mb-4">
        Click a region to pre-fill the injury form
      </p>

      <div className="flex justify-center gap-6">
        {/* Front View */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
            Front
          </p>
          <svg viewBox="0 0 200 350" className="w-36 sm:w-44 h-auto">
            <BodyOutline />
            {Object.entries(BODY_REGION_PATHS).map(([part, regions]) => {
              if (!regions.front) return null;
              const color = getHeatmapColor(heatmap, part);
              return renderRegion(
                regions.front,
                color,
                `front-${part}`,
                onSelectBodyPart ? () => onSelectBodyPart(part) : undefined
              );
            })}
          </svg>
        </div>

        {/* Back View */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
            Back
          </p>
          <svg viewBox="0 0 200 350" className="w-36 sm:w-44 h-auto">
            <BodyOutline />
            {Object.entries(BODY_REGION_PATHS).map(([part, regions]) => {
              if (!regions.back) return null;
              const color = getHeatmapColor(heatmap, part);
              return renderRegion(
                regions.back,
                color,
                `back-${part}`,
                onSelectBodyPart ? () => onSelectBodyPart(part) : undefined
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-800 border border-gray-700" />
          <span className="text-[10px] text-gray-500">No injuries</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(220,160,20)" }} />
          <span className="text-[10px] text-gray-500">Past</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(220,30,30)" }} />
          <span className="text-[10px] text-gray-500">Active</span>
        </div>
      </div>
    </div>
  );
}
