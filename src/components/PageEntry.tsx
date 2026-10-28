import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Wind, Droplets, PawPrint, Mountain, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface PageEntryProps {
  language: Language;
  onNext: () => void;
  onSkipToConsole: () => void;
}

export const PageEntry: React.FC<PageEntryProps> = ({
  language,
  onNext,
  onSkipToConsole,
}) => {
  const t = translations[language];

  const benefits = [
    {
      icon: Wind,
      title: t.benefit1Title,
      desc: t.benefit1Desc,
      tag: language === 'hi' ? 'जलवायु सुरक्षा' : 'Climate Buffer',
    },
    {
      icon: Droplets,
      title: t.benefit2Title,
      desc: t.benefit2Desc,
      tag: language === 'hi' ? 'जल संरक्षण' : 'Groundwater',
    },
    {
      icon: PawPrint,
      title: t.benefit3Title,
      desc: t.benefit3Desc,
      tag: language === 'hi' ? 'वन्यजीव गलियारा' : 'Corridors',
    },
    {
      icon: Mountain,
      title: t.benefit4Title,
      desc: t.benefit4Desc,
      tag: language === 'hi' ? 'मरुस्थल नियंत्रण' : 'Anti-Desertification',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between overflow-hidden bg-[#101b15]">
      {/* Background Cinematic Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage:
            'url("https://upload.wikimedia.org/wikipedia/commons/f/f5/A_view_of_Udaipur_Aravalli_Hills_Rajasthan_India.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101b15] via-[#101b15]/80 to-[#101b15]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-6 flex-1 flex flex-col justify-center">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#182c20]/80 border border-[#2f553f] text-[#c9d99f] text-xs font-mono-code mb-6 backdrop-blur-md self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e2be82]"></span>
          <span>{t.heroKicker}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#f0fdf4] leading-[1.1] max-w-4xl drop-shadow-sm">
          {language === 'hi' ? (
            <>
              जब पहाड़ सुने जाते हैं,<br />
              <span className="italic text-[#c9d99f]">तभी जीवन का भविष्य है।</span>
            </>
          ) : (
            <>
              When the hills are heard,<br />
              <span className="italic text-[#c9d99f]">life has a future.</span>
            </>
          )}
        </h1>

        {/* Tagline & Cautious subtext */}
        <div className="mt-6 max-w-2xl">
          <p className="text-xl sm:text-2xl text-[#e2be82] font-medium tracking-wide">
            {t.tagline}
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#a3b8aa] leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        {/* 4 Animated Benefit Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 rounded-2xl bg-[#14231b]/80 border border-[#234231] hover:border-[#3d6e50] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e382b] text-[#c9d99f] flex items-center justify-center border border-[#325a43] group-hover:bg-[#254636] group-hover:text-[#e2be82] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-[#1b2d22] text-[#869e90] border border-[#2b4c39]">
                      {b.tag}
                    </span>
                  </div>
                  <h2 className="font-semibold text-base text-white group-hover:text-[#c9d99f] transition-colors">
                    {b.title}
                  </h2>
                  <p className="mt-2 text-xs text-[#9bb3a4] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1c3326] text-[10px] font-mono-code text-[#6b8575] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e2be82]" />
                  <span>{language === 'hi' ? 'पारिस्थितिक सुरक्षा' : 'Ecological buffer'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onNext}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#2a5639] via-[#356d49] to-[#254d33] hover:from-[#356d49] hover:to-[#2e5d3e] text-[#f0fdf4] font-semibold text-base shadow-xl shadow-emerald-950/40 border border-[#4d8664] flex items-center gap-3 transition-all hover:gap-4 hover:shadow-emerald-900/50 group"
          >
            <span>{t.startJourney}</span>
            <ArrowRight className="w-5 h-5 text-[#e2be82] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSkipToConsole}
            className="px-5 py-4 rounded-xl bg-[#132219]/90 hover:bg-[#1a2f23] border border-[#244232] text-xs font-mono-code text-[#a3b8aa] hover:text-[#c9d99f] transition-colors flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#e2be82]" />
            <span>{language === 'hi' ? 'सीधे वन निगरानी कंसोल पर जाएं ↗' : 'Skip directly to Forest Watch Console ↗'}</span>
          </button>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="relative z-10 border-t border-[#1a2d21] bg-[#0c1510]/80 px-6 py-3 text-xs text-[#6e8577] flex flex-wrap items-center justify-between gap-2 max-w-6xl mx-auto w-full font-mono-code text-[11px]">
        <span>ARAVALLI UDAIPUR FOOTHILLS · 24.58°N, 73.68°E</span>
        <span>CREDITED ARCHIVE: TESHTESH (CC BY-SA 4.0)</span>
      </div>
    </div>
  );
};
