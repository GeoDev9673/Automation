import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary, AnalyticsSummary } from '../utils/analytics';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [daysRange, setDaysRange] = useState<number>(14);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    date: string;
    visits: number;
    uniques: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers'>('overview');

  const loadData = async (range: number) => {
    setLoading(true);
    const summary = await getAnalyticsSummary(range);
    setData(summary);
    setLoading(false);
  };

  useEffect(() => {
    loadData(daysRange);
  }, [daysRange]);

  // Export Subscribers to CSV
  const handleExportCSV = () => {
    if (!data || !data.subscribers.length) return;
    const csvHeader = 'ID,Email,Created At,Status\n';
    const csvRows = data.subscribers
      .map((s) => `"${s.id}","${s.email}","${s.created_at}","${s.status}"`)
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `paralife_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Dimensions
  const chartWidth = 760;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartData = data?.chartData || [];
  const maxVisits = Math.max(...chartData.map((d) => d.visits), 100);

  // Compute SVG Points
  const points = chartData.map((d, index) => {
    const x = paddingX + (index / Math.max(chartData.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.visits / maxVisits) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Construct smooth SVG path
  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
        chartHeight - paddingY
      } Z`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0e0f12]/95 backdrop-blur-md text-[#F2EEE8] font-sans animate-fade-in">
      <div className="min-h-screen max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8">
        
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F2EEE8]/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-pulse"></span>
              <span className="text-[12px] tracking-[0.2em] uppercase font-bold text-[#FF2D85]">
                PARALIFE // CONTROL CENTER
              </span>
            </div>
            <span className="text-[12px] text-[#F2EEE8]/40">•</span>
            <span className="text-[12px] text-[#F2EEE8]/60 uppercase tracking-widest">
              Live Signal Analytics
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Days Filter */}
            <div className="flex items-center bg-[#18191e] border border-[#F2EEE8]/10 rounded p-0.5">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setDaysRange(days)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded transition-colors ${
                    daysRange === days
                      ? 'bg-[#FF2D85] text-white shadow-sm'
                      : 'text-[#F2EEE8]/60 hover:text-white'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(daysRange)}
              title="Refresh Data"
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider bg-[#18191e] border border-[#F2EEE8]/10 hover:border-[#FF2D85] text-[#F2EEE8]/80 hover:text-white rounded transition-colors"
            >
              ↻ Refresh
            </button>

            {/* Exit / Close */}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[11px] uppercase tracking-wider bg-[#22242b] hover:bg-[#FF2D85] text-white font-medium rounded transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-[#F2EEE8]/10 space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-[13px] uppercase tracking-widest font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#FF2D85] text-white'
                : 'border-transparent text-[#F2EEE8]/50 hover:text-[#F2EEE8]'
            }`}
          >
            Overview & Graphs
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-[13px] uppercase tracking-widest font-medium border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'subscribers'
                ? 'border-[#FF2D85] text-white'
                : 'border-transparent text-[#F2EEE8]/50 hover:text-[#F2EEE8]'
            }`}
          >
            <span>Subscribers</span>
            <span className="text-[10px] bg-[#FF2D85]/20 text-[#FF2D85] px-1.5 py-0.5 rounded">
              {data?.subscribers.length || 0}
            </span>
          </button>
        </div>

        {/* TAB CONTENT: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* STATS METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-5 rounded-lg flex flex-col justify-between hover:border-[#FF2D85]/40 transition-colors">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#F2EEE8]/50 font-medium">
                  Total Visits
                </span>
                <div className="my-2">
                  <span className="text-3xl font-light text-white tracking-tight">
                    {loading ? '...' : data?.totalVisits.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-[#00FF88] flex items-center space-x-1">
                  <span>↑ +18.4%</span>
                  <span className="text-[#F2EEE8]/40">vs last period</span>
                </span>
              </div>

              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-5 rounded-lg flex flex-col justify-between hover:border-[#FF2D85]/40 transition-colors">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#F2EEE8]/50 font-medium">
                  Unique Visitors
                </span>
                <div className="my-2">
                  <span className="text-3xl font-light text-white tracking-tight">
                    {loading ? '...' : data?.uniqueVisitors.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-[#00FF88] flex items-center space-x-1">
                  <span>↑ +12.1%</span>
                  <span className="text-[#F2EEE8]/40">reach</span>
                </span>
              </div>

              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-5 rounded-lg flex flex-col justify-between hover:border-[#FF2D85]/40 transition-colors">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#F2EEE8]/50 font-medium">
                  Subscribers
                </span>
                <div className="my-2">
                  <span className="text-3xl font-light text-[#FF2D85] tracking-tight">
                    {loading ? '...' : data?.totalSubscribers.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-[#F2EEE8]/60">
                  Active in Signal
                </span>
              </div>

              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-5 rounded-lg flex flex-col justify-between hover:border-[#FF2D85]/40 transition-colors">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#F2EEE8]/50 font-medium">
                  Conversion Rate
                </span>
                <div className="my-2">
                  <span className="text-3xl font-light text-white tracking-tight">
                    {loading ? '...' : `${data?.conversionRate}%`}
                  </span>
                </div>
                <span className="text-[11px] text-[#00FF88]">
                  High engagement
                </span>
              </div>

              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-5 rounded-lg flex flex-col justify-between hover:border-[#FF2D85]/40 transition-colors">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#F2EEE8]/50 font-medium">
                  Today's Pulse
                </span>
                <div className="my-2">
                  <span className="text-3xl font-light text-white tracking-tight">
                    {loading ? '...' : data?.todayVisits}
                  </span>
                </div>
                <span className="text-[11px] text-[#FF2D85] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D85] animate-ping"></span>
                  <span>Live online</span>
                </span>
              </div>

            </div>

            {/* INTERACTIVE ANALYTICS CHART */}
            <div className="bg-[#141519] border border-[#F2EEE8]/10 p-6 rounded-lg relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
                <div>
                  <h3 className="text-lg font-normal tracking-wide text-white">
                    Signal Traffic Activity
                  </h3>
                  <p className="text-[12px] text-[#F2EEE8]/50 mt-0.5">
                    Daily website visits & unique reach over the last {daysRange} days
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-[12px]">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-[#FF2D85]"></span>
                    <span className="text-[#F2EEE8]/70">Visits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded bg-[#00FF88]/70"></span>
                    <span className="text-[#F2EEE8]/70">Uniques</span>
                  </div>
                </div>
              </div>

              {/* SVG GRAPH */}
              <div className="w-full overflow-x-auto relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto min-w-[500px]"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    {/* Pink Gradient for Area Fill */}
                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                    const val = Math.round(ratio * maxVisits);
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="rgba(242, 238, 232, 0.08)"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 3}
                          fill="rgba(242, 238, 232, 0.35)"
                          fontSize="9"
                          textAnchor="end"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Fill */}
                  {areaPath && <path d={areaPath} fill="url(#pinkGradient)" />}

                  {/* Main Curved Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#FF2D85"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#121316"
                        stroke="#FF2D85"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            x: p.x,
                            y: p.y,
                            date: p.fullDate,
                            visits: p.visits,
                            uniques: p.uniques,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Date label at bottom */}
                      {(idx === 0 ||
                        idx === Math.floor(points.length / 2) ||
                        idx === points.length - 1) && (
                        <text
                          x={p.x}
                          y={chartHeight - 6}
                          fill="rgba(242, 238, 232, 0.5)"
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {p.date}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>

                {/* Floating Tooltip */}
                {hoveredPoint && (
                  <div
                    className="absolute z-20 pointer-events-none bg-[#1a1b22] border border-[#FF2D85]/60 px-3 py-2 rounded shadow-2xl text-[12px] flex flex-col space-y-1"
                    style={{
                      left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                      top: `${(hoveredPoint.y / chartHeight) * 100 - 30}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="font-semibold text-white">{hoveredPoint.date}</span>
                    <span className="text-[#FF2D85]">Visits: {hoveredPoint.visits}</span>
                    <span className="text-[#00FF88]">Unique: {hoveredPoint.uniques}</span>
                  </div>
                )}
              </div>
            </div>

            {/* BREAKDOWNS: DEVICES & REFERRERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Device Split */}
              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-6 rounded-lg">
                <h4 className="text-[14px] uppercase tracking-wider font-medium text-white mb-4">
                  Device Distribution
                </h4>
                <div className="space-y-4">
                  {data?.devices.map((dev) => (
                    <div key={dev.name} className="space-y-1.5">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[#F2EEE8]/70">{dev.name}</span>
                        <span className="text-white font-medium">
                          {dev.percentage}% ({dev.count.toLocaleString()})
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#1c1e24] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF2D85] to-[#FF6BA8] rounded-full"
                          style={{ width: `${dev.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-[#141519] border border-[#F2EEE8]/10 p-6 rounded-lg">
                <h4 className="text-[14px] uppercase tracking-wider font-medium text-white mb-4">
                  Traffic Sources
                </h4>
                <div className="space-y-4">
                  {data?.referrers.map((ref) => (
                    <div key={ref.source} className="space-y-1.5">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[#F2EEE8]/70">{ref.source}</span>
                        <span className="text-white font-medium">
                          {ref.percentage}% ({ref.count.toLocaleString()})
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#1c1e24] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00FF88] to-[#00D1FF] rounded-full"
                          style={{ width: `${ref.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB CONTENT: SUBSCRIBERS TABLE */}
        {activeTab === 'subscribers' && (
          <div className="bg-[#141519] border border-[#F2EEE8]/10 p-6 rounded-lg space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EEE8]/10">
              <div>
                <h3 className="text-base font-normal text-white">Signal Subscribers</h3>
                <p className="text-[12px] text-[#F2EEE8]/50">
                  Real subscriber records pulled directly from Supabase
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider bg-[#FF2D85] hover:bg-[#ff1275] text-white font-semibold rounded transition-colors"
              >
                ↓ Export CSV
              </button>
            </div>

            {data?.subscribers.length === 0 ? (
              <div className="py-12 text-center text-[#F2EEE8]/40 text-[13px]">
                No subscribers recorded yet in Supabase.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#F2EEE8]/10 text-[#F2EEE8]/40 uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Subscribed At</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.subscribers.map((sub, idx) => (
                      <tr
                        key={sub.id || idx}
                        className="border-b border-[#F2EEE8]/5 hover:bg-[#191b22] transition-colors"
                      >
                        <td className="py-3 px-4 text-[#F2EEE8]/40">{idx + 1}</td>
                        <td className="py-3 px-4 text-white font-medium">{sub.email}</td>
                        <td className="py-3 px-4 text-[#F2EEE8]/60">
                          {new Date(sub.created_at).toLocaleString('ru-RU')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] px-2 py-0.5 rounded uppercase font-semibold bg-[#00FF88]/10 text-[#00FF88]">
                            {sub.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
