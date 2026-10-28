import React from 'react';
import { X, AlertTriangle, BarChart3, ShieldCheck, Check, Info, UserCheck } from 'lucide-react';
import { Language } from '../types';

interface AccuracyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AccuracyDrawer: React.FC<AccuracyDrawerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1a14] border-l border-[#244232] shadow-2xl p-6 overflow-y-auto text-[#f0fdf4]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1e3328]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#1b3124] text-[#e2be82]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-lg text-[#f0fdf4]">
                  {language === 'hi' ? 'सटीकता और इंसान की जरूरत' : 'Why Human Check is Essential'}
                </h3>
                <p className="text-xs text-[#869e90]">
                  {language === 'hi'
                    ? 'कंप्यूटर से गलतियां क्यों हो सकती हैं और इंसान क्यों जरूरी है'
                    : 'Why sensors need humans and how we prevent false alarms'}
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

          {/* Simple Principle Card */}
          <div className="my-5 p-4 rounded-xl bg-[#1b1c12] border border-[#50411a] text-xs leading-relaxed text-[#e2be82] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#e2be82]" />
              {language === 'hi' ? 'कंप्यूटर सिर्फ सूचना देता है — फैसला इंसान का:' : 'Computers only prompt — Humans make decisions:'}
            </div>
            <p className="text-[11px] text-[#fef3c7]">
              {language === 'hi'
                ? 'जंगल बहुत बड़ा होता है। तेज आंधी, खेतों के ट्रैक्टर या पहाड़ों में गूंजती आवाजें कभी-कभी आरे जैसी लग सकती हैं। इसीलिए बिना किसी इंसान के देखे कोई कानूनी कदम नहीं उठाया जाता।'
                : 'Nature is full of sounds. Desert winds, farm tractors, and distant echoes can mimic saws. GreenGuard never blames anyone automatically; an alert is just a friendly tap on the ranger’s shoulder.'}
            </p>
          </div>

          {/* Real-World Sounds in the Aravallis */}
          <div className="space-y-4 text-xs">
            <h4 className="font-semibold text-sm text-[#c9d99f] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'जंगल में क्या-क्या गलत संकेत हो सकते हैं:' : 'Common Sounds That Can Fool Sensors:'}
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#14231b] border border-[#1e382b]">
                <div className="font-semibold text-white">
                  {language === 'hi' ? '1. पहाड़ों में तेज आंधी और हवा की सनसनाहट' : '1. High Ridge Desert Winds'}
                </div>
                <p className="text-[#a3b8aa] mt-1 text-[11px]">
                  {language === 'hi'
                    ? 'अरावली की चोटी पर तेज हवाएं माइक्रोफोन पर दबाव डालती हैं।'
                    : 'Gale-force winds howling over ridge peaks can make low buzzing frequencies.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#14231b] border border-[#1e382b]">
                <div className="font-semibold text-white">
                  {language === 'hi' ? '2. खेतों में चलने वाले ट्रैक्टर और पानी के पंप' : '2. Farm Tractors & Diesel Pumps'}
                </div>
                <p className="text-[#a3b8aa] mt-1 text-[11px]">
                  {language === 'hi'
                    ? 'खेतों में काम कर रहे डीजल ट्रैक्टर की आवाज आरे जैसी लग सकती है। इंसान जाकर तुरंत साफ कर देता है।'
                    : 'Farmers ploughing fields outside forest boundaries share engine sounds. A human guard easily tells the difference.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#14231b] border border-[#1e382b]">
                <div className="font-semibold text-white">
                  {language === 'hi' ? '3. दूर खनन या सड़क निर्माण की गूंज' : '3. Distant Roadwork or Quarry Echoes'}
                </div>
                <p className="text-[#a3b8aa] mt-1 text-[11px]">
                  {language === 'hi'
                    ? 'दूर किसी पत्थर खदान की आवाज चट्टानों से टकराकर कुल्हाड़ी जैसी लग सकती है।'
                    : 'Distant drilling echoes can travel across rock shelves.'}
                </p>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="p-3.5 rounded-lg bg-[#11241a] border border-[#234533] mt-4">
              <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                <Check className="w-4 h-4 text-emerald-400" />
                {language === 'hi' ? 'पूर्ण गोपनीयता की गारंटी' : 'Complete Privacy Guarantee'}
              </div>
              <p className="text-[#a3b8aa] text-[11px] leading-relaxed">
                {language === 'hi'
                  ? 'यह सिस्टम इंसानों की बातें कभी रिकॉर्ड नहीं करता। आवाज का विश्लेषण उसी समय फोन या कंप्यूटर में होता है और तुरंत मिट जाता है।'
                  : 'GreenGuard never saves people’s voices or ambient conversations. Sound is analyzed in active memory and disappears instantly.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e3328]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#223d2e] hover:bg-[#2d4f3b] text-[#f0fdf4] font-medium text-xs transition-colors"
            >
              {language === 'hi' ? 'समझ गया' : 'Close & Return'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
