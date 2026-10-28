import React, { useEffect, useState } from 'react';
import { Language, WeatherData } from '../types';
import { translations } from '../translations';
import {
  ShieldAlert,
  CloudSun,
  Clock,
  Send,
  HelpCircle,
  Network,
  RotateCcw,
  Play,
  Volume2,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  weather: WeatherData | null;
  outboxCount: number;
  onOpenOutbox: () => void;
  onOpenAccuracy: () => void;
  onOpenArchitecture: () => void;
  onRunDemoStory: () => void;
  onResetDemo: () => void;
  isStoryRunning: boolean;
  currentPage: 'entry' | 'why' | 'console';
  setCurrentPage: (page: 'entry' | 'why' | 'console') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  weather,
  outboxCount,
  onOpenOutbox,
  onOpenAccuracy,
  onOpenArchitecture,
  onRunDemoStory,
  onResetDemo,
  isStoryRunning,
  currentPage,
  setCurrentPage,
}) => {
  const t = translations[language];
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(now.toLocaleTimeString('en-IN', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e3328] bg-[#0c1510]/95 backdrop-blur-md px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('entry')}
            className="flex items-center gap-2.5 text-left group transition-all"
            title="Return to GreenGuard welcome page"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2f553f] to-[#16271c] border border-[#3e684f] flex items-center justify-center text-[#e2be82] shadow-inner group-hover:border-[#c9d99f] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 48 48">
                <path d="M37.5 10.5C26 10.7 17 14 13.3 22c-2.8 6 0 11.8 5.2 12.5C29 36 35.7 25.4 37.5 10.5Z" />
                <path d="M9.6 38.8C16.2 29.2 23.4 22 34 16.3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-title font-bold text-lg tracking-wide text-[#f0fdf4]">
                  green<span className="text-[#c9d99f]">guard</span>
                </span>
                <span className="text-[10px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-[#1f372a] text-[#e2be82] border border-[#2b4c39]">
                  {language === 'hi' ? 'अरावली' : 'Aravalli'}
                </span>
              </div>
              <p className="text-[11px] text-[#869e90] tracking-wider uppercase font-medium">
                {t.brandSub}
              </p>
            </div>
          </button>

          {/* Quick Page Nav if not on entry */}
          <div className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-[#1e3328]">
            <button
              onClick={() => setCurrentPage('entry')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentPage === 'entry' ? 'bg-[#1e3328] text-[#c9d99f]' : 'text-[#869e90] hover:text-[#f0fdf4]'
              }`}
            >
              {language === 'hi' ? '01 परिचय' : '01 Arrive'}
            </button>
            <button
              onClick={() => setCurrentPage('why')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentPage === 'why' ? 'bg-[#1e3328] text-[#c9d99f]' : 'text-[#869e90] hover:text-[#f0fdf4]'
              }`}
            >
              {language === 'hi' ? '02 वन महत्व' : '02 Why Forests'}
            </button>
            <button
              onClick={() => setCurrentPage('console')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentPage === 'console' ? 'bg-[#1e3328] text-[#c9d99f]' : 'text-[#869e90] hover:text-[#f0fdf4]'
              }`}
            >
              {language === 'hi' ? '03 वन निगरानी' : '03 Forest Watch'}
            </button>
          </div>
        </div>

        {/* Center: Demo Data Mode & Live Weather Context */}
        <div className="flex items-center gap-3">
          {/* Honest Demo Mode Pill */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b1c13] border border-[#554620] text-[#e2be82] text-xs font-mono-code shadow-sm"
            title={t.demoModeBanner}
          >
            <span className="w-2 h-2 rounded-full bg-[#e2be82] animate-pulse"></span>
            <span className="font-semibold tracking-wider text-[11px]">
              {t.demoModeBadge}
            </span>
          </div>

          {/* Regional Weather Widget (Real Open-Meteo) */}
          {weather && (
            <div
              className="hidden md:flex items-center gap-3 px-3 py-1 rounded-full bg-[#122219] border border-[#1e382b] text-xs text-[#a3b8aa]"
              title={t.weatherDisclaimer}
            >
              <div className="flex items-center gap-1.5 text-[#c9d99f]">
                <Thermometer className="w-3.5 h-3.5 text-[#e2be82]" />
                <span className="font-semibold text-white">{weather.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1 text-[#869e90]">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1 text-[#869e90]">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>{weather.windSpeed} km/h</span>
              </div>
              <span className="text-[10px] text-[#5e7768] font-mono-code pl-1 border-l border-[#1e382b]">
                Udaipur
              </span>
            </div>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* 60s Demo Pitch Story Button */}
          <button
            onClick={onRunDemoStory}
            disabled={isStoryRunning}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all ${
              isStoryRunning
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 animate-pulse'
                : 'bg-gradient-to-r from-[#295438] to-[#1c3a27] hover:from-[#356a48] hover:to-[#244b32] text-[#f0fdf4] border border-[#3f7351]'
            }`}
            title="Auto-plays the hackathon pitch: acoustic trigger → Level 1 alert → timeout escalation → repeat detection → Level 3 → officer ack → GenAI report"
          >
            <Play className={`w-3.5 h-3.5 text-[#e2be82] ${isStoryRunning ? 'animate-spin' : ''}`} />
            <span>{isStoryRunning ? (language === 'hi' ? 'कहानी प्रगति पर...' : 'Story Running...') : t.runDemoStory}</span>
          </button>

          {/* Architecture Modal Button */}
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 rounded-lg bg-[#14231b] border border-[#223c2e] hover:border-[#375f49] text-[#869e90] hover:text-[#c9d99f] transition-colors"
            title="System Architecture & Threat Model"
          >
            <Network className="w-4 h-4" />
          </button>

          {/* Accuracy & Metrics Drawer */}
          <button
            onClick={onOpenAccuracy}
            className="p-1.5 rounded-lg bg-[#14231b] border border-[#223c2e] hover:border-[#375f49] text-[#869e90] hover:text-[#c9d99f] transition-colors"
            title="How accurate is this? False positive mitigation and evaluation metrics"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Demo Outbox Modal */}
          <button
            onClick={onOpenOutbox}
            className="relative p-1.5 rounded-lg bg-[#14231b] border border-[#223c2e] hover:border-[#375f49] text-[#869e90] hover:text-[#c9d99f] transition-colors"
            title="View Simulated Dispatch Outbox"
          >
            <Send className="w-4 h-4" />
            {outboxCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[#0c1510] text-[10px] font-bold flex items-center justify-center">
                {outboxCount}
              </span>
            )}
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="p-1.5 rounded-lg bg-[#14231b] border border-[#223c2e] hover:border-[#375f49] text-[#869e90] hover:text-[#c9d99f] transition-colors"
            title="Reset All Demonstration Cases"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-[#122219] p-0.5 border border-[#223c2e] text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-[#254233] text-[#c9d99f] shadow'
                  : 'text-[#869e90] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-[#254233] text-[#c9d99f] shadow'
                  : 'text-[#869e90] hover:text-white'
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
