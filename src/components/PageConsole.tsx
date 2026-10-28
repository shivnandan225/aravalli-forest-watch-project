import React, { useState } from 'react';
import { Language, EscalationCase, NotificationPayload } from '../types';
import { translations } from '../translations';
import { MapPanel } from './MapPanel';
import { AcousticPanel } from './AcousticPanel';
import { CameraPanel } from './CameraPanel';
import { SatellitePanel } from './SatellitePanel';
import { EscalationPanel } from './EscalationPanel';
import { ReviewQueuePanel } from './ReviewQueuePanel';
import { CommunityFormPanel } from './CommunityFormPanel';
import { StatsPanel } from './StatsPanel';
import { StoryStep } from '../demo/storyRunner';
import {
  MapPin,
  Volume2,
  Camera,
  Satellite,
  ShieldAlert,
  CheckSquare,
  FileEdit,
  TrendingUp,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowLeft,
  Info,
  UserCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PageConsoleProps {
  language: Language;
  cases: EscalationCase[];
  onTriggerAlert: (alertData: any) => Promise<string | void>;
  onAcknowledge: (caseId: string, officerName: string, resolutionStatus: 'Verified' | 'Dismissed', notes: string) => void;
  onUpdateStatus: (caseId: string, status: any) => void;
  onGenerateReport: (caseId: string) => void;
  onRepeatDetection: (caseItem: EscalationCase) => void;
  activeStoryStep: StoryStep | null;
  onRunDemoStory: () => void;
  isStoryRunning: boolean;
  onBackToEntry: () => void;
  onBackToWhy: () => void;
}

type ConsoleTab =
  | 'all'
  | 'map'
  | 'acoustic'
  | 'camera'
  | 'satellite'
  | 'escalations'
  | 'review'
  | 'community'
  | 'stats';

export const PageConsole: React.FC<PageConsoleProps> = ({
  language,
  cases,
  onTriggerAlert,
  onAcknowledge,
  onUpdateStatus,
  onGenerateReport,
  onRepeatDetection,
  activeStoryStep,
  onRunDemoStory,
  isStoryRunning,
  onBackToEntry,
  onBackToWhy,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<ConsoleTab>('all');
  const [selectedMapCoords, setSelectedMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  const pendingCount = cases.filter((c) => c.status === 'Pending review').length;

  const handleSelectCaseFromMap = (caseItem: EscalationCase) => {
    setActiveTab('escalations');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedMapCoords({ lat, lng });
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col md:flex-row bg-[#0d1611] text-[#f0fdf4]">
      {/* Left Rail Navigation */}
      <aside className="w-full md:w-64 border-r border-[#1e3328] bg-[#09110d] p-4 flex flex-col justify-between shrink-0 space-y-4">
        <div className="space-y-4">
          {/* Location Focus Box */}
          <div className="p-3.5 rounded-xl bg-[#111e17] border border-[#1f372a] space-y-1">
            <span className="text-[10px] font-mono-code text-[#6f8d7c] uppercase tracking-wider block">
              {language === 'hi' ? 'निगरानी का क्षेत्र' : 'WATCH REGION'}
            </span>
            <div className="font-serif-title font-bold text-sm text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#e2be82]" />
              Aravalli Sector 4
            </div>
            <div className="text-[11px] font-mono-code text-[#869e90]">
              Udaipur, Rajasthan · 24.58°N, 73.68°E
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 text-xs font-mono-code">
            <span className="text-[10px] uppercase text-[#5a7465] px-2 block pt-1 font-bold">
              {language === 'hi' ? 'कंसोल सेक्शन' : 'CONSOLE PANELS'}
            </span>

            <button
              onClick={() => setActiveTab('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#c9d99f]" />
                <span>{language === 'hi' ? 'सभी सेक्शन एक साथ' : 'All Sections'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'map'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{t.navMap}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('acoustic')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'acoustic'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#e2be82]" />
                <span>{t.navAcoustic}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'camera'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-sky-400" />
                <span>{t.navCamera}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('satellite')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'satellite'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Satellite className="w-4 h-4 text-teal-400" />
                <span>{t.navSatellite}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('escalations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'escalations'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{t.navEscalations}</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  {pendingCount} {language === 'hi' ? 'अलर्ट' : 'active'}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'review'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <span>{t.navReview}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'community'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-[#e2be82]" />
                <span>{t.navCommunity}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-[#1b3425] text-[#c9d99f] font-bold shadow'
                  : 'text-[#869e90] hover:text-white hover:bg-[#122018]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{t.navStats}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Story Pitch Button & Return Navigation */}
        <div className="space-y-2 pt-3 border-t border-[#1e3328]">
          <button
            onClick={onRunDemoStory}
            disabled={isStoryRunning}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-700/80 to-amber-900/80 hover:from-amber-600 hover:to-amber-800 text-[#fef3c7] font-bold text-xs border border-amber-600/50 flex items-center justify-center gap-2 shadow transition-all"
          >
            <Play className={`w-3.5 h-3.5 text-amber-300 ${isStoryRunning ? 'animate-spin' : ''}`} />
            <span>{isStoryRunning ? (language === 'hi' ? 'कहानी चल रही है...' : 'Story in Progress...') : t.runDemoStory}</span>
          </button>

          <button
            onClick={onBackToWhy}
            className="w-full py-1.5 px-3 rounded-lg bg-[#0e1913] hover:bg-[#15251c] text-[#869e90] hover:text-[#c9d99f] text-[11px] font-mono-code flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'वन महत्व अध्याय' : 'Why Forests Matter'}</span>
          </button>
        </div>
      </aside>

      {/* Main Console Canvas */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {/* Active Demo Story Walkthrough Progress Banner */}
        {activeStoryStep && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#182315] to-[#122018] border-2 border-amber-500/80 shadow-2xl animate-pulse space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif-title font-bold text-sm text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e2be82] animate-spin" />
                {activeStoryStep.title}
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DEMO STORY ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#fef3c7]">
              {activeStoryStep.detail}
            </p>
          </div>
        )}

        {/* 5-Step Human Interruption Guide (Simple, Plain Language) */}
        <div className="rounded-2xl border border-[#2b4c39] bg-[#122119] p-4 shadow-xl transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowHowItWorks(!showHowItWorks)}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a3827] text-[#e2be82] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-sm text-white">
                  {t.howItWorksTitle}
                </h3>
                <p className="text-xs text-[#869e90]">
                  {t.howItWorksSub}
                </p>
              </div>
            </div>
            <button className="text-[#869e90] hover:text-white p-1">
              {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showHowItWorks && (
            <div className="mt-4 pt-4 border-t border-[#1d3829] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0c1611] border border-[#1b3425] space-y-1">
                <div className="font-bold text-[#c9d99f]">{t.step1}</div>
                <div className="text-[11px] text-[#869e90] leading-relaxed">{t.step1Desc}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0c1611] border border-[#1b3425] space-y-1">
                <div className="font-bold text-[#e2be82]">{t.step2}</div>
                <div className="text-[11px] text-[#869e90] leading-relaxed">{t.step2Desc}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0c1611] border border-[#1b3425] space-y-1">
                <div className="font-bold text-sky-400">{t.step3}</div>
                <div className="text-[11px] text-[#869e90] leading-relaxed">{t.step3Desc}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0c1611] border border-[#1b3425] space-y-1">
                <div className="font-bold text-amber-400">{t.step4}</div>
                <div className="text-[11px] text-[#869e90] leading-relaxed">{t.step4Desc}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0c1611] border border-[#1b3425] space-y-1">
                <div className="font-bold text-emerald-400">{t.step5}</div>
                <div className="text-[11px] text-[#869e90] leading-relaxed">{t.step5Desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Transparency Banner */}
        <div className="p-3.5 rounded-xl bg-[#111e17] border border-[#234231] text-xs text-[#a3b8aa] flex items-center gap-3">
          <Info className="w-4 h-4 text-[#c9d99f] shrink-0" />
          <span>
            <strong>{language === 'hi' ? 'सीधा और पारदर्शी:' : 'Honest by Design:'}</strong> {t.demoModeBanner}
          </span>
        </div>

        {/* Tabbed view or Full view based on activeTab */}
        {(activeTab === 'all' || activeTab === 'map') && (
          <section id="map-section" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title font-bold text-lg text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                {t.navMap}
              </h3>
              <span className="text-xs font-mono-code text-[#6f8d7c]">
                {language === 'hi'
                  ? 'नक्शे पर कहीं भी क्लिक करके अक्षांश/देशांतर चुनें'
                  : 'Click anywhere on the map to pin coordinates'}
              </span>
            </div>
            <MapPanel
              language={language}
              cases={cases}
              onSelectCase={handleSelectCaseFromMap}
              onMapClickCoordinates={handleMapClick}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'acoustic') && (
          <section id="acoustic-section">
            <AcousticPanel
              language={language}
              onTriggerAlert={onTriggerAlert}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'camera') && (
          <section id="camera-section">
            <CameraPanel
              language={language}
              onTriggerAlert={onTriggerAlert}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'satellite') && (
          <section id="satellite-section">
            <SatellitePanel
              language={language}
              onTriggerAlert={onTriggerAlert}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'escalations') && (
          <section id="escalation-section">
            <EscalationPanel
              language={language}
              cases={cases}
              onAcknowledge={onAcknowledge}
              onGenerateReport={onGenerateReport}
              onRepeatDetection={onRepeatDetection}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'review') && (
          <section id="review-section">
            <ReviewQueuePanel
              language={language}
              cases={cases}
              onUpdateStatus={onUpdateStatus}
              onOpenReport={onGenerateReport}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'community') && (
          <section id="community-section">
            <CommunityFormPanel
              language={language}
              selectedMapCoords={selectedMapCoords}
            />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'stats') && (
          <section id="stats-section">
            <StatsPanel
              language={language}
              cases={cases}
            />
          </section>
        )}
      </main>
    </div>
  );
};
