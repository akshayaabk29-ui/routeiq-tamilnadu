/**
 * RouteIQ Conversational Voice Intelligence & Multi-Language Speech Engine
 * Supports Speech Recognition, Speech Synthesis, Web Audio voice chime fallbacks,
 * and comprehensive AI transit responses across:
 * English, Tamil (தமிழ்), Hindi (हिंदी), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Telugu (తెలుగు)
 */

import { AppLanguage } from '../types';
import { playChimeSound, playAlertSound } from './soundEffects';

export const LANGUAGE_SPEECH_CODES: Record<AppLanguage, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  te: 'te-IN',
};

// Check browser recognition support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Text-to-speech speaker that speaks aloud transit advice in the selected language.
 * Employs fallback voice tones when native speech engines are restricted.
 */
export function speakTransitAdvice(
  text: string,
  lang: AppLanguage = 'en',
  onStart?: () => void,
  onEnd?: () => void
): void {
  // Always play pleasant assistant affirmative chime
  playChimeSound();

  if (!isSpeechSynthesisSupported()) {
    onStart?.();
    setTimeout(() => onEnd?.(), 2500);
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    // Clean emojis and markdown markers before synthesis
    const cleanText = text
      .replace(/[⭐⚠️💡🛡️🎙️🔊₹%·\n#*]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANGUAGE_SPEECH_CODES[lang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = () => {
      onEnd?.();
    };

    // Pick matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) =>
        v.lang === utterance.lang ||
        v.lang.replace('_', '-').startsWith(lang) ||
        v.lang.startsWith(lang) ||
        (lang === 'en' && (v.name.includes('India') || v.lang.includes('IN')))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    // Safety fallback: if voices not loaded yet, wait for onvoiceschanged
    if (voices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          const loadedVoices = window.speechSynthesis.getVoices();
          const match = loadedVoices.find(
            (v) =>
              v.lang === utterance.lang ||
              v.lang.replace('_', '-').startsWith(lang) ||
              v.lang.startsWith(lang)
          );
          if (match) utterance.voice = match;
          window.speechSynthesis.speak(utterance);
        } catch {
          onEnd?.();
        }
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    onEnd?.();
  }
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export interface SpeechRecognitionResultListener {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (err: string) => void;
  onEnd: () => void;
}

/**
 * Listen to microphone input and convert speech to text with robust fallback handling.
 */
export function startVoiceRecognition(
  lang: AppLanguage,
  listeners: SpeechRecognitionResultListener
): { stop: () => void } {
  const SpeechRecognitionClass =
    (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
    (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    listeners.onError('Microphone not directly available in this browser window. You can tap quick voice questions or try the voice simulation.');
    listeners.onEnd();
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANGUAGE_SPEECH_CODES[lang] || 'en-IN';

    let hasReceivedFinal = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        hasReceivedFinal = true;
        listeners.onTranscript(final.trim(), true);
      } else if (interim) {
        listeners.onTranscript(interim.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      const errName = event.error || 'speech_error';
      if (errName === 'not-allowed' || errName === 'permission-denied') {
        listeners.onError('Microphone permission blocked by browser. Please tap any suggested voice query below or use Voice Simulation.');
      } else {
        listeners.onError(`Voice input notice (${errName}). Feel free to tap query chips or type.`);
      }
      listeners.onEnd();
    };

    recognition.onend = () => {
      listeners.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err: any) {
    listeners.onError('Microphone access is restricted in this frame. Tap any voice suggestion below or use voice simulation.');
    listeners.onEnd();
    return { stop: () => {} };
  }
}

/**
 * RouteIQ Conversational Assistant Intelligence
 * Generates natural responses based on transit questions in the selected language.
 * Covers:
 * 1. Crowd predictions & recommendation (Route 18 vs 12)
 * 2. FC (Fitness Certificate) expiry date & vehicle quality grade & cabin AQI
 * 3. Online payment (UPI/QR) & 100% Missed Bus refund policy
 * 4. All 32 Tamil Nadu districts & interstate routes & maps
 * 5. Live bus breakdowns & disruptions
 * 6. What-if departure time shifts
 */
export function getSmartAssistantResponse(
  query: string,
  lang: AppLanguage
): { text: string; speakText: string; actionSuggestion?: string } {
  const q = query.toLowerCase();

  // 1. TAMIL (தமிழ்)
  if (lang === 'ta') {
    // FC Date & Quality
    if (q.includes('fc') || q.includes('சான்றிதழ்') || q.includes('தகுதி') || q.includes('தர') || q.includes('quality') || q.includes('காற்று') || q.includes('aqi') || q.includes('தூய்மை')) {
      return {
        text: '🛡️ FC & வாகன தரம்: ஸ்மார்ட்ஃப்ளோ பேருந்துகள் 100% RTO FC தகுதி சான்றிதழ் பெற்றவை! \n• பாதை 18: FC காலாவதி 12-Jan-2029 (A+ பிரீமியம் தரம், கேபின் AQI 28 - தூய்மையான காற்று)\n• பாதை 15: FC காலாவதி 18-Mar-2028 (A தரம், கேபின் AQI 41)\n• பாதை 12: FC காலாவதி 24-Nov-2027 (B+ தரம், கேபின் AQI 52)',
        speakText: 'ஸ்மார்ட்ஃப்ளோ பேருந்துகள் நூறு சதவீதம் எஃப்சி தகுதி சான்றிதழ் பெற்றவை. பாதை பதினெட்டு ஏ பிளஸ் பிரீமியம் தரம் கொண்டது.',
        actionSuggestion: 'details',
      };
    }

    // Missed Bus Refund Policy & Online Payment
    if (q.includes('ரீஃபண்ட்') || q.includes('பணம் திரும்ப') || q.includes('தவறவிட்டால்') || q.includes('refund') || q.includes('செலுத்து') || q.includes('payment') || q.includes('upi') || q.includes('டிக்கெட்')) {
      return {
        text: '💳 ஆன்லைன் கட்டணம் & மிஸ்ஸ்ட் பஸ் ரீஃபண்ட்:\n• ஜிபே, போன்பே, பேடிஎம் UPI மூலம் 1 வினாடியில் QR டிக்கெட் பெறலாம்.\n• 🛡️ ரீஃபண்ட் பாலிசி: பேருந்தை தவறவிட்டால் 100% உடனடி UPI ரீஃபண்ட் உத்தரவாதம்! அல்லது அடுத்த பேருந்தில் இலவசமாக பயணம் மாற்றிக்கொள்ளலாம்.',
        speakText: 'பேருந்தை தவறவிட்டால் நூறு சதவீதம் உடனடி ரீஃபண்ட் உத்தரவாதம் உண்டு அல்லது அடுத்த பேருந்தில் இலவசமாக பயணிக்கலாம்.',
        actionSuggestion: 'compare',
      };
    }

    // 32 Districts & Maps
    if (q.includes('வரைபடம்') || q.includes('மாவட்டம்') || q.includes('சென்னை') || q.includes('மதுரை') || q.includes('கோவை') || q.includes('சேலம்') || q.includes('திருச்சி') || q.includes('32') || q.includes('map') || q.includes('district')) {
      return {
        text: '🗺️ 32 தமிழக மாவட்டங்கள் & வரைபடம்:\nஸ்மார்ட்ஃப்ளோ தமிழ்நாட்டின் அனைத்து 32 மாவட்டங்களையும் (சென்னை, கோவை, மதுரை, திருச்சி, சேலம், நெல்லை, ஊட்டி உட்பட) மற்றும் கர்நாடகா (பெங்களூரு), கேரளா (பாலக்காடு, கொச்சி), ஆந்திரா (திருப்பதி) வழித்தடங்களை நேரலை வரைபடத்தில் இணைக்கிறது!',
        speakText: 'ஸ்மார்ட்ஃப்ளோ தமிழ்நாட்டின் முப்பத்திரண்டு மாவட்டங்களுக்கும் நேரலை பேருந்து வரைபடத்தை வழங்குகிறது.',
        actionSuggestion: 'districts',
      };
    }

    // Crowd & Recommendation
    if (q.includes('கூட்டம்') || q.includes('குறைந்த') || q.includes('பாதை 18') || q.includes('18') || q.includes('crowd') || q.includes('பரிந்துரை')) {
      return {
        text: '⭐ பாதை 18 மிகவும் பரிந்துரைக்கப்படுகிறது! இதில் 32% மட்டுமே நெரிசல் உள்ளது (இருக்கைகள் எளிதாக கிடைக்கும்). பயண நேரம் 31 நிமிடம், கட்டணம் ₹18 (மாணவர்களுக்கு ₹9). FC தகுதி: Grade A+.',
        speakText: 'பாதை பதினெட்டு பரிந்துரைக்கப்படுகிறது. இதில் முப்பத்து இரண்டு சதவீதம் மட்டுமே கூட்டம் உள்ளது, இருக்கைகள் கிடைக்கும்.',
        actionSuggestion: 'compare',
      };
    }

    // Route 12 Rush
    if (q.includes('பாதை 12') || q.includes('12') || q.includes('நெரிசல்') || q.includes('ஏன்')) {
      return {
        text: 'பாதை 12 மாலை 5:00 மணிக்கு 91% தீவிர நெரிசலில் உள்ளது. கல்லூரி முடியும் நேரம் (+15%) மற்றும் மழை காரணமாக அதிக கூட்டம் உள்ளது. மாற்று பாதையான பாதை 18-ஐ தேர்வு செய்யவும்.',
        speakText: 'பாதை பன்னிரண்டு தொண்ணூற்றியொரு சதவீதம் தீவிர நெரிசலில் உள்ளது. பாதை பதினெட்டிற்கு மாறவும்.',
        actionSuggestion: 'compare',
      };
    }

    // Breakdown & Disruptions
    if (q.includes('பழுது') || q.includes('விபத்து') || q.includes('breakdown') || q.includes('தடை') || q.includes('எச்சரிக்கை')) {
      return {
        text: '⚠️ நேரலை எச்சரிக்கை: பாதை 12 பேருந்து (TN 38 N 2490) ஹோப் காலேஜ் அருகே ரேடியேட்டர் சூடாகி நின்றுள்ளது. மாற்று பேருந்து அனுப்பப்பட்டுள்ளது. பாதை 18 பரிந்துரைக்கப்படுகிறது.',
        speakText: 'எச்சரிக்கை. பாதை பன்னிரண்டு பேருந்து ஹோப் காலேஜ் அருகே பழுதடைந்துள்ளது. பாதை பதினெட்டு பரிந்துரைக்கப்படுகிறது.',
        actionSuggestion: 'disruptions',
      };
    }

    // What if / Time shift
    if (q.includes('தாமதம்') || q.includes('நேரம்') || q.includes('6:30') || q.includes('மாலை')) {
      return {
        text: '💡 மாலை 5:00 மணிக்கு பதிலாக 6:30 மணிக்கு புறப்பட்டால், கூட்ட நெரிசல் 91%-லிருந்து 47%-ஆக குறையும் (44% நெரிசல் சேமிப்பு)!',
        speakText: 'மாலை ஆறு முப்பது மணிக்கு சென்றால் கூட்டம் நாற்பத்து நான்கு சதவீதம் குறையும்.',
        actionSuggestion: 'whatif',
      };
    }

    return {
      text: 'வணக்கம்! நான் ஸ்மார்ட்ஃப்ளோ AI குரல் உதவியாளர். குறைந்த கூட்டம் உள்ள பேருந்து, 32 மாவட்ட வரைபடங்கள், எஃப்சி சான்றிதழ் தரம், ஆன்லைன் கட்டணம் மற்றும் ரீஃபண்ட் பாலிசியை என்னிடம் கேட்கலாம்.',
      speakText: 'வணக்கம்! ஸ்மார்ட்ஃப்ளோ உங்களுக்கு உதவ தயாராக உள்ளது.',
    };
  }

  // 2. HINDI (हिन्दी)
  if (lang === 'hi') {
    if (q.includes('fc') || q.includes('फिटनेस') || q.includes('क्वालिटी') || q.includes('quality') || q.includes('aqi') || q.includes('सफाई')) {
      return {
        text: '🛡️ FC और वाहन गुणवत्ता: सभी बसें 100% RTO FC प्रमाणित हैं!\n• रूट 18: FC वैधता 12-Jan-2029 (A+ प्रीमियम ग्रेड, इनडोर AQI 28 स्वच्छ)\n• रूट 15: FC वैधता 18-Mar-2028 (A ग्रेड, AQI 41)\n• रूट 12: FC वैधता 24-Nov-2027 (B+ ग्रेड, AQI 52)',
        speakText: 'स्मार्टफ्लो की सभी बसें सौ प्रतिशत एफसी प्रमाणित हैं। रूट अठारह सबसे सुरक्षित व स्वच्छ है।',
        actionSuggestion: 'details',
      };
    }

    if (q.includes('रिफंड') || q.includes('पैसे') || q.includes('छूट') || q.includes('refund') || q.includes('payment') || q.includes('upi') || q.includes('किराया')) {
      return {
        text: '💳 ऑनलाइन भुगतान और मिस्ड बस रिफंड पॉलिसी:\n• UPI (GPay, PhonePe, Paytm) से 1 सेकंड में टिकट बुक करें।\n• 🛡️ यदि बस छूट जाती है तो 100% तुरंत रिफंड गारंटी या अगली बस में मुफ्त ट्रांसफर!',
        speakText: 'बस छूट जाने पर सौ प्रतिशत तुरंत रिफंड गारंटी है या अगली बस में फ्री ट्रांसफर मिलेगा।',
        actionSuggestion: 'compare',
      };
    }

    if (q.includes('मानचित्र') || q.includes('नक्शा') || q.includes('मैप') || q.includes('map') || q.includes('जिला') || q.includes('district') || q.includes('चेन्नई')) {
      return {
        text: '🗺️ 32 तमिलनाडु जिले और अंतरराज्यीय नक्शे:\nस्मार्टफ्लो सभी 32 जिलों (चेन्नई, कोयंबटूर, मदुरै, सलेम, त्रिची, तिरुनेलवेली आदि) और कर्नाटक (बेंगलुरु), केरल (कोच्चि), आंध्र प्रदेश (तिरुपति) के लाइव मैप प्रदान करता है!',
        speakText: 'स्मार्टफ्लो सभी बत्तीस जिलों और अंतरराज्यीय मार्गों का लाइव मानचित्र प्रदान करता है।',
        actionSuggestion: 'districts',
      };
    }

    if (q.includes('भीड़') || q.includes('कम') || q.includes('18') || q.includes('रूट 18') || q.includes('crowd')) {
      return {
        text: '⭐ रूट 18 सबसे अनुशंसित है! इसमें केवल 32% अनुमानित भीड़ है और सीटें आसानी से उपलब्ध हैं। किराया ₹18 (छात्रों के लिए ₹9)। FC ग्रेड A+ प्रीमियम।',
        speakText: 'रूट अठारह सबसे अच्छा विकल्प है। इसमें केवल बत्तीस प्रतिशत भीड़ है और सीटें उपलब्ध हैं।',
        actionSuggestion: 'compare',
      };
    }

    if (q.includes('खराबी') || q.includes('दुर्घटना') || q.includes('ब्रेकडाउन') || q.includes('breakdown')) {
      return {
        text: '⚠️ रूट 12 बस होप कॉलेज के पास ओवरहीटिंग के कारण रुकी है। इसके स्थान पर रूट 18 बस लें।',
        speakText: 'सावधान। होप कॉलेज के पास बस में तकनीकी खराबी है। रूट अठारह का उपयोग करें।',
        actionSuggestion: 'disruptions',
      };
    }

    return {
      text: 'नमस्ते! मैं स्मार्टफ्लो AI वॉयस असिस्टेंट हूँ। आप मुझसे कम भीड़ वाली बस, 32 जिला मानचित्र, एफसी वाहन गुणवत्ता या मिस्ड बस रिफंड के बारे में पूछ सकते हैं।',
      speakText: 'नमस्ते! स्मार्टफ्लो वॉयस असिस्टेंट आपकी सेवा में तैयार है।',
    };
  }

  // 3. KANNADA (ಕನ್ನಡ)
  if (lang === 'kn') {
    if (q.includes('fc') || q.includes('ಗುಣಮಟ್ಟ') || q.includes('quality') || q.includes('ದಿನಾಂಕ')) {
      return {
        text: '🛡️ FC & ವಾಹನ ಗುಣಮಟ್ಟ: 100% RTO FC ಪ್ರಮಾಣೀಕೃತ ಬಸ್‌ಗಳು!\n• ಮಾರ್ಗ 18: FC ಮುಕ್ತಾಯ 12-Jan-2029 (A+ ಪ್ರೀಮಿಯಂ, AQI 28)\n• ಮಾರ್ಗ 15: FC ಮುಕ್ತಾಯ 18-Mar-2028 (A ಗ್ರೇಡ್, AQI 41)\n• ಮಾರ್ಗ 12: FC ಮುಕ್ತಾಯ 24-Nov-2027 (B+ ಗ್ರೇಡ್, AQI 52)',
        speakText: 'ಎಲ್ಲಾ ಬಸ್‌ಗಳು ಎಫ್‌ಸಿ ಪ್ರಮಾಣೀಕೃತವಾಗಿವೆ. ಮಾರ್ಗ ಹದಿನೆಂಟು ಅತ್ಯುತ್ತಮ ಗುಣಮಟ್ಟದ್ದಾಗಿದೆ.',
        actionSuggestion: 'details',
      };
    }

    if (q.includes('ಮರುಪಾವತಿ') || q.includes('refund') || q.includes('ಹಣ') || q.includes('payment') || q.includes('upi')) {
      return {
        text: '💳 ಆನ್‌ಲೈನ್ ಪಾವತಿ & ಮಿಸ್ಡ್ ಬಸ್ ಮರುಪಾವತಿ:\n• UPI ಮೂಲಕ ತಕ್ಷಣ ಡಿಜಿಟಲ್ ಟಿಕೆಟ್ ಪಡೆಯಿರಿ.\n• ಬಸ್ ತಪ್ಪಿಹೋದರೆ 100% ತಕ್ಷಣ ಮರುಪಾವತಿ ಅಥವಾ ಮುಂದಿನ ಬಸ್‌ನಲ್ಲಿ ಉಚಿತ ಪ್ರಯಾಣ ಗ್ಯಾರಂಟಿ!',
        speakText: 'ಬಸ್ ತಪ್ಪಿದರೆ ನೂರು ಶೇಕಡಾ ಮರುಪಾವತಿ ಗ್ಯಾರಂಟಿ ಇದೆ.',
        actionSuggestion: 'compare',
      };
    }

    if (q.includes('ನಕ್ಷೆ') || q.includes('ಜಿಲ್ಲೆ') || q.includes('map') || q.includes('district') || q.includes('ಬೆಂಗಳೂರು')) {
      return {
        text: '🗺️ 32 ತಮಿಳುನಾಡು ಜಿಲ್ಲೆಗಳು & ಬೆಂಗಳೂರು ಅಂತಾರಾಜ್ಯ ನಕ್ಷೆ ಲಭ್ಯವಿದೆ!',
        speakText: 'ಎಲ್ಲಾ ಮೂವತ್ತೆರಡು ಜಿಲ್ಲೆಗಳ ಲೈವ್ ನಕ್ಷೆ ಲಭ್ಯವಿದೆ.',
        actionSuggestion: 'districts',
      };
    }

    if (q.includes('ದಟ್ಟಣೆ') || q.includes('ಕಡಿಮೆ') || q.includes('18') || q.includes('route 18')) {
      return {
        text: '⭐ ಮಾರ್ಗ 18 ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ! ಕೇವಲ 32% ಜನದಟ್ಟಣೆ ಇದ್ದು ಆಸನಗಳು ಸುಲಭವಾಗಿ ಲಭ್ಯವಿದೆ. ದರ ₹18 (ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ₹9).',
        speakText: 'ಮಾರ್ಗ ಹದಿನೆಂಟು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಇದರಲ್ಲಿ ಕೇವಲ ಮೂವತ್ತೆರಡು ಶೇಕಡಾ ದಟ್ಟಣೆ ಇದೆ.',
        actionSuggestion: 'compare',
      };
    }

    return {
      text: 'ನಮಸ್ಕಾರ! ನಾನು ಸ್ಮಾರ್ಟ್‌ಫ್ಲೋ AI ಧ್ವನಿ ಸಹಾಯಕ. ಕಡಿಮೆ ದಟ್ಟಣೆಯ ಬಸ್, ಟಿಕೆಟ್ ದರ, ಎಫ್‌ಸಿ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು 32 ಜಿಲ್ಲೆಗಳ ಮಾರ್ಗಗಳನ್ನು ಕೇಳಬಹುದು.',
      speakText: 'ನಮಸ್ಕಾರ! ಸ್ಮಾರ್ಟ್‌ಫ್ಲೋ ಧ್ವನಿ ಸಹಾಯಕ ನಿಮ್ಮ ಸೇವೆಗೆ ಸಿದ್ಧವಾಗಿದೆ.',
    };
  }

  // 4. MALAYALAM (മലയാളം)
  if (lang === 'ml') {
    if (q.includes('fc') || q.includes('ക്വാളിറ്റി') || q.includes('quality') || q.includes('തീയതി')) {
      return {
        text: '🛡️ FC & വാഹന ഗുണനിലവാരം: 100% FC സർട്ടിഫൈഡ് ബസുകൾ!\n• റൂട്ട് 18: FC തീയതി 12-Jan-2029 (A+ ഗ്രേഡ്, ഇൻഡോർ AQI 28)\n• റൂട്ട് 15: FC തീയതി 18-Mar-2028 (A ഗ്രേഡ്, AQI 41)\n• റൂട്ട് 12: FC തീയതി 24-Nov-2027 (B+ ഗ്രേഡ്, AQI 52)',
        speakText: 'എല്ലാ ബസുകളും എഫ്‌സി സർട്ടിഫൈഡ് ആണ്. റൂട്ട് പതിനെട്ട് പ്രീമിയം ഗുണനിലവാരമുള്ളതാണ്.',
        actionSuggestion: 'details',
      };
    }

    if (q.includes('റീഫണ്ട്') || q.includes('refund') || q.includes('പണം') || q.includes('payment') || q.includes('upi')) {
      return {
        text: '💳 ഓൺലൈൻ പേയ്‌മെന്റ് & മിസ്ഡ് ബസ് റീഫണ്ട്:\n• UPI വഴി 1 സെക്കൻഡിൽ QR ടിക്കറ്റ് ലഭിക്കും.\n• ബസ് മിസ്സായാൽ 100% ഇൻസ്റ്റന്റ് റീഫണ്ട് അല്ലെങ്കിൽ അടുത്ത ബസിൽ സൗജന്യ യാത്ര!',
        speakText: 'ബസ് മിസ്സായാൽ നൂറു ശതമാനം റീഫണ്ട് ഉറപ്പാണ്.',
        actionSuggestion: 'compare',
      };
    }

    if (q.includes('ഭൂപടം') || q.includes('മാപ്പ്') || q.includes('ജില്ല') || q.includes('map') || q.includes('പാലക്കാട്') || q.includes('കൊച്ചി')) {
      return {
        text: '🗺️ 32 തമിഴ്നാട് ജില്ലകളും കേരള (പാലക്കാട്, കൊച്ചി) അന്തർസംസ്ഥാന ഭൂപടങ്ങളും ലഭ്യമാണ്!',
        speakText: 'എല്ലാ ജില്ലകളുടെയും ഭൂപടങ്ങൾ ലഭ്യമാണ്.',
        actionSuggestion: 'districts',
      };
    }

    if (q.includes('തിരക്ക്') || q.includes('കുറഞ്ഞ') || q.includes('18') || q.includes('route 18')) {
      return {
        text: '⭐ റൂട്ട് 18 വളരെ ശുപാർശ ചെയ്യുന്നു! ഇതിൽ 32% മാത്രമേ തിരക്കുള്ളൂ, സീറ്റുകൾ ലഭ്യമാണ്. നിരക്ക് ₹18 (വിദ്യാർത്ഥികൾക്ക് ₹9).',
        speakText: 'റൂട്ട് പതിനെട്ട് ശുപാർശ ചെയ്യുന്നു. ഇതിൽ തിരക്ക് വളരെ കുറവാണ്.',
        actionSuggestion: 'compare',
      };
    }

    return {
      text: 'നമസ്കാരം! ഞാൻ സ്മാർട്ട്ഫ്ലോ AI വോയ്‌സ് അസിസ്റ്റൻ്റാണ്. തിരക്ക് കുറഞ്ഞ ബസ്, ടിക്കറ്റ് നിരക്കുകൾ, എഫ് സി സർട്ടിഫിക്കറ്റ്, ലൈവ് തകരാറുകൾ എന്നിവ ചോദിക്കാം.',
      speakText: 'നമസ്കാരം! സ്മാർട്ട്ഫ്ലോ വോയ്‌സ് അസിസ്റ്റൻ്റ് തയ്യാറാണ്.',
    };
  }

  // 5. TELUGU (తెలుగు)
  if (lang === 'te') {
    if (q.includes('fc') || q.includes('క్వాలిటీ') || q.includes('quality') || q.includes('తేదీ')) {
      return {
        text: '🛡️ FC & వాహన నాణ్యత: 100% FC సర్టిఫైడ్ బస్సులు!\n• రూట్ 18: FC గడువు 12-Jan-2029 (A+ ప్రీమియం, AQI 28)\n• రూట్ 15: FC గడువు 18-Mar-2028 (A గ్రేడ్, AQI 41)\n• రూట్ 12: FC గడువు 24-Nov-2027 (B+ గ్రేడ్, AQI 52)',
        speakText: 'అన్ని బస్సులు ఎఫ్‌సి సర్టిఫైడ్. రూట్ పద్దెనిమిది అత్యుత్తమ నాణ్యత కలిగి ఉంది.',
        actionSuggestion: 'details',
      };
    }

    if (q.includes('రీఫండ్') || q.includes('refund') || q.includes('డబ్బులు') || q.includes('payment') || q.includes('upi')) {
      return {
        text: '💳 ఆన్‌లైన్ పేమెంట్ & మిస్డ్ బస్ రీఫండ్:\n• UPI ద్వారా తక్షణ QR టికెట్ పొందండి.\n• బస్సు మిస్ అయితే 100% తక్షణ రీఫండ్ లేదా తర్వాతి బస్సులో ఉచిత ప్రయాణం గ్యారంటీ!',
        speakText: 'బస్సు మిస్ అయితే నూరు శాతం రీఫండ్ గ్యారంటీ ఉంది.',
        actionSuggestion: 'compare',
      };
    }

    if (q.includes('మ్యాప్') || q.includes('జిల్లా') || q.includes('map') || q.includes('తిరుపతి')) {
      return {
        text: '🗺️ 32 తమిళనాడు జిల్లాలు & తిరుపతి అంతర్రాష్ట్ర మ్యాప్‌లు అందుబాటులో ఉన్నాయి!',
        speakText: 'అన్ని జిల్లాల లైవ్ మ్యాప్‌లు సిద్ధంగా ఉన్నాయి.',
        actionSuggestion: 'districts',
      };
    }

    if (q.includes('రద్దీ') || q.includes('తక్కువ') || q.includes('18') || q.includes('route 18')) {
      return {
        text: '⭐ రూట్ 18 చాలా అనుకూలమైనది! ఇందులో కేవలం 32% మాత్రమే రద్దీ ఉంది, సీట్లు అందుబాటులో ఉన్నాయి. ఛార్జీ ₹18 (విద్యార్థులకు ₹9).',
        speakText: 'రూట్ పద్దెనిమిది సిఫార్సు చేయబడింది. ఇందులో రద్దీ చాలా తక్కువగా ఉంది.',
        actionSuggestion: 'compare',
      };
    }

    return {
      text: 'నమస్కారం! నేను స్మార్ట్‌ఫ్లో AI వాయిస్ అసిస్టెంట్‌ని. తక్కువ రద్దీ గల బస్సులు, టికెట్ ఛార్జీలు, FC సర్టిఫికెట్, రీఫండ్ పాలసీ గురించి నన్ను అడగవచ్చు.',
      speakText: 'నమస్కారం! స్మార్ట్‌ఫ్లో వాయిస్ అసిస్టెంట్ సిద్ధంగా ఉంది.',
    };
  }

  // 6. ENGLISH (Default)
  // FC Date & Vehicle Quality
  if (q.includes('fc') || q.includes('fitness') || q.includes('certificate') || q.includes('expiry') || q.includes('quality') || q.includes('clean') || q.includes('aqi')) {
    return {
      text: '🛡️ Bus FC & Fleet Quality Details:\n• Route 18 (Volvo AC): FC Expiry 12-Jan-2029 · Status: Inspected & Passed · Quality: Grade A+ (Premium) · Cabin AQI: 28 (Clean Air) · Sanitization: 4.9/5\n• Route 15 (Deluxe): FC Expiry 18-Mar-2028 · Status: Certified Valid · Quality: Grade A · Cabin AQI: 41\n• Route 12 (Ordinary): FC Expiry 24-Nov-2027 · Status: Certified Valid · Quality: Grade B+ · Cabin AQI: 52\nAll active transit buses are AIS-140 GPS and RTO Fitness certified.',
      speakText: 'All buses are one hundred percent RTO fitness certificate certified. Route 18 has valid FC until January 2029 with Grade A plus premium cleanliness.',
      actionSuggestion: 'details',
    };
  }

  // Missed Bus Refund Policy & Online Payment
  if (q.includes('refund') || q.includes('miss') || q.includes('missed') || q.includes('policy') || q.includes('upi') || q.includes('payment') || q.includes('fare') || q.includes('ticket') || q.includes('money')) {
    return {
      text: '💳 Online Payment & 100% Missed Bus Refund Policy:\n• Instant UPI payments supported via Google Pay, PhonePe, and Paytm with instant encrypted QR tickets.\n• 🛡️ Missed Bus Protection Guarantee: If you miss your scheduled bus due to delay, congestion, or schedule mismatch, you can claim 100% instant UPI refund within 60 minutes or reschedule to the next bus completely free!',
      speakText: 'RouteIQ provides 100 percent missed bus refund protection. If you miss your bus, you get an instant refund or free rebooking on the next bus.',
      actionSuggestion: 'compare',
    };
  }

  // 32 Districts & Maps
  if (q.includes('district') || q.includes('map') || q.includes('32') || q.includes('chennai') || q.includes('madurai') || q.includes('salem') || q.includes('trichy') || q.includes('ooty') || q.includes('bengaluru') || q.includes('kerala') || q.includes('tirupati')) {
    return {
      text: '🗺️ 32 Tamil Nadu Districts & Interstate Transit Map:\nRouteIQ provides complete geospatial maps and town transit data for all 32 Tamil Nadu districts (from Ariyalur, Chennai, Coimbatore to Tirunelveli and Virudhunagar) plus Interstate corridors to Karnataka (Bengaluru, Mysuru), Kerala (Palakkad, Kochi), Andhra Pradesh (Tirupati), and Puducherry!',
      speakText: 'RouteIQ maps all 32 Tamil Nadu districts and interstate transit corridors with real-time crowd tracking and Google Maps integration.',
      actionSuggestion: 'districts',
    };
  }

  if (q.includes('route 18') || q.includes('least crowded') || q.includes('recommend') || q.includes('best bus') || q.includes('seat')) {
    return {
      text: '⭐ Route 18 is strongly recommended! It has only 32% predicted crowding (plenty of seats available), 31 minutes travel time, and base fare of ₹18 (₹9 for students with pass). FC Valid until 2029, Grade A+ quality.',
      speakText: 'Route 18 is recommended. It is 59 percent less crowded than Route 12, with plenty of seats available.',
      actionSuggestion: 'compare',
    };
  }

  if (q.includes('route 12') || q.includes('why crowded') || q.includes('rush') || q.includes('why')) {
    return {
      text: 'Route 12 is at 91% Critical Crowd due to evening rush (+18%), college dispersal (+15%), and rain traffic. Consider switching to Route 18 to travel comfortably with guaranteed seating.',
      speakText: 'Route 12 is experiencing 91 percent critical crowd. We recommend boarding Route 18 to avoid standing congestion.',
      actionSuggestion: 'compare',
    };
  }

  if (q.includes('breakdown') || q.includes('accident') || q.includes('cancel') || q.includes('incident') || q.includes('status') || q.includes('problem')) {
    return {
      text: '⚠️ Active Disruption: Route 12 bus (TN 38 N 2490) experienced radiator overheating near Hope College. Backup bus dispatched. Recommended detour: Route 18.',
      speakText: 'Caution. Route 12 bus is stalled near Hope College. Route 18 is active as an alternative.',
      actionSuggestion: 'disruptions',
    };
  }

  if (q.includes('what if') || q.includes('later') || q.includes('6:30') || q.includes('time') || q.includes('delay')) {
    return {
      text: '💡 By shifting departure from 5:00 PM to 6:30 PM, expected crowding drops from 91% down to 47%—saving you 44% standing congestion!',
      speakText: 'Delaying departure to 6:30 PM reduces crowding by 44 percent.',
      actionSuggestion: 'whatif',
    };
  }

  return {
    text: `Hello! I am RouteIQ AI Voice Assistant. I can tell you the least crowded bus, check vehicle FC expiry date and quality grade, explain the 100% missed bus refund policy, or open maps for all 32 Tamil Nadu districts. What would you like to know?`,
    speakText: 'Hello! I am RouteIQ voice assistant. How can I help with your journey?',
  };
}
