import React, { useState, useEffect } from 'react';
import { Language, EscalationCase } from '../types';
import { translations } from '../translations';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileText,
  Repeat,
  Radio,
  FileSpreadsheet,
  HelpCircle,
  XCircle,
} from 'lucide-react';

interface EscalationPanelProps {
  language: Language;
  cases: EscalationCase[];
  onAcknowledge: (caseId: string, officerName: string, resolutionStatus: 'Verified' | 'Dismissed', notes: string) => void;
  onGenerateReport: (caseId: string) => void;
  onRepeatDetection: (caseItem: EscalationCase) => void;
  onViewCaseDetails?: (caseItem: EscalationCase) => void;
}

export const EscalationPanel: React.FC<EscalationPanelProps> = ({
  language,
  cases,
  onAcknowledge,
  onGenerateReport,
  onRepeatDetection,
}) => {
  const t = translations[language];
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [ackModalCase, setAckModalCase] = useState<EscalationCase | null>(null);
  const [officerName, setOfficerName] = useState('Vikram Singh Rathore (Duty Ranger)');
  const [officerNotes, setOfficerNotes] = useState('Visited sector coordinates. Checked trees and verified the area.');
  const [ackResolution, setAckResolution] = useState<'Verified' | 'Dismissed'>('Verified');
  const [nowTime, setNowTime] = useState(Date.now());

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCaseId((prev) => (prev === id ? null : id));
  };

  const openAckDialog = (c: EscalationCase) => {
    setAckModalCase(c);
  };

  const confirmAck = () => {
    if (!ackModalCase) return;
    onAcknowledge(ackModalCase.id, officerName, ackResolution, officerNotes);
    setAckModalCase(null);
  };

  // Export CSV of entire audit trail
  const handleExportCSV = () => {
    const headers = ['CaseID', 'Title', 'Category', 'Level', 'Status', 'Timestamp', 'Actor', 'Action', 'Detail'];
    const rows: string[] = [];

    cases.forEach((c) => {
      c.auditTrail.forEach((entry) => {
        const row = [
          c.id,
          `"${c.title.replace(/"/g, '""')}"`,
          c.category,
          c.level,
          c.status,
          entry.timestamp,
          `"${entry.actor.replace(/"/g, '""')}"`,
          entry.action,
          `"${entry.detail.replace(/"/g, '""')}"`,
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `greenguard_audit_trail_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header & CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-amber-400 border border-[#2e543d] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'अलर्ट एवं अफसरों को सूचना प्रणाली' : 'Team Alerts & Supervisory Reminders'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {language === 'hi' ? 'सक्रिय प्रणाली' : 'ACTIVE PIPELINE'}
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'अगर गश्ती दल तय समय में जवाब नहीं देता, तो अलर्ट खुद बड़े अधिकारी को जाता है ताकि कोई पेड़ उपेक्षित न रहे।'
                : 'If local patrol is busy or cannot answer in time, the system automatically reminds their supervisor.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-[#172c21] hover:bg-[#203c2d] border border-[#2c4e3a] text-xs font-semibold text-[#c9d99f] flex items-center gap-2 transition-all hover:border-[#3d6f51]"
          title="Download the full list of actions and timestamps"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>{t.exportAuditCSV}</span>
        </button>
      </div>

      {/* Escalation Tier Description Pills - In plain language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-[#0c1611] border border-blue-900/40 space-y-1">
          <div className="text-blue-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            {t.level1Name}
          </div>
          <div className="text-[#869e90] text-[11px] leading-relaxed">{t.level1Desc}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c1611] border border-amber-900/40 space-y-1">
          <div className="text-amber-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            {t.level2Name}
          </div>
          <div className="text-[#869e90] text-[11px] leading-relaxed">{t.level2Desc}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c1611] border border-red-900/40 space-y-1">
          <div className="text-red-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            {t.level3Name}
          </div>
          <div className="text-[#869e90] text-[11px] leading-relaxed">{t.level3Desc}</div>
        </div>
      </div>

      {/* Escalation Case Cards */}
      <div className="space-y-4">
        {cases.map((c) => {
          const isPending = c.status === 'Pending review';
          const deadlineMs = new Date(c.deadlineAt).getTime();
          const remainingSec = Math.max(0, Math.round((deadlineMs - nowTime) / 1000));
          const totalWindow = c.replyWindowSeconds || 60;
          const progressPercent = isPending
            ? Math.max(0, Math.min(100, (remainingSec / totalWindow) * 100))
            : 0;

          const levelBadgeColor =
            c.level === 3 ? 'text-red-400 border-red-800 bg-red-950/40' :
            c.level === 2 ? 'text-amber-400 border-amber-800 bg-amber-950/40' :
            'text-blue-400 border-blue-800 bg-blue-950/40';

          const isExpanded = expandedCaseId === c.id;

          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 transition-all space-y-4 ${
                c.status === 'Referred for departmental / legal review'
                  ? 'bg-[#181315] border-red-900/70 shadow-lg shadow-red-950/30'
                  : isPending
                  ? 'bg-[#0f1c15] border-[#254634] hover:border-[#38674c]'
                  : 'bg-[#0c1611] border-[#1b2f23] opacity-90'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-code text-xs px-2 py-0.5 rounded bg-[#162a1f] text-[#c9d99f] border border-[#2b4c39]">
                      {c.id.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${levelBadgeColor}`}>
                      {language === 'hi' ? `स्तर ${c.level}` : `Level ${c.level}`} ·{' '}
                      {c.level === 1
                        ? (language === 'hi' ? 'स्थानीय बीट गार्ड को भेजा गया' : 'With Local Patrol')
                        : c.level === 2
                        ? (language === 'hi' ? 'रेंज अधिकारी को याद दिलाया' : 'Reminded Supervisor')
                        : (language === 'hi' ? 'उच्च मुख्यालय को भेजा गया' : 'With Head Office')}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono-code font-bold ${
                        c.status === 'Verified'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : c.status === 'Dismissed'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : c.status === 'Referred for departmental / legal review'
                          ? 'bg-purple-950 text-purple-300 border border-purple-700'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {c.status === 'Pending review'
                        ? (language === 'hi' ? 'मानवीय जांच की प्रतीक्षा' : 'Awaiting Human Inspection')
                        : c.status === 'Verified'
                        ? (language === 'hi' ? 'पुष्टि हो चुकी है' : 'Verified on Ground')
                        : c.status === 'Dismissed'
                        ? (language === 'hi' ? 'गलत संकेत (खारिज)' : 'Dismissed / False Alarm')
                        : (language === 'hi' ? 'विभागीय समीक्षा को भेजा गया' : 'Referred for Legal Review')}
                    </span>
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-white">
                    {c.title}
                  </h4>
                  <div className="text-xs text-[#869e90] flex flex-wrap items-center gap-3">
                    <span>Source: <strong className="text-white">{c.deviceId}</strong></span>
                    <span>Location: {c.latitude.toFixed(4)}°N, {c.longitude.toFixed(4)}°E</span>
                    <span>Likelihood: {(c.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Clear Human Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Primary Action: Human Acknowledgment */}
                  {isPending && (
                    <button
                      onClick={() => openAckDialog(c)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-200" />
                      <span>{language === 'hi' ? 'मैंने मौके पर देखा (कार्रवाई करें)' : 'I Checked This (Submit Decision)'}</span>
                    </button>
                  )}

                  {/* Simulate Repeat Detection */}
                  {isPending && (
                    <button
                      onClick={() => onRepeatDetection(c)}
                      className="px-2.5 py-2 rounded-xl bg-[#221c15] hover:bg-[#342a1f] border border-amber-900/60 text-xs font-mono-code text-amber-300 flex items-center gap-1.5 transition-colors"
                      title="Test: If the sensor hears the sound again, the system immediately jumps to the next level."
                    >
                      <Repeat className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'hi' ? 'दोबारा आवाज सुनकर देखें' : 'Test Repeat Sound'}</span>
                    </button>
                  )}

                  {/* Generate AI Summary Report */}
                  <button
                    onClick={() => onGenerateReport(c.id)}
                    className="px-3 py-2 rounded-xl bg-[#1b3425] hover:bg-[#274c36] border border-[#2f553f] text-xs font-semibold text-[#c9d99f] flex items-center gap-1.5 transition-colors"
                    title="Creates an easy summary report in English and Hindi"
                  >
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>{language === 'hi' ? 'आसान रिपोर्ट' : 'Summary Report'}</span>
                  </button>
                </div>
              </div>

              {/* 3-Step Human Escalation Ladder with Countdown */}
              <div className="p-3.5 rounded-xl bg-[#0a140f] border border-[#1b3325] space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <span className="text-[#869e90]">
                    {language === 'hi' ? 'अलर्ट की वर्तमान स्थिति:' : 'Who is responsible right now:'}
                  </span>
                  {isPending && (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {language === 'hi'
                        ? `अगले स्तर को याद दिलाने में: ${remainingSec} सेकंड`
                        : `Reminds supervisor in: ${remainingSec}s`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                  {/* Step 1 */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      c.level >= 1
                        ? 'bg-blue-950/60 border-blue-500/70 text-blue-200 font-bold'
                        : 'bg-[#0f1c15] border-[#1d3527] text-[#556d5f]'
                    }`}
                  >
                    <div className="text-[10px] text-blue-400 uppercase font-mono-code">Step 1</div>
                    <div>{language === 'hi' ? 'बीट गार्ड को संदेश' : '1. Local Patrol Alerted'}</div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      c.level >= 2
                        ? 'bg-amber-950/60 border-amber-500/70 text-amber-200 font-bold'
                        : 'bg-[#0f1c15] border-[#1d3527] text-[#556d5f]'
                    }`}
                  >
                    <div className="text-[10px] text-amber-400 uppercase font-mono-code">Step 2</div>
                    <div>{language === 'hi' ? 'रेंजर / डीएफओ को याद दिलाया' : '2. Supervisor Reminded'}</div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      c.level >= 3
                        ? 'bg-red-950/60 border-red-500/70 text-red-200 font-bold'
                        : 'bg-[#0f1c15] border-[#1d3527] text-[#556d5f]'
                    }`}
                  >
                    <div className="text-[10px] text-red-400 uppercase font-mono-code">Step 3</div>
                    <div>{language === 'hi' ? 'मुख्यालय / विधिक शाखा' : '3. Head Office Review'}</div>
                  </div>
                </div>

                {/* Progress countdown bar */}
                {isPending && (
                  <div className="w-full h-1.5 rounded-full bg-[#14231b] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        remainingSec < 15 ? 'bg-red-500' : remainingSec < 30 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Acknowledged info if resolved */}
              {c.acknowledgedBy && (
                <div className="p-3.5 rounded-xl bg-[#0f2318] border border-[#234533] text-xs text-[#a3b8aa] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {language === 'hi' ? 'जांच अधिकारी:' : 'Inspected by:'}{' '}
                      <strong className="text-white">{c.acknowledgedBy}</strong>{' '}
                      ({new Date(c.acknowledgedAt || '').toLocaleTimeString()})
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {language === 'hi' ? 'इंसानी फैसला दर्ज किया गया' : 'Human Decision Recorded'}
                  </span>
                </div>
              )}

              {/* Expandable Audit Trail Toggle */}
              <div className="pt-1">
                <button
                  onClick={() => toggleExpand(c.id)}
                  className="w-full py-2 px-3 rounded-lg bg-[#0c1611] hover:bg-[#132219] border border-[#1b3123] text-xs font-mono-code text-[#869e90] hover:text-[#c9d99f] flex items-center justify-between transition-colors"
                >
                  <span>
                    {language === 'hi'
                      ? `समयवार इतिहास देखें (${c.auditTrail.length} कदम दर्ज)`
                      : `View Timeline History (${c.auditTrail.length} events logged)`}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Expandable Trail Body */}
                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-[#080f0b] border border-[#182c20] space-y-2 text-xs font-mono-code animate-fadeIn">
                    {c.auditTrail.map((entry, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#0e1a14] border border-[#1b3425] space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="text-[#e2be82] font-bold">
                            [{entry.action}]
                          </span>
                          <span className="text-[#6d8a79]">
                            {new Date(entry.timestamp).toLocaleTimeString()} IST · {entry.actor}
                          </span>
                        </div>
                        <p className="text-[#c1d3c7] text-[11px] leading-relaxed">
                          {entry.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Human Decision Modal Dialog (Crystal-clear, easy submission) */}
      {ackModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#101b15] border border-[#2b4c39] p-6 shadow-2xl space-y-5 text-[#f0fdf4]">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1e3328]">
              <div className="p-2.5 rounded-xl bg-[#183123] text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-lg text-white">
                  {language === 'hi' ? 'अपनी स्थलीय जांच का फैसला दर्ज करें' : 'Record Your Ground Inspection Decision'}
                </h4>
                <p className="text-xs text-[#869e90]">
                  {language === 'hi'
                    ? `मामला: ${ackModalCase.id.toUpperCase()} · आपकी रिपोर्ट अंतिम निर्णय तय करेगी`
                    : `Case Ref: ${ackModalCase.id.toUpperCase()} · You have the final say`}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Officer name */}
              <div>
                <label className="block text-[#a3b8aa] mb-1 font-semibold">
                  {language === 'hi' ? 'जांच करने वाले का नाम:' : 'Your Name / Designation:'}
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b140f] border border-[#223d2e] text-white focus:outline-none focus:border-[#c9d99f]"
                  placeholder="e.g. Vikram Singh Rathore (Duty Ranger)"
                />
              </div>

              {/* Big, friendly Decision Selector */}
              <div>
                <label className="block text-[#a3b8aa] mb-2 font-semibold">
                  {language === 'hi' ? 'आपने मौके पर क्या देखा?' : 'What did you find on the ground?'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAckResolution('Verified')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      ackResolution === 'Verified'
                        ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                        : 'bg-[#0c1611] border-[#1e382b] text-[#869e90] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'hi' ? 'पेड़ कटने की पुष्टि हुई' : 'Confirmed Tree Cut'}</span>
                    </div>
                    <p className="text-[11px] text-[#9db7a7]">
                      {language === 'hi'
                        ? 'सचमुच पेड़ काटने या नुकसान की गतिविधि मिली।'
                        : 'Real unauthorized felling or activity was found.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAckResolution('Dismissed')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      ackResolution === 'Dismissed'
                        ? 'bg-zinc-800 border-zinc-400 text-white shadow-lg'
                        : 'bg-[#0c1611] border-[#1e382b] text-[#869e90] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-zinc-300 mb-1">
                      <XCircle className="w-4 h-4" />
                      <span>{language === 'hi' ? 'गलत संकेत (सुरक्षित)' : 'False Alarm (Safe)'}</span>
                    </div>
                    <p className="text-[11px] text-[#9db7a7]">
                      {language === 'hi'
                        ? 'सिर्फ ट्रैक्टर या हवा की आवाज थी — पेड़ सुरक्षित हैं।'
                        : 'Normal tractor or weather noise — trees are safe.'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[#a3b8aa] mb-1 font-semibold">
                  {language === 'hi' ? 'संक्षिप्त विवरण (नोट्स):' : 'Brief Inspection Notes:'}
                </label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b140f] border border-[#223d2e] text-white focus:outline-none focus:border-[#c9d99f]"
                  placeholder="e.g. Inspected sector 4. Team found agricultural tractor clearing dry brush outside boundary."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e3328] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAckModalCase(null)}
                className="px-4 py-2 rounded-lg bg-[#14231b] hover:bg-[#1a2d23] text-xs text-[#869e90]"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmAck}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all"
              >
                {language === 'hi' ? 'फैसला सुरक्षित करें' : 'Save & Submit Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
