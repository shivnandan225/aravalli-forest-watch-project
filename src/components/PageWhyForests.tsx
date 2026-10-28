import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, quotes } from '../translations';
import { ArrowRight, ArrowLeft, Quote, RefreshCw, Film, Image as ImageIcon, Volume2 } from 'lucide-react';

interface PageWhyForestsProps {
  language: Language;
  onEnterWatch: () => void;
  onBack: () => void;
}

// Config constant per specification: if empty, Ken-Burns slideshow is shown
export const FOREST_VIDEO_URL = ''; // "[PASTE YOUTUBE OR MP4 URL]"

const slides = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/A_view_of_Udaipur_Aravalli_Hills_Rajasthan_India.jpg',
    location: 'Udaipur, Rajasthan',
    caption: 'Ancient Ridges of Mewar: Catchment valleys that feed Lake Pichola and Fateh Sagar.',
    captionHi: 'मेवाड़ की प्राचीन पर्वत श्रेणियां: पिछोला और फतेहसागर को जल देने वाली जीवन रेखा।',
    credit: 'TeshTesh (CC BY-SA 4.0)',
  },
  {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Rajasthan%2C_Aravalli_range.jpg/1920px-Rajasthan%2C_Aravalli_range.jpg',
    location: 'Central Aravalli Range',
    caption: 'The Green Wall: Holding back the hyper-arid sands of the Thar Desert from encroaching eastward.',
    captionHi: 'हरी सुरक्षा दीवार: थार मरुस्थल की रेतीली हवाओं को पूर्व की ओर बढ़ने से रोकती पर्वतमाला।',
    credit: 'Wikimedia Commons Archive',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Aravalli_Hills_near_Gurgaon.jpg',
    location: 'Northern Aravalli Hills',
    caption: 'Fractured Wildlife Corridors: Essential refuge for leopards, jackals, and native scrub avifauna.',
    captionHi: 'प्राकृतिक वन्यजीव गलियारा: तेंदुओं, सियार और पक्षियों के लिए अमूल्य प्राकृतिक आश्रय।',
    credit: 'Pradeep717 (CC BY-SA 4.0)',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Kumbhalgarh_Wildlife_Sanctuary%2C_Rajasthan.jpg',
    location: 'Kumbhalgarh Ridge',
    caption: 'Living Forests & Sacred Groves: Hundreds of indigenous medicinal flora species sustained across rock shelves.',
    captionHi: 'सजीव वन एवं देववन: चट्टानी ढलानों पर पनपती सैकड़ों औषधीय वनस्पतियां।',
    credit: 'Sagar Sen (CC BY-SA 4.0)',
  },
];

