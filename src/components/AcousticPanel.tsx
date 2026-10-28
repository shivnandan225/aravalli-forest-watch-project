import React, { useEffect, useRef, useState } from 'react';
import { AcousticEngine, AcousticAnalysisFrame } from '../audio/acousticEngine';
import { Language, AcousticAnalysisResult } from '../types';
import { translations } from '../translations';
import {
  Mic,
  MicOff,
  Upload,
  Sparkles,
  ShieldCheck,
  Volume2,
  Activity,
  Play,
  RotateCcw,
  Send,
  Lock,
  HelpCircle,
} from 'lucide-react';

interface AcousticPanelProps {
  language: Language;
  onTriggerAlert: (alertData: {
    title: string;
    kind: 'suspected tree-cutting acoustic';
    confidence: number;
    deviceId: string;
    category: 'Acoustic';
  }) => void;
}

export const AcousticPanel: React.FC<AcousticPanelProps> = ({
  language,
  onTriggerAlert,
}) => {
  const t = translations[language];
  const engineRef = useRef<AcousticEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isListening, setIsListening] = useState(false);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState<AcousticAnalysisFrame>({
    volumeDb: -90,
    rms: 0,
    spectrum: [],
    flagChainsaw: false,
    flagAxeImpact: false,
    heuristicVerdict: 'normal',
    confidenceScore: 0.95,
    dominantFrequencyHz: 0,
  });

  const [geminiResult, setGeminiResult] = useState<AcousticAnalysisResult | null>(null);
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  useEffect(() => {
    engineRef.current = new AcousticEngine();
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  // Draw real-time FFT spectrum on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#0a130f';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#16271e';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const spectrum = currentFrame.spectrum;
    if (spectrum && spectrum.length > 0) {
      const barWidth = width / spectrum.length;

      for (let i = 0; i < spectrum.length; i++) {
        const val = spectrum[i];
        const barHeight = (val / 255) * height;

        let barColor = '#34d399';
        if (i > 15 && i < 35 && currentFrame.flagAxeImpact) {
          barColor = '#f59e0b';
        } else if (i > 38 && i < 75 && currentFrame.flagChainsaw) {
          barColor = '#ef4444';
        } else if (val > 180) {
          barColor = '#e2be82';
        }

        ctx.fillStyle = barColor;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }
    } else {
      ctx.strokeStyle = '#223c2e';
      ctx.beginPath();
      ctx.moveTo(0, height - 10);
      ctx.lineTo(width, height - 10);
      ctx.stroke();
    }
  }, [currentFrame]);

  const handleToggleMic = async () => {
    if (isListening) {
      engineRef.current?.stop();
      setIsListening(false);
      setActiveSignal(null);
    } else {
      setAlertDispatched(false);
      const ok = await engineRef.current?.startMicrophone((frame) => {
        setCurrentFrame(frame);
      });
      if (ok) {
        setIsListening(true);
        setActiveSignal(language === 'hi' ? 'लाइव माइक्रोफोन' : 'Live Microphone');
      } else {
        alert('Could not access microphone. You can test using the built-in sound buttons below.');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAlertDispatched(false);
    engineRef.current?.loadAudioFile(file, (frame) => {
      setCurrentFrame(frame);
    });
    setIsListening(true);
    setActiveSignal(`File: ${file.name}`);
  };

  const handlePlaySynthesized = (type: 'chainsaw' | 'axe' | 'forest') => {
    setAlertDispatched(false);
    setGeminiResult(null);
    engineRef.current?.playSynthesizedSignal(type, (frame) => {
      setCurrentFrame(frame);
    });
    setIsListening(true);
    setActiveSignal(
      type === 'chainsaw'
        ? (language === 'hi' ? '⚡ आरा ध्वनि (चेनसॉ)' : '⚡ Chainsaw Motor')
        : type === 'axe'
        ? (language === 'hi' ? '🪓 कुल्हाड़ी की थाप' : '🪓 Axe Strikes')
        : (language === 'hi' ? '🌲 सामान्य वन पक्षी' : '🌲 Natural Birds')
    );
  };

  const handleStopAll = () => {
    engineRef.current?.stop();
    setIsListening(false);
    setActiveSignal(null);
  };

  // Deep Gemini Analysis
  const handleDeepGeminiAnalysis = async () => {
    setIsAnalyzingGemini(true);
    try {
      const recorded = await engineRef.current?.getRecordedAudioBase64();
      const response = await fetch('/api/ai/audio-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: recorded?.base64 || 'SIMULATED_AUDIO_SAMPLE',
          mimeType: recorded?.mimeType || 'audio/webm',
          heuristicSummary:
            currentFrame.heuristicVerdict === 'chainsaw'
              ? 'chainsaw harmonic signature detected'
              : currentFrame.heuristicVerdict === 'axe-impact'
              ? 'periodic axe strikes detected'
              : 'ambient forest noise',
        }),
      });

      const data = await response.json();
      setGeminiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingGemini(false);
    }
  };

  const handlePushAlert = () => {
    const isChainsaw = currentFrame.flagChainsaw || geminiResult?.category === 'chainsaw';
    const isAxe = currentFrame.flagAxeImpact || geminiResult?.category === 'axe-impact';

    onTriggerAlert({
      title: isChainsaw
        ? (language === 'hi' ? 'संदिग्ध आरा ध्वनि — तुरंत जांच की आवश्यकता' : 'Sustained Saw Sound — Human Inspection Requested')
        : isAxe
        ? (language === 'hi' ? 'लगातार कुल्हाड़ी की थाप — पेड़ कटने की आशंका' : 'Repeated Chopping Sounds — Potential Tree Cutting')
        : (language === 'hi' ? 'असामान्य ध्वनि — बीट गार्ड जांच करें' : 'Unusual Sound Signature in Forest Zone'),
      kind: 'suspected tree-cutting acoustic',
      confidence: geminiResult ? geminiResult.confidence : currentFrame.confidenceScore,
      deviceId: 'ACOUSTIC-NOD-4B',
      category: 'Acoustic',
    });
    setAlertDispatched(true);
  };

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-[#e2be82] border border-[#2e543d] flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'ध्वनि पूर्व-चेतावनी (आरा एवं कुल्हाड़ी पहचान)' : 'Acoustic Early Warning (Sound Checker)'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                {language === 'hi' ? 'ब्राउज़र में परीक्षण' : 'ON-DEVICE AUDIO'}
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'जंगल में चलने वाले आरे या कुल्हाड़ी की आवाज पहचानता है और इंसानी टीम को अलर्ट करता है।'
                : 'Listens for chainsaw buzzes or chopping sounds, then asks a person to confirm.'}
            </p>
          </div>
        </div>

        {/* Privacy Lock Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b140f] border border-[#1e382b] text-[11px] font-mono-code text-[#a3b8aa]">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? 'गोपनीय: आपकी आवाज रिकॉर्ड नहीं होती' : 'Private: Audio is Never Saved'}</span>
        </div>
      </div>

      {/* Simple 3-Step User Guide */}
      <div className="p-3.5 rounded-xl bg-[#0c1611] border border-[#1e382b] text-xs text-[#a3b8aa] space-y-1">
        <div className="font-bold text-[#c9d99f] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#e2be82]" />
          {language === 'hi' ? 'परीक्षण कैसे करें (3 आसान बातें):' : 'How to test this in 3 easy steps:'}
        </div>
        <p className="text-[11px] leading-relaxed">
          {language === 'hi'
            ? '1. नीचे "⚡ आरा ध्वनि" या "🪓 कुल्हाड़ी" बटन दबाकर आवाज चलाएं। 2. हरे/लाल बार को ऊपर-नीचे होते देखें। 3. अगर आपको लगे कि सच में पेड़ कट रहे हैं, तो "वन रक्षकों को अलर्ट भेजें" बटन दबाएं।'
            : '1. Click "⚡ Chainsaw" or "🪓 Axe Strikes" below to play a test sound. 2. Watch the frequency bars react. 3. If suspicious, click "Trigger Alert to Forest Guards" so a team can inspect.'}
        </p>
      </div>

      {/* Input Controls & Test Signal Synthesizers */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1712] p-3 rounded-xl border border-[#1c3327]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mic Toggle */}
          <button
            onClick={handleToggleMic}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              isListening && activeSignal?.includes('Microphone')
                ? 'bg-red-600 text-white shadow-lg animate-pulse'
                : 'bg-[#1e382b] hover:bg-[#284a39] text-[#f0fdf4] border border-[#2f553f]'
            }`}
          >
            {isListening && activeSignal?.includes('Microphone') ? (
              <>
                <MicOff className="w-4 h-4" /> {language === 'hi' ? 'माइक बंद करें' : 'Stop Live Mic'}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-[#e2be82]" /> {language === 'hi' ? 'माइक से सुनें' : 'Listen via Microphone'}
              </>
            )}
          </button>

          {/* Audio File Upload */}
          <label className="px-3.5 py-2 rounded-lg bg-[#182d22] hover:bg-[#203c2d] border border-[#294c37] text-xs font-semibold text-[#c9d99f] flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>{language === 'hi' ? 'ऑडियो फाइल अपलोड करें' : 'Upload Audio File'}</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Stop Button */}
          {isListening && (
            <button
              onClick={handleStopAll}
              className="p-2 rounded-lg bg-[#221818] border border-red-900/40 text-red-300 hover:text-white"
              title="Stop Signal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Fast Test Sounds */}
        <div className="flex items-center gap-1.5 text-xs font-mono-code">
          <span className="text-[#6d8a79] text-[11px] mr-1 hidden sm:inline">
            {language === 'hi' ? 'परीक्षण आवाजें:' : 'Test Sounds:'}
          </span>
          <button
            onClick={() => handlePlaySynthesized('chainsaw')}
            className="px-2.5 py-1.5 rounded-lg bg-[#2b1f13] hover:bg-[#3d2c1c] text-[#e88d43] border border-[#4d3620] transition-colors"
          >
            ⚡ {language === 'hi' ? 'आरा (चेनसॉ)' : 'Chainsaw'}
          </button>
          <button
            onClick={() => handlePlaySynthesized('axe')}
            className="px-2.5 py-1.5 rounded-lg bg-[#242615] hover:bg-[#34371e] text-[#e2be82] border border-[#4a4d25] transition-colors"
          >
            🪓 {language === 'hi' ? 'कुल्हाड़ी की थाप' : 'Axe Strikes'}
          </button>
          <button
            onClick={() => handlePlaySynthesized('forest')}
            className="px-2.5 py-1.5 rounded-lg bg-[#14261d] hover:bg-[#1c3628] text-emerald-400 border border-[#254634] transition-colors"
          >
            🌲 {language === 'hi' ? 'पक्षी / हवा' : 'Natural Birds'}
          </button>
        </div>
      </div>

      {/* Active Source Banner */}
      {activeSignal && (
        <div className="flex items-center justify-between text-xs font-mono-code px-3 py-1.5 rounded-lg bg-[#0e1a14] border border-[#1f372b] text-[#c9d99f]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {language === 'hi' ? 'सक्रिय ध्वनि स्रोत:' : 'Playing:'}{' '}
            <strong className="text-white">{activeSignal}</strong>
          </span>
          <span>Pitch: {currentFrame.dominantFrequencyHz} Hz</span>
        </div>
      )}

      {/* Visualizer Canvas & Level Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-code text-[#869e90]">
          <span>{language === 'hi' ? 'ध्वनि तरंगे (कम से तेज फ्रीक्वेंसी)' : 'Live Sound Frequencies'}</span>
          <div className="flex items-center gap-3">
            <span>{language === 'hi' ? 'आवाज स्तर:' : 'Volume:'} <strong className="text-white">{currentFrame.volumeDb} dB</strong></span>
          </div>
        </div>

        {/* Spectrum Canvas */}
        <div className="rounded-xl overflow-hidden border border-[#1e382b] bg-[#0a130f]">
          <canvas
            ref={canvasRef}
            width={600}
            height={120}
            className="w-full h-28 block"
          />
        </div>

        {/* Volume DB Bar */}
        <div className="w-full h-2 rounded-full bg-[#0a120e] overflow-hidden border border-[#1e3328]">
          <div
            className={`h-full transition-all duration-75 ${
              currentFrame.volumeDb > -30
                ? 'bg-red-500'
                : currentFrame.volumeDb > -50
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, ((currentFrame.volumeDb + 90) / 90) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* Transparent Rule-based Heuristic Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Chainsaw Heuristic Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            currentFrame.flagChainsaw
              ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/50'
              : 'bg-[#122219] border-[#1e382b]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-400" />
              {language === 'hi' ? 'नियम 1: लगातार मोटर की भनभनाहट (आरा)' : 'Rule 1: Continuous Motor Buzz (Chainsaw)'}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                currentFrame.flagChainsaw
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#192d22] text-[#869e90]'
              }`}
            >
              {currentFrame.flagChainsaw ? (language === 'hi' ? 'पहचाना गया' : 'DETECTED') : (language === 'hi' ? 'शांत' : 'CLEAR')}
            </span>
          </div>
          <p className="text-[#a3b8aa] text-[11px] leading-relaxed">
            {language === 'hi'
              ? 'जब 2 सेकंड से ज्यादा देर तक लगातार तेज भिनभिनाहट आती है, तो यह आरा होने का संकेत देता है।'
              : 'Flags steady, high-pitched mechanical sound lasting over 2 seconds.'}
          </p>
        </div>

        {/* Axe Impact Heuristic Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            currentFrame.flagAxeImpact
              ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/50'
              : 'bg-[#122219] border-[#1e382b]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'नियम 2: रुक-रुक कर कुल्हाड़ी की थाप' : 'Rule 2: Repeated Chopping Rhythm (Axe)'}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                currentFrame.flagAxeImpact
                  ? 'bg-amber-500 text-black animate-pulse'
                  : 'bg-[#192d22] text-[#869e90]'
              }`}
            >
              {currentFrame.flagAxeImpact ? (language === 'hi' ? 'पहचाना गया' : 'DETECTED') : (language === 'hi' ? 'शांत' : 'CLEAR')}
            </span>
          </div>
          <p className="text-[#a3b8aa] text-[11px] leading-relaxed">
            {language === 'hi'
              ? 'जब हर 1-2 सेकंड में लकड़ी पर चोट जैसी तेज थाप दोहराई जाती है, तो यह कुल्हाड़ी का संकेत देता है।'
              : 'Flags rhythmic percussive thumps repeating every 1 to 2 seconds.'}
          </p>
        </div>
      </div>

      {/* Mandatory Safety Rule Badge */}
      <div className="px-4 py-2.5 rounded-xl bg-[#182315] border border-[#3e4f20] text-xs text-[#e2be82] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#e2be82]" />
        <span>
          <strong>{t.ruleBadge}</strong>{' '}
          {language === 'hi'
            ? 'ट्रैक्टर या तेज हवा भी आरे जैसी लग सकती है। इसलिए इंसान का मौके पर जाना जरूरी है।'
            : 'Farm tractors or strong wind can sound like saws. Ground verification by a person is always required.'}
        </span>
      </div>

      {/* Deep Analysis with Gemini & Trigger Alert Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1e3328]">
        {/* Gemini Trigger */}
        <div className="space-y-1">
          <button
            onClick={handleDeepGeminiAnalysis}
            disabled={isAnalyzingGemini}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2c4068] to-[#1e2c47] hover:from-[#395285] hover:to-[#273a5e] text-white text-xs font-semibold border border-[#425d94] flex items-center gap-2 transition-all shadow disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-[#e2be82] ${isAnalyzingGemini ? 'animate-spin' : ''}`} />
            <span>
              {isAnalyzingGemini
                ? (language === 'hi' ? 'जेमिनी एआई आवाज समझ रहा है...' : 'Gemini AI Analyzing Sound...')
                : (language === 'hi' ? 'जेमिनी एआई से राय लें' : 'Ask Gemini AI for a Second Opinion')}
            </span>
          </button>
          <p className="text-[10px] text-[#6c8577]">
            {language === 'hi'
              ? 'बटन दबाने पर ही 15 सेकंड का छोटा टुकड़ा जेमिनी को भेजा जाता है।'
              : 'Transmits a short 15-second clip to Gemini only when you click this button.'}
          </p>
        </div>

        {/* Action Button: Push to Escalation Pipeline */}
        {(currentFrame.flagChainsaw || currentFrame.flagAxeImpact || geminiResult) && (
          <button
            onClick={handlePushAlert}
            disabled={alertDispatched}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              alertDispatched
                ? 'bg-emerald-800 text-white cursor-default'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50 animate-bounce'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {alertDispatched
                ? (language === 'hi' ? 'वन रक्षकों को अलर्ट भेजा गया!' : 'Alert Dispatched to Patrol!')
                : (language === 'hi' ? 'वन रक्षकों को अलर्ट भेजें' : 'Trigger Alert to Forest Guards')}
            </span>
          </button>
        )}
      </div>

      {/* Gemini Analysis Output Display */}
      {geminiResult && (
        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#2b4c39] space-y-2 text-xs font-mono-code animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1b3425] pb-2">
            <span className="text-[#c9d99f] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e2be82]" />
              {language === 'hi' ? 'जेमिनी एआई का निष्कर्ष' : 'Gemini AI Opinion'}
            </span>
            <span className="text-white px-2 py-0.5 rounded bg-[#1e382b]">
              {geminiResult.category.toUpperCase()} ({(geminiResult.confidence * 100).toFixed(0)}%)
            </span>
          </div>
          <p className="text-[#a3b8aa] leading-relaxed">
            {geminiResult.reasoning}
          </p>
        </div>
      )}
    </div>
  );
};
