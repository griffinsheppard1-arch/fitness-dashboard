interface Row {
  metric: string;
  thisWeek: string | number;
  lastWeek: string | number;
  fourWeek?: string | number;
  twelveWeek?: string | number;
}

export default function ComparisonTable({
  title,
  rows,
  showAverages = false,
}: {
  title: string;
  rows: Row[];
  showAverages?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left border-b border-gray-800">
            <th className="pb-2 font-medium">{title}</th>
            <th className="pb-2 font-medium">This Week</th>
            <th className="pb-2 font-medium">Last Week</th>
            {showAverages && (
              <>
                <th className="pb-2 font-medium">4-Wk Avg</th>
                <th className="pb-2 font-medium">12-Wk Avg</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.metric} className="border-b border-gray-800/50 text-gray-300">
              <td className="py-2 text-gray-400">{row.metric}</td>
              <td className="py-2 font-medium">{row.thisWeek}</td>
              <td className="py-2">{row.lastWeek}</td>
              {showAverages && (
                <>
                  <td className="py-2">{row.fourWeek ?? "—"}</td>
                  <td className="py-2">{row.twelveWeek ?? "—"}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
