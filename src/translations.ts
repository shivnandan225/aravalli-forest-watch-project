import { Language } from './types';

export const translations = {
  en: {
    // Brand
    brandName: 'GreenGuard',
    brandSub: 'THE ARAVALLI WATCH',
    tagline: 'Detect early. Alert responsibly. Protect forests.',
    demoModeBadge: 'PRACTICE / DEMO MODE',
    demoModeBanner: 'Simple & Honest: Only the map and regional weather are real. Alerts and sensors are practice samples so you can see how humans and AI work together. A human must always check before taking action.',

    // Simple 5-step banner
    howItWorksTitle: 'How GreenGuard Works in 5 Easy Steps',
    howItWorksSub: 'Why your decision matters: AI is only an early helper. A real person must always inspect the forest and make the final call.',
    step1: '1. Sensor Hears a Noise',
    step1Desc: 'A microphone or camera notices something unusual (like a chainsaw or smoke).',
    step2: '2. Asks a Human to Look',
    step2Desc: 'It does not accuse anyone. It simply asks: "Could someone please check this area?"',
    step3: '3. Alerts the Local Patrol',
    step3Desc: 'A message goes to local forest guards. A simple timer starts.',
    step4: '4. Reminds the Supervisor',
    step4Desc: 'If guards are busy or away, the system reminds their supervisor so the alert is not forgotten.',
    step5: '5. Human Makes the Decision',
    step5Desc: 'An officer visits, confirms if it was real or a false alarm, and closes the case.',

    // Page 1 Entry
    heroKicker: 'THE ARAVALLI HILLS · RAJASTHAN, INDIA',
    heroHeadline: 'When we listen to the hills, our future is safe.',
    heroSub: 'Ancient mountains. Living green trees. An easy-to-use early warning system where humans always have the final say.',
    startJourney: 'Next: Why Our Forests Matter →',
    benefit1Title: 'Clean Air for Everyone',
    benefit1Desc: 'Tree leaves and hills can help catch desert dust and keep our cities and villages cooler.',
    benefit2Title: 'Water for Wells and Lakes',
    benefit2Desc: 'Rainwater soaking into the hills can help fill underground aquifers and village drinking wells.',
    benefit3Title: 'Safe Home for Animals',
    benefit3Desc: 'Forest patches can give leopards, birds, and other wildlife a safe place to live and feed.',
    benefit4Title: 'Stops the Desert from Spreading',
    benefit4Desc: 'Tree roots hold the soil tight and can help prevent dry desert sands from blowing into farms.',

    // Page 2 Why Forests Matter
    whyKicker: 'ANCIENT MOUNTAINS · SHARED LIFE',
    whyHeadline: 'The Green Wall That Protects Us All',
    whySub: 'The Aravalli hills stretch across Gujarat, Rajasthan, Haryana, and Delhi. They are an ancient natural shield. When we care for them, they protect millions of families.',
    videoCaption: 'Watch a quick video or look through photos of these historic hills.',
    customVideoPrompt: 'Video is ready or view the photo story below.',
    cycleQuoteBtn: 'Read another thought ↻',
    enterConsoleBtn: 'Open the Forest Watch Console →',
    backToEntry: '← Back to Start',

    // Page 3 Console
    consoleEyebrow: 'FOREST WATCH STATION / FIELD DESK',
    consoleHeadline: 'A Living Forest. A Watchful Community.',
    weatherLabel: 'WEATHER IN THE REGION (OPEN-METEO)',
    weatherDisclaimer: 'Live weather near Udaipur (24.58°N, 73.68°E) from a regional weather service — not a sensor inside the forest.',
    temperature: 'TEMPERATURE',
    humidity: 'HUMIDITY',
    wind: 'WIND SPEED',

    // Navigation Rail
    navMap: 'Forest Map & Pins',
    navAcoustic: 'Sound Warning (Chainsaw / Axe)',
    navCamera: 'Camera Photo Checker',
    navSatellite: 'Satellite Tree-Cover Alerts',
    navEscalations: 'Team Alerts & Reminders',
    navReview: 'Human Decision Queue',
    navCommunity: 'Citizen Observation Form',
    navStats: 'Numbers & Progress',
    navOutbox: 'Sent Messages Outbox',
    navArchitecture: 'How the System Connects',
    runDemoStory: '▶ Play 60-Second Example Story',

    // Core rule badge
    ruleBadge: 'Potential activity detected — human verification required.',

    // Escalation levels (Made very simple!)
    level1Name: 'Level 1: Local Forest Patrol',
    level1Desc: 'The beat guards and community watchers closest to the trees. (First to be notified).',
    level2Name: 'Level 2: Range Supervisor / DFO',
    level2Desc: 'Notified automatically if the local patrol is unable to respond within the timer.',
    level3Name: 'Level 3: Head Forest Office',
    level3Desc: 'Senior authorities notified if nobody has checked the area, ensuring zero missed alerts.',

    // Buttons & Actions
    acknowledge: 'I Checked This Area (Take Action)',
    generateReport: 'Create Simple Summary Report',
    exportAuditCSV: 'Download Timeline Log (CSV)',
    dismiss: 'It Was a False Alarm (Dismiss)',
    verify: 'I Confirmed Tree Cutting (Verify)',
    sendToLevel: 'Forward to Supervisor',
  },
  hi: {
    // Brand
    brandName: 'ग्रीनगार्ड',
    brandSub: 'अरावली वन रक्षा',
    tagline: 'समय पर पहचान। उत्तरदायी चेतावनी। वनों का संरक्षण।',
    demoModeBadge: 'अभ्यास / डेमो मोड',
    demoModeBanner: 'सरल एवं पारदर्शी: केवल नक्शा और क्षेत्रीय मौसम सजीव हैं। सेंसर और अलर्ट अभ्यास के लिए हैं ताकि आप देख सकें कि इंसान और तकनीक मिलकर कैसे काम करते हैं। कोई भी कदम उठाने से पहले इंसान का खुद मौके पर देखना अनिवार्य है।',

    // Simple 5-step banner
    howItWorksTitle: 'ग्रीनगार्ड कैसे काम करता है — 5 आसान कदम',
    howItWorksSub: 'इंसान की भूमिका सबसे जरूरी है: कंप्यूटर सिर्फ आगाह करता है। मौके पर जाकर सही फैसला इंसान ही लेता है।',
    step1: '1. सेंसर ने आवाज सुनी',
    step1Desc: 'माइक्रोफोन या कैमरे ने कोई तेज आवाज (जैसे कुल्हाड़ी या आरा) या धुआं महसूस किया।',
    step2: '2. इंसान से जांच की अपील',
    step2Desc: 'यह किसी पर आरोप नहीं लगाता। यह बस पूछता है: "कृपया कोई जाकर मौके पर देखे?"',
    step3: '3. स्थानीय वन रक्षक को सूचना',
    step3Desc: 'पास के बीट गार्ड को संदेश जाता है और एक सीधा टाइमर शुरू होता है।',
    step4: '4. समय पर जवाब न मिलने पर अफसर को सूचना',
    step4Desc: 'अगर गार्ड गश्त पर व्यस्त हैं, तो सिस्टम अपने आप बड़े अधिकारी को याद दिलाता है ताकि अलर्ट छूटे नहीं।',
    step5: '5. इंसान का अंतिम फैसला',
    step5Desc: 'अधिकारी मौके पर जाकर देखता है — सचमुच पेड़ कटे या सिर्फ ट्रैक्टर की आवाज थी — और डायरी में दर्ज करता है।',

    // Page 1 Entry
    heroKicker: 'अरावली पर्वतमाला · राजस्थान, भारत',
    heroHeadline: 'जब हम पहाड़ों की सुनते हैं, तभी हमारा कल सुरक्षित है।',
    heroSub: 'प्राचीन पहाड़ियां। हरे-भरे जंगल। एक बेहद आसान पूर्व-चेतावनी प्रणाली जहां हर फैसले में इंसान की जांच सबसे आगे है।',
    startJourney: 'आगे बढ़ें: हमारे जंगल क्यों जरूरी हैं →',
    benefit1Title: 'सबके लिए साफ हवा',
    benefit1Desc: 'पहाड़ और पेड़ों के पत्ते धूल-तूफानों को रोकते हैं और हमारे शहरों व गांवों में गर्मी कम करने में मदद करते हैं।',
    benefit2Title: 'कुओं और झीलों के लिए पानी',
    benefit2Desc: 'पहाड़ों में रिसने वाला बारिश का पानी जमीन के नीचे पहुंचता है और गांव के पीने के कुओं को भरा रखता है।',
    benefit3Title: 'जीव-जंतुओं का सुरक्षित घर',
    benefit3Desc: 'तेंदुओं, हिरणों और पक्षियों को सुरक्षित रहने और भोजन खोजने की खुली जगह मिलती है।',
    benefit4Title: 'रेगिस्तान को आगे बढ़ने से रोकता है',
    benefit4Desc: 'पेड़ों की मजबूत जड़ें मिट्टी को बांधकर रखती हैं और थार की रेत को खेतों पर जमने से रोकती हैं।',

    // Page 2 Why Forests Matter
    whyKicker: 'प्राचीन पहाड़ · हमारी साझा धरोहर',
    whyHeadline: 'हरी दीवार जो हम सबकी रक्षा करती है',
    whySub: 'अरावली पर्वत गुजरात से दिल्ली तक फैले हैं। यह हमारी कुदरती ढाल है। जब हम इनकी हिफाजत करते हैं, तो करोड़ों परिवारों का जीवन सुरक्षित रहता है।',
    videoCaption: 'एक छोटा वीडियो देखें या अरावली की सुंदर तस्वीरें देखें।',
    customVideoPrompt: 'वीडियो तैयार है अथवा नीचे दी गई फोटो कहानी देखें।',
    cycleQuoteBtn: 'एक और विचार पढ़ें ↻',
    enterConsoleBtn: 'वन निगरानी डेस्क खोलें →',
    backToEntry: '← शुरुआत पर वापस जाएं',

    // Page 3 Console
    consoleEyebrow: 'वन निगरानी डेस्क / फील्ड कंट्रोल',
    consoleHeadline: 'सजीव अरावली पहाड़। सजग वन रक्षक और ग्रामीण।',
    weatherLabel: 'क्षेत्र का मौसम (ओपन-मेटियो)',
    weatherDisclaimer: 'उदयपुर (24.58°N, 73.68°E) के मौसम मॉडल का अनुमान — यह जंगल के अंदर का थर्मामीटर नहीं है।',
    temperature: 'तापमान',
    humidity: 'हवा में नमी',
    wind: 'हवा की गति',

    // Navigation Rail
    navMap: 'जंगल का नक्शा और बिंदु',
    navAcoustic: 'आवाज चेतावनी (आरा / कुल्हाड़ी)',
    navCamera: 'कैमरा फोटो जांच',
    navSatellite: 'उपग्रह से पेड़ कटने की सूचना',
    navEscalations: 'अलर्ट एवं अफसरों को सूचना',
    navReview: 'इंसानी फैसले की सूची',
    navCommunity: 'नागरिक सूचना डायरी',
    navStats: 'आंकड़े और प्रगति',
    navOutbox: 'भेजे गए संदेशों का आउटबॉक्स',
    navArchitecture: 'प्रणाली कैसे जुड़ी है',
    runDemoStory: '▶ 60 सेकंड में पूरा उदाहरण देखें',

    // Core rule badge
    ruleBadge: 'संभावित गतिविधि पहचानी गई — मानवीय सत्यापन अनिवार्य है।',

    // Escalation levels (Very easy Hindi)
    level1Name: 'स्तर 1: स्थानीय बीट गार्ड (जंगल के पास)',
    level1Desc: 'सबसे पहले मौके के पास मौजूद वन रक्षक और ग्रामीणों को सूचना जाती है।',
    level2Name: 'स्तर 2: रेंज अधिकारी / डीएफओ',
    level2Desc: 'अगर गार्ड तय समय में जवाब नहीं दे पाते, तो तुरंत उनके बड़े अधिकारी को सूचना जाती है।',
    level3Name: 'स्तर 3: मुख्य वन कार्यालय (मुख्यालय)',
    level3Desc: 'अगर कहीं से जांच नहीं हुई, तो मुख्यालय को सूचना जाती है ताकि कोई पेड़ बिना जांचे न कटे।',

    // Buttons & Actions
    acknowledge: 'मैंने मौके पर जाकर देखा (कदम उठाएं)',
    generateReport: 'आसान शब्दों में रिपोर्ट बनाएं',
    exportAuditCSV: 'समयवार रिकॉर्ड डाउनलोड करें (CSV)',
    dismiss: 'गलत संकेत था — कोई खतरा नहीं (खारिज करें)',
    verify: 'हां, पेड़ कटने की पुष्टि हुई (पुष्टि करें)',
    sendToLevel: 'बड़े अधिकारी को भेजें',
  },
};

