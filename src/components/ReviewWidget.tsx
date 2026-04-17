import { useState } from 'react';
import { supabase } from '../lib/supabase';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CU8qz4T1VqxNEBM/review';

type Phase = 'rating' | 'form' | 'done';

type FeedbackData = {
  naam: string;
  email: string;
  feedback: string;
};

function StarIcon({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  const active = filled || hovered;
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full transition-all duration-150"
      fill={active ? '#F59E0B' : 'none'}
      stroke={active ? '#F59E0B' : '#D1D5DB'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function ReviewWidget() {
  const [phase, setPhase] = useState<Phase>('rating');
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [form, setForm] = useState<FeedbackData>({ naam: '', email: '', feedback: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FeedbackData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleStarClick = (rating: number) => {
    setSelected(rating);
    if (rating >= 4) {
      window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    } else {
      setPhase('form');
    }
  };

  const canSubmit = form.naam.trim() && form.email.trim() && form.feedback.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('reviews').insert([{
        naam: form.naam.trim(),
        email: form.email.trim(),
        rating: selected,
        feedback: form.feedback.trim(),
      }]);
      if (dbError) throw new Error(dbError.message);
      setPhase('done');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Onbekende fout';
      setError(`Verzenden mislukt: ${msg}. Probeer het opnieuw.`);
    } finally {
      setSending(false);
    }
  };

  const inp = "w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all";
  const lbl = "block text-sm font-semibold text-neutral-700 mb-1.5";

  if (phase === 'done') {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Bedankt voor uw feedback!</h2>
        <p className="text-neutral-600 max-w-sm mx-auto leading-relaxed">
          Uw feedback is bij ons binnengekomen. Wij nemen dit serieus en gebruiken het om onze service te verbeteren.
        </p>
        <p className="text-sm text-neutral-500 mt-4">
          Heeft u nog vragen? Bel ons op{' '}
          <a href="tel:0854001969" className="text-primary-600 font-semibold hover:underline">085-4001969</a>.
        </p>
      </div>
    );
  }

  if (phase === 'form') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-8 h-8 opacity-60">
                <StarIcon filled={i <= selected} hovered={false} />
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Vertel ons wat er beter kan</h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Uw feedback blijft intern. Wij gebruiken dit om onze service te verbeteren.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className={lbl} htmlFor="review-naam">Naam *</label>
            <input
              id="review-naam"
              type="text"
              className={inp}
              value={form.naam}
              onChange={e => set('naam', e.target.value)}
              placeholder="Jan de Vries"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className={lbl} htmlFor="review-email">E-mailadres *</label>
            <input
              id="review-email"
              type="email"
              className={inp}
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="jan@email.nl"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className={lbl} htmlFor="review-feedback">Uw feedback *</label>
            <textarea
              id="review-feedback"
              className={inp}
              rows={5}
              value={form.feedback}
              onChange={e => set('feedback', e.target.value)}
              placeholder="Beschrijf uw ervaring en wat er beter kon..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setPhase('rating'); setSelected(0); }}
              className="px-5 py-3 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              Terug
            </button>
            <button
              type="submit"
              disabled={!canSubmit || sending}
              className="flex-1 px-5 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-busy={sending}
            >
              {sending ? 'Verzenden...' : 'Feedback versturen'}
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            Uw gegevens worden vertrouwelijk behandeld en niet gedeeld met derden.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="mb-3 flex justify-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-neutral-900 mb-3">
        Hoe was uw ervaring?
      </h2>
      <p className="text-neutral-600 mb-8 leading-relaxed max-w-sm mx-auto">
        Wij horen graag wat u van onze service vond. Uw mening helpt ons om anderen beter te helpen.
      </p>

      <div
        className="flex justify-center gap-3 mb-6"
        role="group"
        aria-label="Kies een beoordeling van 1 tot 5 sterren"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            className="w-14 h-14 sm:w-16 sm:h-16 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHovered(i)}
            onClick={() => handleStarClick(i)}
            aria-label={`${i} ${i === 1 ? 'ster' : 'sterren'}`}
          >
            <StarIcon filled={i <= selected} hovered={i <= hovered} />
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-neutral-400 max-w-xs mx-auto px-1 mb-8">
        <span>Slecht</span>
        <span>Uitstekend</span>
      </div>

      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-sm text-neutral-500 leading-relaxed">
        <span className="font-semibold text-neutral-700">Hoe werkt dit?</span>{' '}
        Bij een beoordeling van 4 of 5 sterren wordt u doorgestuurd naar Google Reviews.
        Bij 1-3 sterren kunt u ons direct intern laten weten wat er beter kan.
      </div>
    </div>
  );
}
