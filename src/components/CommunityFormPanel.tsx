import React, { useState, useEffect } from 'react';
import { Language, CommunityObservation } from '../types';
import { translations } from '../translations';
import {
  FileEdit,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  Trash2,
  Download,
  CheckCircle2,
  Lock,
  HelpCircle,
} from 'lucide-react';

interface CommunityFormPanelProps {
  language: Language;
  selectedMapCoords: { lat: number; lng: number } | null;
}

const LOCAL_STORAGE_KEY = 'greenguard_community_observations_v1';

export const CommunityFormPanel: React.FC<CommunityFormPanelProps> = ({
  language,
  selectedMapCoords,
}) => {
  const t = translations[language];

  const [obsType, setObsType] = useState('Possible tree cutting');
  const [placeName, setPlaceName] = useState('Near Sisarma Stream, Udaipur');
  const [lat, setLat] = useState('24.5824');
  const [lng, setLng] = useState('73.6812');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [savedRecords, setSavedRecords] = useState<CommunityObservation[]>([]);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  useEffect(() => {
    if (selectedMapCoords) {
      setLat(selectedMapCoords.lat.toString());
      setLng(selectedMapCoords.lng.toString());
      setPlaceName(`Pinned point (${selectedMapCoords.lat.toFixed(3)}°N, ${selectedMapCoords.lng.toFixed(3)}°E)`);
    }
  }, [selectedMapCoords]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedRecords(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newRecord: CommunityObservation = {
      id: `comm-obs-${Date.now().toString(36)}`,
      observationType: obsType,
      observedAt: new Date().toISOString(),
      latitude: parseFloat(lat) || 24.58,
      longitude: parseFloat(lng) || 73.68,
      placeName: placeName || 'Aravalli Ridge',
      description: description.trim(),
      reporterContact: contact ? contact.trim() : undefined,
      savedLocallyAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...savedRecords];
    setSavedRecords(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    setDescription('');
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = savedRecords.filter((r) => r.id !== id);
    setSavedRecords(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(savedRecords, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aravalli_community_notes_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-[#244232] bg-[#111e17] p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1e3328]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3425] text-[#e2be82] border border-[#2e543d] flex items-center justify-center">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title font-bold text-lg text-white">
                {language === 'hi' ? 'नागरिक सूचना डायरी (सामुदायिक रिपोर्ट)' : 'Citizen Observation Diary'}
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                100% PRIVATE
              </span>
            </div>
            <p className="text-xs text-[#869e90]">
              {language === 'hi'
                ? 'जंगल में कुछ भी असामान्य देखा? यहां नोट करें। यह सिर्फ आपके ब्राउज़र में सुरक्षित रहता है।'
                : 'Saw something in the hills? Write it down here. Saved privately in your browser.'}
            </p>
          </div>
        </div>

        {/* Privacy Lock Notice */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b140f] border border-[#1e382b] text-[11px] font-mono-code text-[#a3b8aa]">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? 'केवल आपके फोन / कंप्यूटर में सुरक्षित' : 'Kept Safe in Your Browser'}</span>
        </div>
      </div>

      {/* Explainer card */}
      <div className="p-3.5 rounded-xl bg-[#0c1611] border border-[#1e382b] text-xs text-[#a3b8aa] space-y-1">
        <div className="font-bold text-[#c9d99f] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#e2be82]" />
          {language === 'hi' ? 'नागरिक डायरी कैसे काम करती है:' : 'How this diary works:'}
        </div>
        <p className="text-[11px] leading-relaxed">
          {language === 'hi'
            ? 'अगर आप जंगल में किसी जगह पेड़ कटे देखें, धुआं देखें या जानवर को संकट में देखें, तो यहां लिख लें। नक्शे पर क्लिक करके जगह भी जोड़ सकते हैं। यह जानकारी किसी भी सरकारी विभाग को सीधे नहीं भेजी जाती।'
            : 'If you spot tree cutting, smoke, or injured wildlife on your hike, log it here. Click the map to fill the coordinates. It stays on your device and will never be shared without your permission.'}
        </p>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSaveObservation} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Observation Type */}
          <div className="space-y-1">
            <label className="text-[#a3b8aa] font-semibold">
              {language === 'hi' ? 'आपने क्या देखा:' : 'What did you observe:'}
            </label>
            <select
              value={obsType}
              onChange={(e) => setObsType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            >
              <option value="Possible tree cutting">
                {language === 'hi' ? 'पेड़ कटने की आशंका' : 'Possible Tree Cutting'}
              </option>
              <option value="Possible mining or excavation">
                {language === 'hi' ? 'अवैध खनन या मिट्टी खुदाई' : 'Mining or Soil Digging'}
              </option>
              <option value="Wildlife concern">
                {language === 'hi' ? 'वन्यजीव चिंता / घायल पशु' : 'Wildlife Concern / Injury'}
              </option>
              <option value="Fire or smoke observed">
                {language === 'hi' ? 'जंगल में आग या धुआं' : 'Fire or Smoke Observed'}
              </option>
              <option value="Other environmental concern">
                {language === 'hi' ? 'अन्य पर्यावरणीय चिंता' : 'Other Environmental Concern'}
              </option>
            </select>
          </div>

          {/* Place Name */}
          <div className="space-y-1">
            <label className="text-[#a3b8aa] font-semibold">
              {language === 'hi' ? 'स्थान / पहाड़ी का नाम:' : 'Landmark / Ridge Name:'}
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
              placeholder="e.g. Near Sisarma Valley, Udaipur"
            />
          </div>

          {/* Latitude */}
          <div className="space-y-1">
            <label className="text-[#a3b8aa] font-semibold">
              {language === 'hi' ? 'अक्षांश (नक्शे पर क्लिक करें):' : 'Latitude (or click map):'}
            </label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white font-mono-code focus:outline-none focus:border-[#c9d99f]"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-1">
            <label className="text-[#a3b8aa] font-semibold">
              {language === 'hi' ? 'देशांतर:' : 'Longitude:'}
            </label>
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white font-mono-code focus:outline-none focus:border-[#c9d99f]"
            />
          </div>
        </div>

        {/* Description textarea */}
        <div className="space-y-1">
          <label className="text-[#a3b8aa] font-semibold">
            {language === 'hi' ? 'विस्तार से बताएं क्या देखा:' : 'What happened? Describe simply:'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'जैसे: दोपहर में 2 बजे के करीब सूखी घाटी में आरे की आवाज सुनाई दी...'
                : 'e.g., Heard loud chainsaw sounds around 2 PM near the southern ridge pass...'
            }
            className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
            required
          />
        </div>

        {/* Contact (Optional) */}
        <div className="space-y-1">
          <label className="text-[#869e90]">
            {language === 'hi' ? 'आपका नाम या फोन (वैकल्पिक, केवल आपके लिए):' : 'Your Contact Reference (Optional, kept private):'}
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. 98290-XXXXX"
            className="w-full px-3 py-2 rounded-lg bg-[#0c1611] border border-[#254432] text-white focus:outline-none focus:border-[#c9d99f]"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-1">
          {showSavedNotification ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {language === 'hi' ? 'आपकी डायरी में सुरक्षित हो गया!' : 'Saved in your local diary!'}
            </span>
          ) : (
            <span className="text-[11px] text-[#6d8878]">
              {language === 'hi' ? 'यह जानकारी आपके फोन में ही रहेगी।' : 'Private to this browser.'}
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#295438] to-[#1c3a27] hover:from-[#356a48] hover:to-[#244b32] text-white font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#e2be82]" />
            <span>{language === 'hi' ? 'डायरी में सुरक्षित करें' : 'Save in My Browser'}</span>
          </button>
        </div>
      </form>

      {/* List of Saved Observations */}
      {savedRecords.length > 0 && (
        <div className="pt-4 border-t border-[#1e3328] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c9d99f] font-bold">
              {language === 'hi'
                ? `आपके द्वारा सहेजी गई डायरी प्रविष्टियां (${savedRecords.length})`
                : `Your Saved Observations (${savedRecords.length})`}
            </span>
            <button
              onClick={handleExportJSON}
              className="text-xs text-[#869e90] hover:text-white flex items-center gap-1 font-mono-code"
            >
              <Download className="w-3.5 h-3.5" /> {language === 'hi' ? 'डाउनलोड करें (JSON)' : 'Download (JSON)'}
            </button>
          </div>

          <div className="space-y-2">
            {savedRecords.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-[#0c1611] border border-[#1e382b] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#e2be82] font-semibold">{r.observationType}</span>
                    <span className="text-[#6d8a79] font-mono-code">
                      · {r.placeName} ({r.latitude.toFixed(3)}°N, {r.longitude.toFixed(3)}°E)
                    </span>
                  </div>
                  <p className="text-[#cbd8d0] leading-relaxed">{r.description}</p>
                  <div className="text-[10px] text-[#668071] font-mono-code">
                    {new Date(r.savedLocallyAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRecord(r.id)}
                  className="p-1.5 rounded-lg text-[#6d8a79] hover:text-red-400 hover:bg-[#1a201c] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
