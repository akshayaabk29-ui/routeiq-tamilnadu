import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage, ThemeMode, AppMode } from '../../types';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  startVoiceRecognition,
  speakTransitAdvice,
  stopSpeaking,
  getSmartAssistantResponse,
} from '../../services/speechService';
import { playClickSound, playChimeSound, playAlertSound } from '../../services/soundEffects';
import { TRANSLATIONS } from '../../services/translations';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  MessageSquare,
  Compass,
  ShieldCheck,
  CreditCard,
  Map,
  Wrench,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  theme: ThemeMode;
  mode?: AppMode;
  onNavigateToTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme,
  mode = 'passenger',
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micStatusMsg, setMicStatusMsg] = useState<string | null>(null);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState<{ stop: () => void } | null>(null);
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Initial welcome message in the selected language
  useEffect(() => {
    if (isOpen) {
      const welcomeMap: Record<AppLanguage, string> = {
        ta: 'வணக்கம்! நான் ரூட்ஐக்யூ (RouteIQ) AI குரல் உதவியாளர். குறைந்த நெரிசல் பேருந்து, எஃப்சி சான்றிதழ் தேதி & தரம், மிஸ்ஸ்ட் பஸ் ரீஃபண்ட் பாலிசி அல்லது 32 மாவட்ட வரைபடங்களை என்னிடம் கேளுங்கள்.',
        hi: 'नमस्ते! मैं रूटआईक्यू (RouteIQ) AI वॉयस असिस्टेंट हूँ। आप मुझसे कम भीड़ वाली बस, वाहन FC फिटनेस व गुणवत्ता, मिस्ड बस 100% रिफंड या 32 जिला मानचित्रों के बारे में पूछ सकते हैं।',
        kn: 'ನಮಸ್ಕಾರ! ನಾನು ರೂಟ್‌ಐಕ್ಯೂ (RouteIQ) AI ಧ್ವನಿ ಸಹಾಯಕ. ಕಡಿಮೆ ದಟ್ಟಣೆಯ ಬಸ್, FC ದಿನಾಂಕ, ಮಿಸ್ಡ್ ಬಸ್ ಮರುಪಾವತಿ ಅಥವಾ 32 ಜಿಲ್ಲೆಗಳ ನಕ್ಷೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
        ml: 'നമസ്കാരം! ഞാൻ റൂട്ട്ഐക്യു (RouteIQ) AI വോയ്‌സ് അസിസ്റ്റന്റ്. തിരക്ക് കുറഞ്ഞ ബസ്, FC സർട്ടിഫിക്കറ്റ്, റീഫണ്ട് പോളിസി അല്ലെങ്കിൽ 32 ജില്ലാ മാപ്പുകൾ ചോദിക്കാം.',
        te: 'నమస్కారం! నేను రూట్‌ఐక్యూ (RouteIQ) AI వాయిస్ అసిస్టెంట్. తక్కువ రద్దీ గల బస్సు, FC తేదీ & నాణ్యత, మిస్డ్ బస్ రీఫండ్ లేదా 32 జిల్లాల మ్యాప్‌ల గురించి అడగండి.',
        en: 'Hello! I am RouteIQ AI Voice Assistant. Ask me about least crowded routes, bus FC expiry date & quality, 100% missed bus refund policy, or all 32 Tamil Nadu district maps.',
      };

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: welcomeMap[lang] || welcomeMap.en,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [isOpen, lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;
    playClickSound(720);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setMicStatusMsg(null);
    setIsListening(false);
    setIsSimulatingSpeech(false);

    // Generate intelligent AI response
    setTimeout(() => {
      const response = getSmartAssistantResponse(queryText, lang);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playChimeSound();

      // Speak aloud using SpeechSynthesis
      speakTransitAdvice(
        response.speakText,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );

      // Trigger automatic tab navigation if suggested
      if (response.actionSuggestion && onNavigateToTab) {
        onNavigateToTab(response.actionSuggestion);
      }
    }, 300);
  };

  const handleToggleVoiceInput = () => {
    playClickSound();

    if (isListening) {
      if (voiceRecognitionActive) {
        voiceRecognitionActive.stop();
        setVoiceRecognitionActive(null);
      }
      setIsListening(false);
      setMicStatusMsg(null);
      return;
    }

    // Try real microphone speech recognition
    setIsListening(true);
    setMicStatusMsg(
      lang === 'ta'
        ? 'உங்கள் குரலை கேட்கிறது... இப்போது பேசுங்கள்!'
        : 'Listening to your voice... Speak now into your mic!'
    );

    const recognition = startVoiceRecognition(lang, {
      onTranscript: (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
          setVoiceRecognitionActive(null);
          setMicStatusMsg(null);
          handleSendMessage(transcript);
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setVoiceRecognitionActive(null);
        setMicStatusMsg(errMsg);
      },
      onEnd: () => {
        setIsListening(false);
        setVoiceRecognitionActive(null);
      },
    });

    setVoiceRecognitionActive(recognition);
  };

  // One-click simulated voice input test that handles environments where mic permissions are restricted
  const handleSimulateVoice = (sampleText: string) => {
    playClickSound(880);
    setIsSimulatingSpeech(true);
    setMicStatusMsg(`🎙️ Simulating voice: "${sampleText}"`);
    setInputText('');

    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= sampleText.length) {
        setInputText(sampleText.substring(0, charIdx));
        charIdx += 2;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulatingSpeech(false);
          handleSendMessage(sampleText);
        }, 300);
      }
    }, 40);
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // Structured query categories covering the user's required features
  const categorizedQueries: Record<
    AppLanguage,
    { category: string; icon: any; query: string }[]
  > = {
    ta: [
      { category: 'FC & தரம்', icon: ShieldCheck, query: 'பேருந்துகளின் FC தேதி மற்றும் தரம் என்ன?' },
      { category: 'ரீஃபண்ட்', icon: CreditCard, query: 'பேருந்தை தவறவிட்டால் 100% ரீஃபண்ட் பாலிசி எப்படி?' },
      { category: '32 மாவட்டங்கள்', icon: Map, query: 'தமிழ்நாட்டின் 32 மாவட்ட வரைபடத்தைக் காட்டு' },
      { category: 'குறைந்த கூட்டம்', icon: Sparkles, query: 'குறைந்த நெரிசல் பேருந்து எது?' },
      { category: 'பழுது எச்சரிக்கை', icon: Wrench, query: 'பேருந்து பழுது அல்லது விபத்து உள்ளதா?' },
      { category: 'மாலை 6:30 நேரம்', icon: Compass, query: 'மாலை 6:30 மணிக்கு சென்றால் கூட்டம் குறையுமா?' },
    ],
    hi: [
      { category: 'FC व गुणवत्ता', icon: ShieldCheck, query: 'बसों की FC तारीख व वाहन गुणवत्ता क्या है?' },
      { category: 'रिफंड पॉलिसी', icon: CreditCard, query: 'बस छूट जाने पर 100% रिफंड कैसे मिलता है?' },
      { category: '32 जिला मैप', icon: Map, query: '32 तमिलनाडु जिलों का मानचित्र दिखाएं' },
      { category: 'कम भीड़', icon: Sparkles, query: 'सबसे कम भीड़ वाली बस कौन सी है?' },
      { category: 'खराबी अलर्ट', icon: Wrench, query: 'क्या कोई बस खराब है?' },
    ],
    kn: [
      { category: 'FC ಗುಣಮಟ್ಟ', icon: ShieldCheck, query: 'ಬಸ್ FC ದಿನಾಂಕ ಮತ್ತು ಗುಣಮಟ್ಟ ತಿಳಿಸಿ' },
      { category: 'ಮರುಪಾವತಿ', icon: CreditCard, query: 'ಬಸ್ ತಪ್ಪಿದರೆ 100% ಮರುಪಾವತಿ ಪಾಲಿಸಿ ಹೇಗೆ?' },
      { category: '32 ಜಿಲ್ಲೆಗಳು', icon: Map, query: '32 ತಮಿಳುನಾಡು ಜಿಲ್ಲೆಗಳ ನಕ್ಷೆ ತೋರಿಸಿ' },
      { category: 'ಕಡಿಮೆ ದಟ್ಟಣೆ', icon: Sparkles, query: 'ಕಡಿಮೆ ದಟ್ಟಣೆಯ ಬಸ್ ಯಾವುದು?' },
    ],
    ml: [
      { category: 'FC തീയതി', icon: ShieldCheck, query: 'ബസുകളുടെ FC തീയതിയും ഗുണനിലവാരവും പറയുക' },
      { category: 'റീഫണ്ട്', icon: CreditCard, query: 'ബസ് നഷ്ടപ്പെട്ടാൽ 100% റീഫണ്ട് എങ്ങനെ ലഭിക്കും?' },
      { category: '32 ജില്ലകൾ', icon: Map, query: '32 തമിഴ്നാട് ജില്ലകളുടെ മാപ്പ് കാണിക്കുക' },
      { category: 'കുറഞ്ഞ തിരക്ക്', icon: Sparkles, query: 'തിരക്ക് കുറഞ്ഞ ബസ് ഏതാണ്?' },
    ],
    te: [
      { category: 'FC తేదీ', icon: ShieldCheck, query: 'బస్సుల FC తేదీ మరియు నాణ్యత ఏమిటి?' },
      { category: 'రీఫండ్ పాలసీ', icon: CreditCard, query: 'బస్సు మిస్ అయితే 100% రీఫండ్ ఎలా లభిస్తుంది?' },
      { category: '32 జిల్లాలు', icon: Map, query: '32 తమిళనాడు జిల్లాల మ్యాప్‌ను చూపించు' },
      { category: 'తక్కువ రద్దీ', icon: Sparkles, query: 'తక్కువ రద్దీ ఉన్న బస్సు ఏది?' },
    ],
    en: [
      { category: 'FC Date & Quality', icon: ShieldCheck, query: 'What is the FC expiry date and quality grade?' },
      { category: 'Missed Bus Refund', icon: CreditCard, query: 'What is the 100% missed bus refund policy?' },
      { category: '32 District Maps', icon: Map, query: 'Show maps for all 32 Tamil Nadu districts' },
      { category: 'Least Crowded Bus', icon: Sparkles, query: 'Which bus is least crowded right now?' },
      { category: 'Why Route 12 Rush', icon: Compass, query: 'Why is Route 12 predicted at 91% crowd?' },
      { category: 'Live Breakdown', icon: Wrench, query: 'Are there any live bus breakdowns or incidents?' },
    ],
  };

  const currentQueries = categorizedQueries[lang] || categorizedQueries.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Assistant Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-center p-0.5">
                <img
                  src="/routeiq-logo.png"
                  alt="RouteIQ"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                  mode === 'authority' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {t.voiceAssistantTitle || 'RouteIQ AI Voice Assistant'}
                </h3>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                    mode === 'authority'
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {lang.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isSpeaking
                  ? '🔊 Speaking transit response aloud...'
                  : isListening
                  ? '🎙️ Listening to microphone...'
                  : isSimulatingSpeech
                  ? '⚡ Simulating voice command...'
                  : mode === 'authority'
                  ? 'Operational dispatch & transit network voice intelligence'
                  : 'Multi-lingual voice transit intelligence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                title="Mute Speech Playback"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[220px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : theme === 'dark'
                    ? 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/60'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Voice Waveform & Status Notice */}
        {(isListening || isSpeaking || isSimulatingSpeech) && (
          <div className="px-4 py-2.5 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              {/* Simulated Voice Equalizer Bars */}
              <div className="flex items-end gap-1 h-4">
                <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-4" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-3" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-emerald-500 rounded-full animate-bounce h-4" style={{ animationDelay: '100ms' }} />
              </div>
              <span className="text-xs truncate max-w-xs">{micStatusMsg || 'Voice Engine Active'}</span>
            </div>
            {isListening && (
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className="text-xs text-rose-500 hover:underline font-bold"
              >
                Stop
              </button>
            )}
          </div>
        )}

        {/* Categorized Quick Voice Question Pills */}
        <div
          className={`p-3 border-t text-xs space-y-1.5 ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Tap Any Voice Query to Ask Aloud:</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              6 Categories
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {currentQueries.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSimulateVoice(item.query)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-semibold transition-all shadow-2xs group"
                >
                  <Icon className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>{item.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar with Voice Mic & Send */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className={`p-3 border-t flex items-center gap-2 ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          {/* Main Voice Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-xl transition-all shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce'
                : mode === 'authority'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Quick Voice Demo Simulation Trigger */}
          <button
            type="button"
            onClick={() => handleSimulateVoice(currentQueries[0]?.query || 'Which bus is least crowded?')}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700 ${
              mode === 'authority'
                ? 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700'
                : 'hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700'
            }`}
            title="Simulate Voice Input without microphone permission"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">Voice Demo</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang === 'ta'
                ? 'பேசவும் அல்லது தட்டச்சு செய்யவும் (எ.கா: எஃப்சி தேதி, ரீஃபண்ட், 32 மாவட்டங்கள்)...'
                : 'Speak or type (e.g., FC date, refund policy, 32 districts, least crowd)...'
            }
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none border transition-colors ${
              theme === 'dark'
                ? mode === 'authority'
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                : mode === 'authority'
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600'
            }`}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-xl transition-all disabled:opacity-40 ${
              mode === 'authority'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
