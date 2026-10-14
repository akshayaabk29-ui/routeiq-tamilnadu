import React, { useState } from 'react';
import { RoutePrediction, UserFeedback, ThemeMode, AppLanguage } from '../../types';
import { playClickSound, playSuccessSound } from '../../services/soundEffects';
import { TRANSLATIONS } from '../../services/translations';
import { X, Star, ThumbsUp, MessageSquare, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface FeedbackRatingModalProps {
  route: RoutePrediction | null;
  onClose: () => void;
  onSubmitFeedback: (feedback: UserFeedback) => void;
  theme: ThemeMode;
  language?: AppLanguage;
}

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  route,
  onClose,
  onSubmitFeedback,
  theme,
  language = 'en',
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(4);
  const [comfortRating, setComfortRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Accurate Crowd Prediction', 'Clean & Comfortable']);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!route) return null;

  const availableTags = [
    language === 'ta' ? 'துல்லியமான கூட்ட கணிப்பு' : 'Accurate Crowd Prediction',
    language === 'ta' ? 'இருக்கைகள் எளிதாக கிடைத்தன' : 'Seats Easily Available',
    language === 'ta' ? 'ஏசி சரியாக வேலை செய்தது' : 'AC Functioning Well',
    language === 'ta' ? 'சரியான நேரத்தில் வந்தது' : 'On Time Arrival',
    language === 'ta' ? 'மரியாதையான நடத்துனர்' : 'Polite Conductor',
    language === 'ta' ? 'பாதுகாப்பான ஓட்டுதல்' : 'Smooth Driving',
    language === 'ta' ? 'தூய்மையான இருக்கைகள்' : 'Clean & Comfortable',
  ];

  const toggleTag = (tag: string) => {
    playClickSound();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();

    const feedback: UserFeedback = {
      id: Date.now().toString(),
      routeNumber: route.routeNumber,
      overallRating,
      crowdAccuracyRating: accuracyRating,
      punctualityRating,
      comfortRating,
      tags: selectedTags,
      comment,
      timestamp: 'Just now',
    };

    onSubmitFeedback(feedback);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Rate Your Trip & Crowd Accuracy
              </h3>
              <p className="text-xs text-slate-500">
                {route.routeNumber} ({route.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="text-xl font-extrabold">Thank You for Your Review!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your feedback helps recalibrate RouteIQ’s AI crowd prediction model for fellow commuters.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Overall Star Rating */}
            <div className="text-center py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Overall Commute Experience
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setOverallRating(star);
                    }}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= overallRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[11px] text-slate-500 mb-1">Crowd Accuracy</span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAccuracyRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          s <= accuracyRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[11px] text-slate-500 mb-1">Punctuality</span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPunctualityRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          s <= punctualityRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[11px] text-slate-500 mb-1">Comfort & AC</span>
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setComfortRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          s <= comfortRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Quick Experience Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments text area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Detailed Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share more details about bus crowding, driver punctuality, or seat cleanliness..."
                rows={3}
                className={`w-full p-3 rounded-xl text-xs border outline-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Submit Commuter Rating
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
