import React, { useState } from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';
import { addPublicMessage } from '../data/store';

export default function PublicContactPage({ onNavigate, currentView, onLoginClick }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addPublicMessage(form);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      alert("Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#000000]">
      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E8F0FE] rounded-full blur-[100px] -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 z-10 flex flex-col md:flex-row gap-16">
        
        {/* Informations */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Montserrat'] mb-6 tracking-tight">
            Contactez-nous<span className="text-[#404040]">.</span>
          </h1>
          <p className="text-lg text-[#404040] mb-12 leading-relaxed">
            Une question sur nos tarifs, une demande de démonstration ou besoin d'aide pour configurer votre club ? Notre équipe est là pour vous répondre.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#000000] shrink-0">
                <span className="material-icons-round">place</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Notre Siège</h3>
                <p className="text-[#737373]">123 Avenue des Sports<br/>75017 Paris, France</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#000000] shrink-0">
                <span className="material-icons-round">email</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-[#737373]">contact@sportsync.fr</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#000000] shrink-0">
                <span className="material-icons-round">phone</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                <p className="text-[#737373]">+33 1 23 45 67 89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex-1 bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5E5E5]">
          <h2 className="text-2xl font-bold font-['Montserrat'] mb-8">Envoyez-nous un message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#404040] mb-2">Nom complet</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-gray-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#404040] mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-gray-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                  placeholder="jean@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#404040] mb-2">Sujet</label>
              <input 
                type="text" 
                required
                value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-gray-50 focus:bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Demande de démo"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#404040] mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-gray-50 focus:bg-white focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Comment pouvons-nous vous aider ?"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitted}
              className="w-full py-4 rounded-xl bg-black text-white font-bold text-lg hover:bg-[#404040] transition-colors disabled:opacity-50"
            >
              {submitted ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>

      </main>
      
      <PublicFooter />
    </div>
  );
}
