import React from 'react';
import { X, Send, Radio, Mail, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Language, NotificationPayload } from '../types';

interface DemoOutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  outbox: NotificationPayload[];
}

export const DemoOutboxModal: React.FC<DemoOutboxModalProps> = ({
  isOpen,
  onClose,
  language,
  outbox,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0f1a14] border border-[#274434] rounded-2xl shadow-2xl text-[#f0fdf4] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1e3328] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#192f23] text-amber-400 flex items-center justify-center border border-[#2b4d3a]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-bold text-lg text-white">
                  {language === 'hi' ? 'सिम्युलेटेड प्रेषण आउटबॉक्स' : 'Demonstration Dispatch Outbox'}
                </h3>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {outbox.length} {language === 'hi' ? 'संदेश' : 'dispatches'}
                </span>
              </div>
              <p className="text-xs text-[#869e90]">
                {language === 'hi'
                  ? 'पारदर्शी आउटबॉक्स: किसी भी वास्तविक अधिकारी को संदेश नहीं भेजा गया है।'
                  : 'Pluggable notifier interface: displays outbound alerts without contacting real government authorities.'}
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

        {/* Informational Banner */}
        <div className="px-5 py-3 bg-[#151f18] border-b border-[#1e3328] text-xs text-[#a3b8aa] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#e2be82] shrink-0" />
          <span>
            <strong>Demo Architecture:</strong> In a live deployment, this dispatch adapter routes to SMS gateways (CDAC/NIC), satellite/LoRa mesh relays, and government email endpoints.
          </span>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {outbox.length === 0 ? (
            <div className="text-center py-12 text-[#869e90] text-sm">
              No notifications dispatched yet. Trigger an alert or run the 60-second demo story to see the escalation pipeline in action.
            </div>
          ) : (
            outbox.map((msg, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#122219] border border-[#1e382b] hover:border-[#2f553f] transition-all space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                        msg.recipientLevel.includes('Level 1')
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          : msg.recipientLevel.includes('Level 2')
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : 'bg-red-950/60 text-red-300 border border-red-800/40'
                      }`}
                    >
                      {msg.recipientLevel}
                    </span>
                    <span className="flex items-center gap-1 text-[#869e90] font-mono-code text-[11px]">
                      {msg.channel === 'SMS' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                      {msg.channel === 'Email' && <Mail className="w-3 h-3 text-sky-400" />}
                      {msg.channel === 'Legal Channel' && <Radio className="w-3 h-3 text-purple-400" />}
                      {msg.channel} via Mock Adapter
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-code text-[#738e7f]">
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </span>
                </div>

                <div className="font-semibold text-white">{msg.subject}</div>
                <p className="text-[#c3d4c9] leading-relaxed bg-[#0b1610] p-2.5 rounded-lg border border-[#1a2f23] font-mono-code text-[11px]">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#738e7f] pt-1">
                  <span>To: {msg.recipientContact}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Queued in demo buffer
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e3328] bg-[#0c1611] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#213b2c] hover:bg-[#2d4f3b] text-white font-medium text-xs transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close Outbox'}
          </button>
        </div>
      </div>
    </div>
  );
};
