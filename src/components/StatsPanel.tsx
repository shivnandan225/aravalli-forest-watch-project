import React from 'react';
import { Language, EscalationCase } from '../types';
import { translations } from '../translations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  Clock,
  Radio,
  ShieldAlert,
  TrendingUp,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface StatsPanelProps {
  language: Language;
  cases: EscalationCase[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  language,
  cases,
}) => {
  const t = translations[language];

  // Derived metrics
  const activeAlerts = cases.filter((c) => c.status === 'Pending review').length;
  const verifiedCount = cases.filter((c) => c.status === 'Verified').length;
  const escalationsTriggered = cases.filter((c) => c.level > 1).length;

  // Hourly trend synthetic distribution
  const hourlyData = [
    { hour: '00:00', acoustic: 1, satellite: 0, responseSec: 42 },
    { hour: '04:00', acoustic: 2, satellite: 1, responseSec: 38 },
    { hour: '08:00', acoustic: 5, satellite: 2, responseSec: 29 },
    { hour: '12:00', acoustic: 7, satellite: 3, responseSec: 25 },
    { hour: '16:00', acoustic: 4, satellite: 1, responseSec: 31 },
    { hour: '20:00', acoustic: 3, satellite: 2, responseSec: 35 },
  ];

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-emerald-400 border border-[#2e543d] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'डैशबोर्ड विश्लेषण एवं परिचालन आंकड़े' : 'Operational Telemetry & Performance'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                REAL-TIME TELEMETRY
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'औसत पावती समय, सक्रिय घटनाएं एवं नोड स्वास्थ्य स्थिति'
                : 'Mean time to respond, active escalation cases, and edge node connectivity.'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono-code">
        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-1">
          <div className="text-xs text-[#869e90] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            Active Alerts
          </div>
          <div className="text-2xl font-bold text-white">{activeAlerts}</div>
          <div className="text-[10px] text-[#6d8a79]">Pending verification</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-1">
          <div className="text-xs text-[#869e90] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            Avg Acknowledge Time
          </div>
          <div className="text-2xl font-bold text-emerald-400">32.4s</div>
          <div className="text-[10px] text-[#6d8a79]">Target: &lt; 60 seconds</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-1">
          <div className="text-xs text-[#869e90] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Escalations Triggered
          </div>
          <div className="text-2xl font-bold text-amber-300">{escalationsTriggered}</div>
          <div className="text-[10px] text-[#6d8a79]">Escalated past Level 1</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-1">
          <div className="text-xs text-[#869e90] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            Devices Online
          </div>
          <div className="text-2xl font-bold text-sky-400">4 / 4</div>
          <div className="text-[10px] text-[#6d8a79]">100% mesh health (simulated)</div>
        </div>
      </div>

      {/* Recharts Trend Chart */}
      <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-[#c9d99f]">
          <span>Telemetry Incident Volume (24h Trend)</span>
          <span className="text-[#869e90]">Synthetic Distribution</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAcoustic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSatellite" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#4b6b58" tick={{ fontSize: 11 }} />
              <YAxis stroke="#4b6b58" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1a14',
                  borderColor: '#244232',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="acoustic"
                name="Acoustic Anomaly"
                stroke="#34d399"
                fillOpacity={1}
                fill="url(#colorAcoustic)"
              />
              <Area
                type="monotone"
                dataKey="satellite"
                name="Satellite Anomaly"
                stroke="#38bdf8"
                fillOpacity={1}
                fill="url(#colorSatellite)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
