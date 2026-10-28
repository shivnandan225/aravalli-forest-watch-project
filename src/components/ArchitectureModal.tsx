import React from 'react';
import { X, Cpu, Radio, Shield, Users, Database, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#101b15] border border-[#2b4c39] rounded-2xl p-6 shadow-2xl text-[#f0fdf4]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e3328]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a3024] border border-[#2d523e] flex items-center justify-center text-[#e2be82]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#f0fdf4]">
                {language === 'hi' ? 'सिस्टम संरचना एवं डेटा प्रवाह' : 'GreenGuard System Architecture'}
              </h2>
              <p className="text-xs text-[#869e90]">
                {language === 'hi'
                  ? 'सेंसर से विधिक समीक्षा तक पारदर्शी तकनीकी खाका'
                  : 'End-to-End Pipeline: Sensors → On-Device AI → Escalations → Audit Record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#172820] text-[#869e90] hover:text-white hover:bg-[#20362b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <div className="my-6 p-4 rounded-xl bg-[#0b1410] border border-[#1e3328]">
          <div className="text-[11px] font-mono-code text-[#c9d99f] uppercase tracking-wider mb-4 text-center">
            {language === 'hi' ? 'डेटा प्रवाह अनुक्रम' : 'DETECT → VERIFY → ALERT → ESCALATE → RECORD PIPELINE'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center">
            {/* 1. Sensors */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <Radio className="w-5 h-5 text-[#c9d99f] mb-1" />
              <div className="text-xs font-bold">1. Sensors</div>
              <div className="text-[10px] text-[#869e90]">Acoustic, Optical & Satellite</div>
            </div>

            <div className="hidden md:flex justify-center text-[#e2be82] font-bold">→</div>

            {/* 2. On-Device AI */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <Cpu className="w-5 h-5 text-[#e2be82] mb-1" />
              <div className="text-xs font-bold">2. Edge Heuristic</div>
              <div className="text-[10px] text-[#869e90]">Web Audio FFT & Privacy Buffer</div>
            </div>

            <div className="hidden md:flex justify-center text-[#e2be82] font-bold">→</div>

            {/* 3. Alert API */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <Database className="w-5 h-5 text-teal-400 mb-1" />
              <div className="text-xs font-bold">3. Alert API</div>
              <div className="text-[10px] text-[#869e90]">POST /api/alerts (Pluggable)</div>
            </div>

            <div className="hidden md:flex justify-center text-[#e2be82] font-bold">→</div>

            {/* 4. Escalation Engine */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <Shield className="w-5 h-5 text-amber-400 mb-1" />
              <div className="text-xs font-bold">4. Escalation</div>
              <div className="text-[10px] text-[#869e90]">L1 (Beat) → L2 (DFO) → L3 (PCCF)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center mt-3 pt-3 border-t border-[#1e3328]">
            <div className="hidden md:block col-span-1"></div>

            {/* 5. Human Verification */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <Users className="w-5 h-5 text-sky-400 mb-1" />
              <div className="text-xs font-bold">5. Human Review</div>
              <div className="text-[10px] text-[#869e90]">Duty Officer Ground Verification</div>
            </div>

            <div className="hidden md:flex justify-center text-[#e2be82] font-bold">→</div>

            {/* 6. AI Report & Audit */}
            <div className="p-3 rounded-lg bg-[#13241b] border border-[#284836] flex flex-col items-center">
              <FileText className="w-5 h-5 text-purple-400 mb-1" />
              <div className="text-xs font-bold">6. Gen-AI Report</div>
              <div className="text-[10px] text-[#869e90]">Bilingual Factual Audit Record</div>
            </div>

            <div className="hidden md:block col-span-1"></div>
          </div>
        </div>

        {/* Detailed architectural pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#14231b] border border-[#223c2e]">
            <h3 className="font-semibold text-[#c9d99f] flex items-center gap-1.5 mb-2 text-sm">
              <Cpu className="w-4 h-4 text-[#e2be82]" />
              On-Device Edge Privacy
            </h3>
            <p className="text-[#a3b8aa] leading-relaxed mb-2">
              Continuous environmental sound is evaluated purely in client memory via Web Audio FFT. Audio is never recorded, stored, or sent to cloud servers by default.
            </p>
            <ul className="space-y-1 text-[#869e90]">
              <li>• Rule heuristic runs on zero-storage circular RAM buffer.</li>
              <li>• Explicit user click required to transmit 15s snippet to Gemini.</li>
              <li>• Human figures anonymized to &quot;a person is present&quot;.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#14231b] border border-[#223c2e]">
            <h3 className="font-semibold text-[#c9d99f] flex items-center gap-1.5 mb-2 text-sm">
              <Shield className="w-4 h-4 text-amber-400" />
              Multi-Tier Inaction Escalation
            </h3>
            <p className="text-[#a3b8aa] leading-relaxed mb-2">
              Alerts never languish in an unattended inbox. Configurable response windows (30s, 1m, 5m) automatically escalate unanswered cases to supervisory cells.
            </p>
            <ul className="space-y-1 text-[#869e90]">
              <li>• Level 1: Frontline Beat Watchers & Volunteers.</li>
              <li>• Level 2: Divisional Forest Officer (DFO).</li>
              <li>• Level 3: Higher Authority / State Legal Vigilance.</li>
              <li>• Repeat detection on same node triggers immediate escalation.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#14231b] border border-[#223c2e]">
            <h3 className="font-semibold text-[#c9d99f] flex items-center gap-1.5 mb-2 text-sm">
              <FileText className="w-4 h-4 text-emerald-400" />
              Tamper-Evident Audit Record
            </h3>
            <p className="text-[#a3b8aa] leading-relaxed mb-2">
              Every status transition, timeout escalation, officer acknowledgement, and ground note is chronologically timestamped into an immutable audit chain.
            </p>
            <ul className="space-y-1 text-[#869e90]">
              <li>• Generates neutral bilingual incident summaries.</li>
              <li>• One-click compliant CSV export for departmental scrutiny.</li>
              <li>• Mandatory notice: Potential activity detected — human verification required.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1e3328] flex items-center justify-between">
          <div className="text-[11px] text-[#869e90] font-mono-code">
            GreenGuard Protocol Specification v2.4 · Built for Aravalli Hackathon
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#254332] hover:bg-[#315741] text-[#f0fdf4] font-medium text-xs transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close Architecture'}
          </button>
        </div>
      </div>
    </div>
  );
};
