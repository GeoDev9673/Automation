import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary, AnalyticsSummary } from '../utils/analytics';
import logoImg from '../assets/images/logo.png';
import { PARALIFE_META } from '../data/paralifeData';

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
  const chartWidth = 840;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartData = data?.chartData || [];
  const maxVisits = Math.max(...chartData.map((d) => d.visits), 5);

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / Math.max(chartData.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.visits / maxVisits) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

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
    <div className="min-h-screen w-full bg-[#121316] text-[#F2EEE8] selection:bg-[#FF2D85]/30">
      
      {/* Top Brand Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#121316]/95 backdrop-blur-sm border-b border-[#F2EEE8]/10 py-6 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-6">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <img
                src={logoImg}
                alt={PARALIFE_META.brandName}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
            <span className="section-label text-[#FF2D85] cursor-default hidden sm:inline-block">
              +control panel
            </span>
          </div>

          <div className="flex items-center space-x-6 md:space-x-8">
            {/* Range Filters */}
            <div className="flex items-center space-x-4 text-[12px] uppercase tracking-[0.1em]">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setDaysRange(days)}
                  className={`transition-colors cursor-pointer ${
                    daysRange === days ? 'text-[#FF2D85] font-semibold' : 'text-[#F2EEE8]/52 hover:text-[#F2EEE8]'
                  }`}
                >
                  +{days}d
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={() => loadData(daysRange)}
              className="text-[12px] uppercase tracking-[0.1em] text-[#F2EEE8]/52 hover:text-[#FF2D85] transition-colors cursor-pointer hidden sm:inline-block"
            >
              +refresh
            </button>

            {/* Exit to Site */}
            <button
              onClick={onClose}
              className="text-[12px] uppercase tracking-[0.1em] text-[#F2EEE8]/76 hover:text-[#FF2D85] transition-colors cursor-pointer font-medium"
            >
              ← return
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col space-y-16">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-10 border-b border-[#F2EEE8]/10 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-[13px] tracking-[0.1em] uppercase transition-colors cursor-pointer font-medium ${
              activeTab === 'overview' ? 'text-[#FF2D85]' : 'text-[#F2EEE8]/52 hover:text-[#F2EEE8]'
            }`}
          >
            +analytics
          </button>
          
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`text-[13px] tracking-[0.1em] uppercase transition-colors cursor-pointer font-medium ${
              activeTab === 'subscribers' ? 'text-[#FF2D85]' : 'text-[#F2EEE8]/52 hover:text-[#F2EEE8]'
            }`}
          >
            +subscribers
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CHARTS */}
        {activeTab === 'overview' && (
          <div className="flex flex-col space-y-20 animate-fade-in">
            
            {/* 100% REAL Unique Devices Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border-b border-[#F2EEE8]/10 pb-16">
              
              <div className="flex flex-col space-y-3">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#F2EEE8]/52 font-medium">
                  UNIQUE DEVICES
                </span>
                <span className="text-4xl md:text-5xl font-light tracking-tight text-[#F2EEE8]">
                  {loading ? '...' : data?.uniqueVisitors.toLocaleString()}
                </span>
                <span className="text-[12px] tracking-[0.06em] text-[#F2EEE8]/52 uppercase">
                  1 visit per unique device
                </span>
              </div>

              <div className="flex flex-col space-y-3">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#F2EEE8]/52 font-medium">
                  TODAY'S DEVICES
                </span>
                <span className="text-4xl md:text-5xl font-light tracking-tight text-[#F2EEE8]">
                  {loading ? '...' : data?.todayVisits.toLocaleString()}
                </span>
                <span className="text-[12px] tracking-[0.06em] text-[#F2EEE8]/52 uppercase">
                  New devices today
                </span>
              </div>

              <div className="flex flex-col space-y-3">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#F2EEE8]/52 font-medium">
                  SIGNAL SUBSCRIBERS
                </span>
                <span className="text-4xl md:text-5xl font-light tracking-tight text-[#FF2D85]">
                  {loading ? '...' : data?.totalSubscribers.toLocaleString()}
                </span>
                <span className="text-[12px] tracking-[0.06em] text-[#00FF88] uppercase">
                  Real database records
                </span>
              </div>

              <div className="flex flex-col space-y-3">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#F2EEE8]/52 font-medium">
                  CONVERSION RATE
                </span>
                <span className="text-4xl md:text-5xl font-light tracking-tight text-[#F2EEE8]">
                  {loading ? '...' : `${data?.conversionRate}%`}
                </span>
                <span className="text-[12px] tracking-[0.06em] text-[#F2EEE8]/52 uppercase">
                  Subscribers / Devices
                </span>
              </div>

            </div>

            {/* REAL INTERACTIVE TRAFFIC ACTIVITY CHART */}
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <span className="section-label text-[#F2EEE8]/52">
                    +signal activity
                  </span>
                  <h3 className="type-h3 text-[#F2EEE8] mt-2">
                    Real Traffic Trajectory
                  </h3>
                </div>
                <div className="flex items-center space-x-6 text-[12px] uppercase tracking-[0.1em]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D85]"></span>
                    <span className="text-[#F2EEE8]/76">Total Visits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
                    <span className="text-[#F2EEE8]/76">Uniques</span>
                  </div>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="w-full bg-[#16171c] border border-[#F2EEE8]/10 p-6 md:p-8 relative overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto min-w-[580px]"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="paralifeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.33, 0.66, 1].map((ratio) => {
                    const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                    const val = Math.round(ratio * maxVisits);
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="rgba(242, 238, 232, 0.06)"
                        />
                        <text
                          x={paddingX - 12}
                          y={y + 3}
                          fill="rgba(242, 238, 232, 0.35)"
                          fontSize="10"
                          textAnchor="end"
                          className="font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Pink Fill Area */}
                  {areaPath && <path d={areaPath} fill="url(#paralifeGradient)" />}

                  {/* Main Pink Wave */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#FF2D85"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Interactive Nodes */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#121316"
                        stroke="#FF2D85"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all duration-150"
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
                      {(idx === 0 ||
                        idx === Math.floor(points.length / 2) ||
                        idx === points.length - 1) && (
                        <text
                          x={p.x}
                          y={chartHeight - 4}
                          fill="rgba(242, 238, 232, 0.45)"
                          fontSize="10"
                          textAnchor="middle"
                          className="uppercase tracking-wider"
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
                    className="absolute z-20 pointer-events-none bg-[#121316] border border-[#FF2D85]/80 px-4 py-2.5 shadow-2xl text-[12px] flex flex-col space-y-1"
                    style={{
                      left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                      top: `${(hoveredPoint.y / chartHeight) * 100 - 25}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="font-medium text-[#F2EEE8] tracking-wider uppercase">
                      {hoveredPoint.date}
                    </span>
                    <span className="text-[#FF2D85] font-mono">
                      Visits: {hoveredPoint.visits}
                    </span>
                    <span className="text-[#00FF88] font-mono">
                      Unique: {hoveredPoint.uniques}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUBSCRIBERS TABLE */}
        {activeTab === 'subscribers' && (
          <div className="flex flex-col space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#F2EEE8]/10 pb-6">
              <div>
                <span className="section-label text-[#F2EEE8]/52">+database</span>
                <h3 className="type-h3 text-[#F2EEE8] mt-1">Verified Signal Subscribers</h3>
              </div>
              <button
                onClick={handleExportCSV}
                className="py-2.5 px-6 text-[12px] tracking-[0.1em] uppercase bg-[#FF2D85] hover:bg-[#ff1275] text-white font-medium transition-colors cursor-pointer"
              >
                +export csv
              </button>
            </div>

            {data?.subscribers.length === 0 ? (
              <div className="py-20 text-center text-[#F2EEE8]/40 text-[13px] tracking-wider uppercase">
                No active subscribers in database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] tracking-wide">
                  <thead>
                    <tr className="border-b border-[#F2EEE8]/10 text-[#F2EEE8]/40 uppercase text-[11px] tracking-[0.14em]">
                      <th className="py-4 px-4 font-normal">#</th>
                      <th className="py-4 px-4 font-normal">Email Address</th>
                      <th className="py-4 px-4 font-normal">Timestamp</th>
                      <th className="py-4 px-4 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.subscribers.map((sub, idx) => (
                      <tr
                        key={sub.id || idx}
                        className="border-b border-[#F2EEE8]/6 hover:bg-[#18191f] transition-colors"
                      >
                        <td className="py-4 px-4 text-[#F2EEE8]/40 font-mono">{idx + 1}</td>
                        <td className="py-4 px-4 text-[#F2EEE8] font-medium">{sub.email}</td>
                        <td className="py-4 px-4 text-[#F2EEE8]/60 font-mono text-[12px]">
                          {new Date(sub.created_at).toLocaleString('ru-RU')}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[11px] tracking-[0.1em] text-[#00FF88] uppercase font-medium">
                            +{sub.status || 'active'}
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

      </main>

      {/* Admin Footer */}
      <footer className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 border-t border-[#F2EEE8]/10 flex flex-col sm:flex-row items-center justify-between text-[12px] tracking-[0.1em] text-[#F2EEE8]/40 uppercase gap-4">
        <span>© PARALIFE // SECURE CONTROL</span>
        <span>Less Noise. More Life.</span>
      </footer>

    </div>
  );
};
