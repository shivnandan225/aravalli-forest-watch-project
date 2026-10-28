import React, { useState } from 'react';
import { Language, EscalationCase, CaseStatus } from '../types';
import { translations } from '../translations';
import { CheckSquare, Filter, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

interface ReviewQueuePanelProps {
  language: Language;
  cases: EscalationCase[];
  onUpdateStatus: (caseId: string, status: CaseStatus) => void;
  onOpenReport: (caseId: string) => void;
}

export const ReviewQueuePanel: React.FC<ReviewQueuePanelProps> = ({
  language,
  cases,
  onUpdateStatus,
  onOpenReport,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Verified' | 'Dismissed'>('All');

  const filteredCases = cases.filter((c) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return c.status === 'Pending review' || c.status === 'Referred for departmental / legal review';
    if (filter === 'Verified') return c.status === 'Verified';
    if (filter === 'Dismissed') return c.status === 'Dismissed';
    return true;
  });

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-sky-400 border border-[#2e543d] flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'मानवीय फैसले एवं सत्यापन सूची' : 'Human Decisions & Review Queue'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
                HUMAN-IN-THE-LOOP
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'कंप्यूटर केवल पूछता है। यहां आप तय करते हैं कि अलर्ट सही था या गलत संकेत था।'
                : 'Every alert stays here until a person confirms it on the ground or marks it as a false alarm.'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0c1611] border border-[#1e382b] text-xs">
          {(['All', 'Pending', 'Verified', 'Dismissed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                filter === tab
                  ? 'bg-[#223d2f] text-[#c9d99f] shadow'
                  : 'text-[#869e90] hover:text-white'
              }`}
            >
              {tab === 'All'
                ? (language === 'hi' ? 'सभी' : 'All')
                : tab === 'Pending'
                ? (language === 'hi' ? 'जांच बाकी' : 'Awaiting Check')
                : tab === 'Verified'
                ? (language === 'hi' ? 'पुष्टि हो चुकी' : 'Verified')
                : (language === 'hi' ? 'खारिज' : 'Dismissed')}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="px-4 py-2.5 rounded-xl bg-[#182315] border border-[#3e4f20] text-xs text-[#e2be82] flex items-center gap-2">
        <UserCheck className="w-4 h-4 shrink-0 text-[#e2be82]" />
        <span>
          <strong>{t.ruleBadge}</strong>{' '}
          {language === 'hi'
            ? 'बिना जमीनी जांच के किसी भी व्यक्ति या कामगार पर कार्रवाई नहीं की जा सकती।'
            : 'No automated alert can ever be used as proof without physical inspection.'}
        </span>
      </div>

      {/* Case Review Items */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 text-[#869e90] text-xs font-mono-code">
            {language === 'hi' ? 'इस श्रेणी में कोई मामला नहीं है।' : 'No incidents found in this filter category.'}
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-[#0c1611] border border-[#1e382b] hover:border-[#2f553f] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#e2be82] font-bold font-mono-code">{c.id.toUpperCase()}</span>
                  <span className="text-[#869e90]">· {c.category} ({c.deviceId})</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-code ${
                      c.status === 'Verified'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : c.status === 'Dismissed'
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="font-semibold text-white text-sm">
                  {c.title}
                </div>
                <div className="text-[#718b7c] text-[11px] font-mono-code">
                  Logged at: {new Date(c.createdAt).toLocaleTimeString()} IST · Lat {c.latitude.toFixed(4)}, Lng {c.longitude.toFixed(4)}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onUpdateStatus(c.id, 'Verified')}
                  className="px-3.5 py-2 rounded-lg bg-[#142d1f] hover:bg-[#1c3e2b] border border-[#2b593d] text-emerald-300 flex items-center gap-1.5 transition-colors font-semibold"
                  title="Confirm real disturbance found on site"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पुष्टि करें' : 'Confirm Verified'}</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(c.id, 'Dismissed')}
                  className="px-3.5 py-2 rounded-lg bg-[#221717] hover:bg-[#322020] border border-red-950 text-red-300 flex items-center gap-1.5 transition-colors font-semibold"
                  title="Dismiss as false alarm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'खारिज करें' : 'Dismiss (Safe)'}</span>
                </button>

                <button
                  onClick={() => onOpenReport(c.id)}
                  className="px-3.5 py-2 rounded-lg bg-[#192b3a] hover:bg-[#233a4e] border border-sky-900 text-sky-300 transition-colors"
                >
                  {language === 'hi' ? 'रिपोर्ट देखें' : 'Report'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
