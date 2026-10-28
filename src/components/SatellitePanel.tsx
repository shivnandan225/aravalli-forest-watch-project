import React, { useState } from 'react';
import { Language, AlertKind } from '../types';
import { translations } from '../translations';
import {
  Satellite,
  Send,
  ShieldCheck,
  Compass,
  AlertCircle,
  Database,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface SatellitePanelProps {
  language: Language;
  onTriggerAlert: (alertData: {
    title: string;
    kind: AlertKind;
    confidence: number;
    deviceId: string;
    category: 'Satellite';
    replyWindowSeconds?: number;
  }) => void;
}

export const SatellitePanel: React.FC<SatellitePanelProps> = ({
  language,
  onTriggerAlert,
}) => {
  const t = translations[language];
  const [selectedKind, setSelectedKind] = useState<AlertKind>('tree-cover loss');
  const [selectedWindow, setSelectedWindow] = useState<number>(60);
  const [customLat, setCustomLat] = useState('24.6142');
  const [customLng, setCustomLng] = useState('73.6921');
  const [confidence, setConfidence] = useState(0.89);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const kindTitles: Record<AlertKind, string> = {
      'tree-cover loss': 'Simulated Canopy Loss (>0.5 Hectare) in Ridge Buffer',
      'mining/excavation': 'Simulated Heavy Excavation & Earthwork Trajectory',
      'fire/smoke': 'Simulated Thermal Brightness & Plume Reflection',
      'encroachment': 'Simulated Boundary Fence Encroachment Anomaly',
      'suspected tree-cutting acoustic': 'Acoustic Signature Anomaly',
    };

    onTriggerAlert({
      title: kindTitles[selectedKind] || 'Satellite Anomaly Detected',
      kind: selectedKind,
      confidence,
      deviceId: 'SAT-MOCK-SENTINEL-12',
      category: 'Satellite',
      replyWindowSeconds: selectedWindow,
    });

    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-teal-400 border border-[#2e543d] flex items-center justify-center">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'उपग्रह परिवर्तन चेतावनी सेवा' : 'Satellite Change Detection Service'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800/40">
                SIMULATED REST SERVICE
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'सेंटिनल-2 मल्टी-स्पेक्ट्रल परिवर्तन पहचान सिमुलेशन एवं REST API इंटरफेस'
                : 'Simulated Sentinel-2 change detection service backed by a REST API layer.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b140f] border border-[#1e382b] text-[11px] font-mono-code text-[#a3b8aa]">
          <Database className="w-3.5 h-3.5 text-teal-400" />
          <span>Endpoint: POST /api/alerts</span>
        </div>
      </div>

      {/* Simulated Satellite Stream Feeds */}
      <div className="p-4 rounded-xl bg-[#0c1611] border border-[#1d3527] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-[#c9d99f]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Simulated Sentinel-2 Constellation Orbital Pass
          </span>
          <span className="text-[#869e90]">Revisit Orbit: 5 Days (Synthetic)</span>
        </div>
        <p className="text-xs text-[#a3b8aa] leading-relaxed">
          In production, this module subscribes to Copernicus Sentinel-2 MSI NDVI (Normalized Difference Vegetation Index) differential tiles. Any NDVI drops exceeding 0.25 trigger an automated candidate polygon.
        </p>

        {/* Pluggable Adapter Note */}
        <div className="p-3 rounded-lg bg-[#14231b] border border-[#223c2e] text-[11px] font-mono-code text-[#8fa799] flex items-start gap-2">
          <Code2 className="w-4 h-4 text-[#e2be82] shrink-0 mt-0.5" />
          <div>
            <strong>Pluggable Provider Architecture:</strong> The backend implements a generic <code>DetectionProvider</code> interface. Sentinel-2, PlanetScope, or ISRO Cartosat pipelines can replace the simulation with zero client-side rewrites.
          </div>
        </div>
      </div>

      {/* Form to dispatch simulated satellite alerts */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-code">
        <div className="font-semibold text-white text-sm">
          Dispatch Simulated Satellite Telemetry Event
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Anomaly Kind */}
          <div className="space-y-1">
            <label className="text-[#869e90]">Anomaly Category:</label>
            <select
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value as AlertKind)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            >
              <option value="tree-cover loss">Tree-cover Loss (NDVI)</option>
              <option value="mining/excavation">Mining / Excavation</option>
              <option value="fire/smoke">Fire / Thermal Plume</option>
              <option value="encroachment">Encroachment Buffer</option>
            </select>
          </div>

          {/* Reply Window */}
          <div className="space-y-1">
            <label className="text-[#869e90]">Reply Window (Escalation):</label>
            <select
              value={selectedWindow}
              onChange={(e) => setSelectedWindow(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            >
              <option value={30}>30 Seconds (Fast Demo)</option>
              <option value={60}>1 Minute (Standard Demo)</option>
              <option value={300}>5 Minutes (Field Simulation)</option>
            </select>
          </div>

          {/* Latitude */}
          <div className="space-y-1">
            <label className="text-[#869e90]">Latitude:</label>
            <input
              type="text"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-1">
            <label className="text-[#869e90]">Longitude:</label>
            <input
              type="text"
              value={customLng}
              onChange={(e) => setCustomLng(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            />
          </div>
        </div>

        {/* Confidence Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#869e90]">
            <span>Algorithm Confidence: {(confidence * 100).toFixed(0)}%</span>
            <span>Device ID: SAT-MOCK-SENTINEL-12</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="w-full accent-[#34d399]"
          />
        </div>

        {/* Mandatory notice */}
        <div className="px-4 py-2.5 rounded-xl bg-[#182315] border border-[#3e4f20] text-xs text-[#e2be82] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#e2be82]" />
          <span>
            <strong>{t.ruleBadge}</strong> Synthetic satellite telemetry will initialize an actionable Level 1 escalation case with countdown.
          </span>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {successMsg && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4" /> Dispatched to /api/alerts! Check Multi-Level Escalations.
            </span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Emit Simulated Satellite Alert</span>
          </button>
        </div>
      </form>
    </div>
  );
};