export const quotes = [
  {
    quote: 'The Aravalli is not just rocks; it is our green wall holding back the Thar desert from covering our farms and homes.',
    quoteHi: 'अरावली सिर्फ पत्थर नहीं है; यह वह हरी दीवार है जो थार रेगिस्तान को हमारे खेतों और घरों पर फैलने से रोकती है।',
    author: 'Traditional Mewar Conservation Wisdom',
    authorHi: 'मेवाड़ की पारंपरिक पर्यावरण सूझबूझ',
  },
  {
    quote: 'Protecting a tree on top of the hill means protecting drinking water in village wells ten miles away.',
    quoteHi: 'पहाड़ी पर एक पेड़ बचाना, नीचे घाटी में दस मील दूर गांव के पीने के कुएं में पानी बचाना है।',
    author: 'Village Elder, Udaipur Foothills',
    authorHi: 'ग्राम वृद्ध, उदयपुर अरावली तलहटी',
  },
  {
    quote: 'Computers can tell us that something made a sound; but only a caring human who walks into the forest can save a tree.',
    quoteHi: 'कंप्यूटर सिर्फ इतना बता सकता है कि कोई आवाज आई; लेकिन पेड़ तभी बचता है जब कोई इंसान मौके पर जाकर देखता है।',
    author: 'GreenGuard Community Principle',
    authorHi: 'ग्रीनगार्ड का मूल सिद्धांत',
  },
  {
    quote: 'An unanswered alert is just a lost opportunity. An alert answered by a watchful team is a living forest saved.',
    quoteHi: 'अलर्ट पर ध्यान न देना लापरवाही है; लेकिन समय पर मौके पर पहुंचकर देखना ही जंगल को जिंदा रखता है।',
    author: 'Forest Ranger Motto',
    authorHi: 'वन रक्षक ध्येय वाक्य',
  },
];
