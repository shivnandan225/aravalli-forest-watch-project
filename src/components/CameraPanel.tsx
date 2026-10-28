import React, { useRef, useState, useEffect } from 'react';
import { Language, VisionAnalysisResult } from '../types';
import { translations } from '../translations';
import {
  Camera,
  Video,
  Upload,
  Sparkles,
  ShieldCheck,
  Send,
  Eye,
  Lock,
  HelpCircle,
} from 'lucide-react';

interface CameraPanelProps {
  language: Language;
  onTriggerAlert: (alertData: {
    title: string;
    kind: 'tree-cover loss' | 'mining/excavation';
    confidence: number;
    deviceId: string;
    category: 'Camera';
  }) => void;
}

const SAMPLE_FRAMES = [
  {
    name: 'Dry Aravalli Ridge',
    nameHi: 'सूखी पहाड़ी ढलान',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/A_view_of_Udaipur_Aravalli_Hills_Rajasthan_India.jpg',
    expected: 'Normal canopy with no machinery',
  },
  {
    name: 'Timber Excavation Zone',
    nameHi: 'मिट्टी / पेड़ कटाव क्षेत्र',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Rajasthan%2C_Aravalli_range.jpg/1920px-Rajasthan%2C_Aravalli_range.jpg',
    expected: 'Possible clearing / soil exposure',
  },
  {
    name: 'Northern Foothills',
    nameHi: 'उत्तरी तलहटी झाड़ियां',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Aravalli_Hills_near_Gurgaon.jpg',
    expected: 'Scrubland perimeter',
  },
];

