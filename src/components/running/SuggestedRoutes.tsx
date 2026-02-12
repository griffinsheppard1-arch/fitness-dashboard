const ROUTES = [
  {
    name: "Piedmont Park Loop",
    distance: "~3 mi",
    terrain: "Flat, paved paths",
    description:
      "Classic loop around Piedmont Park — great for easy/recovery days. Scenic lake views and shade coverage.",
    color: "emerald",
  },
  {
    name: "BeltLine Eastside Trail",
    distance: "3–5 mi",
    terrain: "Flat, traffic-free paved trail",
    description:
      "Midtown to Inman Park via the BeltLine. Flat, smooth surface perfect for tempo runs or stroller-friendly easy runs.",
    color: "blue",
  },
  {
    name: "Midtown → Centennial Olympic Park",
    distance: "~6 mi",
    terrain: "Moderate, some hills on sidewalks",
    description:
      "Urban route through downtown Atlanta. Good for moderate-effort runs with some gentle elevation changes.",
    color: "amber",
  },
  {
    name: "10th St → Piedmont Park → BeltLine",
    distance: "~8 mi",
    terrain: "Rolling hills, mixed surfaces",
    description:
      "Combine Piedmont Park with the BeltLine for a longer route. Rolling terrain builds strength for marathon prep.",
    color: "violet",
  },
  {
    name: "Full BeltLine Loop",
    distance: "~13 mi",
    terrain: "Moderate, partially unpaved",
    description:
      "Complete BeltLine circuit — perfect for half-marathon distance long runs. Mix of paved and crushed gravel sections.",
    color: "rose",
  },
  {
    name: "Silver Comet Trail (from Smyrna)",
    distance: "10–20 mi",
    terrain: "Flat, paved rail-trail",
    description:
      "Drive to Smyrna trailhead for dead-flat long runs. Perfect for marathon-pace workouts with no traffic lights.",
    color: "cyan",
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-400",
  },
};

export default function SuggestedRoutes() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        📍 Suggested Routes — Midtown Atlanta
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Popular running routes near you, sorted by distance
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROUTES.map((route) => {
          const colors = COLOR_MAP[route.color] || COLOR_MAP.blue;
          return (
            <div
              key={route.name}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4 space-y-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${colors.text}`}>
                  {route.name}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${colors.badge}`}
                >
                  {route.distance}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                {route.terrain}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {route.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