export const PageWhyForests: React.FC<PageWhyForestsProps> = ({
  language,
  onEnterWatch,
  onBack,
}) => {
  const t = translations[language];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState(FOREST_VIDEO_URL);
  const [showUrlEditor, setShowUrlEditor] = useState(false);

  // Ken-Burns auto-rotation every 6 seconds
  useEffect(() => {
    if (customVideoUrl && customVideoUrl.trim() !== '') return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [customVideoUrl]);

  const activeQuote = quotes[quoteIndex];

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const isVideoConfigured = customVideoUrl && customVideoUrl.trim().length > 5;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#101b15] py-10 px-6 text-[#f0fdf4]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Top */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono-code text-[#869e90] hover:text-[#c9d99f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToEntry}</span>
          </button>
          <div className="text-xs font-mono-code text-[#c9d99f]">
            {language === 'hi' ? 'अध्याय 02 / 03 — पारिस्थितिकी' : 'CHAPTER 02 / 03 — CONTEXT'}
          </div>
        </div>

        {/* Section Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182c20] border border-[#2d523e] text-[#c9d99f] text-xs font-mono-code mb-3">
            <span>{t.whyKicker}</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {t.whyHeadline}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a3b8aa] leading-relaxed max-w-3xl">
            {t.whySub}
          </p>
        </div>

        {/* Main Video or Ken-Burns Slideshow Player */}
        <div className="relative rounded-2xl overflow-hidden border border-[#244232] bg-[#0c1611] shadow-2xl aspect-video max-h-[500px]">
          {isVideoConfigured ? (
            customVideoUrl.includes('youtube.com') || customVideoUrl.includes('youtu.be') ? (
              <iframe
                src={customVideoUrl.replace('watch?v=', 'embed/')}
                title="Aravalli Forest Documentary"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={customVideoUrl}
                controls
                className="w-full h-full object-cover"
              />
            )
          ) : (
            // Ken-Burns Photo Slideshow Fallback
            <div className="relative w-full h-full overflow-hidden">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={s.url}
                    alt={s.location}
                    className={`w-full h-full object-cover transition-transform duration-[6500ms] ease-out ${
                      idx === currentSlideIndex ? 'scale-110 translate-x-1' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a120e] via-[#0a120e]/40 to-transparent" />
                </div>
              ))}

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <div className="text-[11px] font-mono-code text-[#e2be82] tracking-wider uppercase mb-1">
                    {slides[currentSlideIndex].location} · {slides[currentSlideIndex].credit}
                  </div>
                  <p className="text-sm sm:text-base font-medium text-white drop-shadow">
                    {language === 'hi'
                      ? slides[currentSlideIndex].captionHi
                      : slides[currentSlideIndex].caption}
                  </p>
                </div>

                {/* Slideshow Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`h-2 rounded-full transition-all ${
                        dotIdx === currentSlideIndex
                          ? 'w-6 bg-[#e2be82]'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Top Mode Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b140f]/80 backdrop-blur-md border border-[#223d2e] text-xs font-mono-code text-[#c9d99f]">
                <Film className="w-3.5 h-3.5 text-[#e2be82]" />
                <span>
                  {language === 'hi' ? 'केन-बर्न्स अरावली स्लाइडशो' : 'Ken-Burns Archival Film Slideshow'}
                </span>
              </div>
            </div>
          )}

          {/* Quick configure toggle */}
          <button
            onClick={() => setShowUrlEditor(!showUrlEditor)}
            className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-[#0b140f]/80 backdrop-blur-md border border-[#223d2e] text-[11px] font-mono-code text-[#869e90] hover:text-[#c9d99f] transition-colors"
          >
            {showUrlEditor ? 'Hide URL Config' : 'Configure Video URL'}
          </button>
        </div>

        {/* Video URL Config Drawer if user clicks */}
        {showUrlEditor && (
          <div className="p-4 rounded-xl bg-[#122219] border border-[#223c2e] space-y-2 text-xs">
            <label className="block text-[#c9d99f] font-mono-code">
              FOREST_VIDEO_URL constant (Paste YouTube or MP4 URL):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or .mp4 link"
                className="flex-1 px-3 py-2 rounded-lg bg-[#0a120e] border border-[#284836] text-white font-mono-code text-xs focus:outline-none focus:border-[#c9d99f]"
              />
              <button
                onClick={() => setCustomVideoUrl('')}
                className="px-3 py-2 rounded-lg bg-[#1f372a] text-[#869e90] hover:text-white"
              >
                Clear (Revert to Slideshow)
              </button>
            </div>
            <p className="text-[11px] text-[#869e90]">
              If empty, GreenGuard displays the Ken-Burns curated Aravalli photography sequence automatically.
            </p>
          </div>
        )}

        {/* Elegant Quote Block with 4 cycling quotes */}
        <div className="relative p-8 rounded-2xl bg-[#14231b]/90 border border-[#284836] shadow-xl overflow-hidden">
          <div className="absolute top-4 right-6 text-[#234231] opacity-40">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#e2be82] uppercase mb-3">
                <Quote className="w-4 h-4" />
                <span>
                  {language === 'hi' ? 'संरक्षण विचार' : 'CONSERVATION PERSPECTIVE'} ({quoteIndex + 1}/4)
                </span>
              </div>
              <blockquote className="font-serif-title text-lg sm:text-xl text-[#f0fdf4] italic leading-relaxed">
                &ldquo;{language === 'hi' ? activeQuote.quoteHi : activeQuote.quote}&rdquo;
              </blockquote>
              <div className="mt-3 text-xs font-mono-code text-[#a3b8aa]">
                — {language === 'hi' ? activeQuote.authorHi : activeQuote.author}
              </div>
            </div>

            <button
              onClick={cycleQuote}
              className="px-4 py-2.5 rounded-xl bg-[#1d3528] hover:bg-[#284938] border border-[#37614a] text-xs font-semibold text-[#c9d99f] flex items-center gap-2 transition-all hover:scale-105 shrink-0 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#e2be82]" />
              <span>{t.cycleQuoteBtn}</span>
            </button>
          </div>
        </div>

        {/* Primary Enter Console Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#869e90] font-mono-code">
            Ready to stand watch over Udaipur sector 4?
          </div>
          <button
            onClick={onEnterWatch}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2a5639] via-[#356d49] to-[#254d33] hover:from-[#356d49] hover:to-[#2e5d3e] text-[#f0fdf4] font-semibold text-base shadow-xl shadow-emerald-950/40 border border-[#4d8664] flex items-center justify-center gap-3 transition-all hover:gap-4 group"
          >
            <span>{t.enterConsoleBtn}</span>
            <ArrowRight className="w-5 h-5 text-[#e2be82] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
