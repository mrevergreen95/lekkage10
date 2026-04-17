import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const WEBHOOK = 'https://n8n.webdashagency.nl/webhook/296f5502-a1e7-47e3-8e93-0e45c6a5e02f';

type FormData = {
  voornaam: string;
  achternaam: string;
  telefoon: string;
  email: string;
  adres: string;
  postcode: string;
  plaats: string;
  opmerkingen: string;
  categorie: string;
  locatie_probleem: string;
  type_pand: string;
  urgentie: string;
  verzekering: string;
  voorkeurs_datum: string;
  bijlage: File | null;
};

const empty: FormData = {
  voornaam: '', achternaam: '', telefoon: '', email: '',
  adres: '', postcode: '', plaats: '', opmerkingen: '',
  categorie: '', locatie_probleem: '', type_pand: '',
  urgentie: '', verzekering: '', voorkeurs_datum: '', bijlage: null,
};

export default function LeadForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => setData(p => ({ ...p, [k]: v }));

  const canSend = data.voornaam.trim() && data.achternaam.trim() &&
    data.telefoon.trim() && data.email.trim() &&
    data.adres.trim() && data.postcode.trim() && data.plaats.trim();

  const submit = async () => {
    setSending(true);
    setErr('');
    try {
      const payload = {
        voornaam: data.voornaam.trim(),
        achternaam: data.achternaam.trim(),
        telefoon: data.telefoon.trim(),
        email: data.email.trim(),
        adres: data.adres.trim(),
        postcode: data.postcode.trim(),
        plaats: data.plaats.trim(),
        opmerkingen: data.opmerkingen.trim(),
        categorie: data.categorie,
        locatie_probleem: data.locatie_probleem,
        type_pand: data.type_pand,
        urgentie: data.urgentie,
        verzekering: data.verzekering,
        voorkeurs_datum: data.voorkeurs_datum,
        bijlage_url: '',
      };

      const { error } = await supabase.from('leads').insert([payload]);
      if (error) throw new Error(error.message);

      fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Onbekende fout';
      setErr(`Verzenden mislukt: ${msg}. Bel ons op 085-4001969.`);
    } finally {
      setSending(false);
    }
  };

  const inp = "w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all";
  const lbl = "block text-sm font-medium text-neutral-700 mb-1.5";
  const btn = "flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold";
  const back = "px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors text-sm font-medium";

  if (done) return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg">Gratis Offerte Aanvragen</h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-neutral-900 mb-2">Aanvraag Ontvangen!</h4>
        <p className="text-neutral-600 text-sm mb-6">Wij nemen binnen 2 uur contact met u op.</p>
        <div className="flex flex-col gap-3">
          <a href="tel:0854001969" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Bel Direct: 085-4001969
          </a>
          <button type="button" onClick={() => { setData(empty); setStep(0); setDone(false); }} className="px-6 py-2.5 border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors text-sm">
            Nieuwe aanvraag
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg">Gratis Offerte Aanvragen</h3>
        <p className="text-blue-100 text-sm mt-0.5">Binnen 2 uur reactie · 24/7 bereikbaar</p>
      </div>

      <div className="p-6">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-neutral-600 text-sm mb-4">Hoe wilt u uw aanvraag doen?</p>
            <button type="button" onClick={() => setStep(4)}
              className="w-full flex items-center gap-3 p-4 border-2 border-blue-500 rounded-xl text-left hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-neutral-900">Snelle aanvraag</div>
                <div className="text-sm text-neutral-500">Alleen contactgegevens</div>
              </div>
            </button>
            <button type="button" onClick={() => setStep(1)}
              className="w-full flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-xl text-left hover:border-blue-300 hover:bg-neutral-50 transition-colors">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-neutral-900">Standaard aanvraag</div>
                <div className="text-sm text-neutral-500">Snellere afhandeling</div>
              </div>
            </button>
            <div className="flex gap-2 pt-2">
              <a href="tel:0854001969" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                Bel Direct
              </a>
              <a href="https://wa.me/31612892333" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="font-semibold text-neutral-800 mb-3">Wat is het probleem?</p>
            {[
              { val: 'waterlekkage', label: 'Waterlekkage', icon: '💧' },
              { val: 'warmteverlies', label: 'Warmteverlies / Tocht', icon: '🌡️' },
              { val: 'rioollucht', label: 'Rioollucht / Stank', icon: '🔧' },
              { val: 'gaslucht', label: 'Gaslucht / Drukverlies', icon: '⚠️' },
            ].map(opt => (
              <button key={opt.val} type="button"
                onClick={() => { set('categorie', opt.val); setStep(2); }}
                className="w-full flex items-center gap-3 p-3.5 border-2 border-neutral-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <span className="text-xl">{opt.icon}</span>
                <span className="font-medium text-neutral-800">{opt.label}</span>
              </button>
            ))}
            <div className="pt-1">
              <button type="button" onClick={() => setStep(0)} className={back}>Terug</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold text-neutral-800 mb-3">Vertel ons meer</p>
            <div>
              <label className={lbl}>Waar bevindt het probleem zich?</label>
              <select className={inp} value={data.locatie_probleem} onChange={e => set('locatie_probleem', e.target.value)}>
                <option value="">Selecteer locatie</option>
                {['Badkamer', 'Keuken', 'Slaapkamer', 'Woonkamer', 'Kelder / Kruipruimte', 'Dak / Zolder', 'Buitenmuur / Gevel', 'Tuin / Buiten', 'Meerdere plekken', 'Onbekend'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Type pand</label>
              <select className={inp} value={data.type_pand} onChange={e => set('type_pand', e.target.value)}>
                <option value="">Selecteer pand</option>
                {['Eengezinswoning', 'Appartement', 'Bedrijfspand', 'Winkel / Horeca', 'Utiliteitsgebouw', 'Industrie'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className={back}>Terug</button>
              <button type="button" onClick={() => setStep(3)} className={btn}>Volgende</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold text-neutral-800 mb-3">Planning & verzekering</p>
            <div>
              <label className={lbl}>Urgentie</label>
              <select className={inp} value={data.urgentie} onChange={e => set('urgentie', e.target.value)}>
                <option value="">Selecteer urgentie</option>
                <option value="Spoed">Spoed (actieve lekkage)</option>
                <option value="Deze week">Deze week</option>
                <option value="Komende 2 weken">Komende 2 weken</option>
                <option value="Geen haast">Geen haast</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Verzekering gemeld?</label>
              <select className={inp} value={data.verzekering} onChange={e => set('verzekering', e.target.value)}>
                <option value="">Selecteer optie</option>
                <option value="Ja, al gemeld">Ja, al gemeld</option>
                <option value="Nee, nog niet">Nee, nog niet</option>
                <option value="Geen verzekering">Geen verzekering</option>
                <option value="Weet ik niet">Weet ik niet</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Voorkeursdatum (optioneel)</label>
              <input type="date" className={inp} value={data.voorkeurs_datum} min={new Date().toISOString().split('T')[0]} onChange={e => set('voorkeurs_datum', e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className={back}>Terug</button>
              <button type="button" onClick={() => setStep(4)} className={btn}>Volgende</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="font-semibold text-neutral-800 mb-3">Uw contactgegevens</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Voornaam *</label>
                <input type="text" className={inp} value={data.voornaam} onChange={e => set('voornaam', e.target.value)} placeholder="Jan" />
              </div>
              <div>
                <label className={lbl}>Achternaam *</label>
                <input type="text" className={inp} value={data.achternaam} onChange={e => set('achternaam', e.target.value)} placeholder="de Vries" />
              </div>
            </div>
            <div>
              <label className={lbl}>Telefoonnummer *</label>
              <input type="tel" className={inp} value={data.telefoon} onChange={e => set('telefoon', e.target.value)} placeholder="06-12345678" />
            </div>
            <div>
              <label className={lbl}>E-mailadres *</label>
              <input type="email" className={inp} value={data.email} onChange={e => set('email', e.target.value)} placeholder="jan@email.nl" />
            </div>
            <div>
              <label className={lbl}>Adres *</label>
              <input type="text" className={inp} value={data.adres} onChange={e => set('adres', e.target.value)} placeholder="Hoofdstraat 1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Postcode *</label>
                <input type="text" className={inp} value={data.postcode} onChange={e => set('postcode', e.target.value)} placeholder="1234 AB" />
              </div>
              <div>
                <label className={lbl}>Plaats *</label>
                <input type="text" className={inp} value={data.plaats} onChange={e => set('plaats', e.target.value)} placeholder="Rotterdam" />
              </div>
            </div>
            <div>
              <label className={lbl}>Toelichting (optioneel)</label>
              <textarea className={inp} rows={3} value={data.opmerkingen} onChange={e => set('opmerkingen', e.target.value)} placeholder="Beschrijf de situatie kort..." />
            </div>
            <div>
              <label className={lbl}>Foto bijvoegen (optioneel)</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => setData(p => ({ ...p, bijlage: e.target.files?.[0] ?? null }))} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-neutral-300 rounded-xl py-3 px-4 text-sm text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                {data.bijlage ? `Gekozen: ${data.bijlage.name}` : '+ Foto uploaden'}
              </button>
            </div>

            {err && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{err}</div>}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(data.categorie ? 3 : 0)} className={back}>Terug</button>
              <button type="button" onClick={submit} disabled={!canSend || sending}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-base">
                {sending ? 'Verzenden...' : 'Aanvraag Versturen'}
              </button>
            </div>
            <p className="text-xs text-neutral-400 text-center">
              Door te verzenden gaat u akkoord met onze <a href="/algemene-voorwaarden/" className="underline">algemene voorwaarden</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