export const CameraPanel: React.FC<CameraPanelProps> = ({
  language,
  onTriggerAlert,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<'webcam' | 'upload' | 'sample'>('sample');
  const [selectedSample, setSelectedSample] = useState(SAMPLE_FRAMES[0].url);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [alertDispatched, setAlertDispatched] = useState(false);

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsWebcamActive(true);
        setMode('webcam');
      } catch (err) {
        alert('Could not access webcam. You can use sample photos or upload an image.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrameFromWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedFrame(dataUrl);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      setCapturedFrame(result);
      setMode('upload');
      setAnalysisResult(null);
      setAlertDispatched(false);
    };
    reader.readAsDataURL(file);
  };

  const getActiveImageData = async (): Promise<string> => {
    if (capturedFrame) return capturedFrame;
    if (uploadedImage && mode === 'upload') return uploadedImage;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 640;
        canvas.height = img.height || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve('SIMULATED_FRAME_BASE64');
        }
      };
      img.onerror = () => resolve('SIMULATED_FRAME_BASE64');
      img.src = selectedSample;
    });
  };

  const handleAnalyzeFrame = async () => {
    setIsAnalyzing(true);
    setAlertDispatched(false);
    try {
      const base64 = await getActiveImageData();
      const response = await fetch('/api/ai/vision-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePushAlert = () => {
    onTriggerAlert({
      title: language === 'hi' ? 'कैमरा दृश्य में बदलाव — मौके पर जाकर जांचें' : 'Visual Change Detected — Human Verification Requested',
      kind: 'tree-cover loss',
      confidence: analysisResult ? analysisResult.confidence : 0.87,
      deviceId: 'CAM-OPTICAL-02',
      category: 'Camera',
    });
    setAlertDispatched(true);
  };

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-sky-400 border border-[#2e543d] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'कैमरा फोटो जांच (विज़न एआई)' : 'Camera Photo Checker (Vision AI)'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
                AI VISION
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'कैमरे की तस्वीर देखकर जांचता है कि कहीं पेड़ तो नहीं काटे जा रहे या धुआं तो नहीं उठ रहा।'
                : 'Checks camera snapshots for fallen trees, excavation, or smoke.'}
            </p>
          </div>
        </div>

        {/* Anonymity Guarantee Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b140f] border border-[#1e382b] text-[11px] font-mono-code text-[#a3b8aa]">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? 'गोपनीयता: चेहरों की पहचान नहीं की जाती' : 'Privacy: Never Identifies Faces'}</span>
        </div>
      </div>

      {/* Simple 3-Step Guide */}
      <div className="p-3.5 rounded-xl bg-[#0c1611] border border-[#1e382b] text-xs text-[#a3b8aa] space-y-1">
        <div className="font-bold text-[#c9d99f] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#e2be82]" />
          {language === 'hi' ? 'फोटो जांच कैसे करें:' : 'How this works:'}
        </div>
        <p className="text-[11px] leading-relaxed">
          {language === 'hi'
            ? '1. नीचे से कोई भी नमूना फोटो चुनें या अपना कैमरा चालू करें। 2. "एआई से फोटो की जांच कराएं" दबाएं। 3. अगर कोई नुकसान दिखे, तो "वन रक्षकों को अलर्ट भेजें" दबाएं ताकि वे मौके पर जा सकें।'
            : '1. Select a sample photo or use your webcam. 2. Click "Inspect Photo with AI". 3. If damage is detected, click "Send Alert to Forest Guards" to dispatch a verification team.'}
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1712] p-3 rounded-xl border border-[#1c3327]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('sample')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'sample'
                ? 'bg-[#223d2f] text-[#c9d99f] shadow'
                : 'text-[#869e90] hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नमूना तस्वीरें' : 'Sample Photos'}
          </button>
          <button
            onClick={toggleWebcam}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isWebcamActive
                ? 'bg-red-600 text-white shadow animate-pulse'
                : 'text-[#869e90] hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            {isWebcamActive
              ? (language === 'hi' ? 'वेबकैम बंद करें' : 'Stop Webcam')
              : (language === 'hi' ? 'अपना कैमरा चालू करें' : 'Use Device Camera')}
          </button>
          <label className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#869e90] hover:text-white cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Sample selector */}
        {mode === 'sample' && (
          <div className="flex items-center gap-1.5 text-xs font-mono-code">
            {SAMPLE_FRAMES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSample(s.url);
                  setCapturedFrame(null);
                  setAnalysisResult(null);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  selectedSample === s.url
                    ? 'bg-[#1e382b] text-[#e2be82] border border-[#2f553f]'
                    : 'text-[#869e90] hover:text-white'
                }`}
              >
                {language === 'hi' ? s.nameHi : s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Frame Preview Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-[#223d2e] bg-[#0c1611] aspect-video max-h-[320px] flex items-center justify-center">
        {mode === 'webcam' && isWebcamActive ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={captureFrameFromWebcam}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#1b3124]/90 backdrop-blur-md border border-[#2f553f] text-xs font-semibold text-[#c9d99f] flex items-center gap-2 hover:bg-[#254634]"
            >
              <Camera className="w-4 h-4 text-[#e2be82]" />
              {language === 'hi' ? 'जांच के लिए फोटो खींचें' : 'Capture Snapshot'}
            </button>
          </div>
        ) : capturedFrame ? (
          <img
            src={capturedFrame}
            alt="Captured Frame"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={selectedSample}
            alt="Sample Frame"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Privacy & Honesty Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-[#182315] border border-[#3e4f20] text-xs text-[#e2be82] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#e2be82]" />
        <span>
          <strong>{t.ruleBadge}</strong>{' '}
          {language === 'hi'
            ? 'अगर कोई व्यक्ति दिखता है, तो उसे सिर्फ "एक व्यक्ति मौजूद है" लिखा जाता है। इंसान ही मौके पर फैसला लेता है।'
            : 'Human presence is recorded strictly as "a person is present". Only human guards decide legal steps.'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e3328]">
        <button
          onClick={handleAnalyzeFrame}
          disabled={isAnalyzing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2c4068] to-[#1e2c47] hover:from-[#395285] hover:to-[#273a5e] text-white text-xs font-bold border border-[#425d94] flex items-center gap-2 transition-all shadow disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-[#e2be82] ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>
            {isAnalyzing
              ? (language === 'hi' ? 'एआई फोटो की जांच कर रहा है...' : 'AI Inspecting Photo...')
              : (language === 'hi' ? 'एआई से फोटो की जांच कराएं' : 'Inspect Photo with AI')}
          </span>
        </button>

        {analysisResult && (
          <button
            onClick={handlePushAlert}
            disabled={alertDispatched}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              alertDispatched
                ? 'bg-emerald-800 text-white cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {alertDispatched
                ? (language === 'hi' ? 'अलर्ट बीट गार्ड को भेजा गया!' : 'Alert Sent to Patrol!')
                : (language === 'hi' ? 'वन रक्षकों को अलर्ट भेजें' : 'Send Alert to Forest Guards')}
            </span>
          </button>
        )}
      </div>

      {/* Analysis Output Box */}
      {analysisResult && (
        <div className="p-4 rounded-xl bg-[#0c1611] border border-[#2b4c39] space-y-2 text-xs font-mono-code animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1b3425] pb-2">
            <span className="text-[#c9d99f] font-bold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#e2be82]" />
              {language === 'hi' ? 'एआई ने क्या देखा:' : 'What the AI observed:'}
            </span>
            <span className="text-white px-2 py-0.5 rounded bg-[#1e382b]">
              Likelihood: {(analysisResult.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <ul className="list-disc list-inside space-y-1 text-[#d1e0d7]">
            {analysisResult.observations.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>

          <div className="p-2.5 rounded-lg bg-[#14231b] border border-[#1e382b] text-[#a3b8aa]">
            <span className="text-[#e2be82] font-semibold">
              {language === 'hi' ? 'संदेह / सीमा:' : 'Important note:'}{' '}
            </span>
            {analysisResult.uncertainty_notes}
          </div>
        </div>
      )}
    </div>
  );
};
