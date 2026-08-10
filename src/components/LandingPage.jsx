import React from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';

export default function LandingPage({ onNavigate, currentView, onLoginClick }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-[#000000]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E8F0FE] rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgba(108,92,231,0.15)] rounded-full blur-[120px] -z-10" />

      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(108,92,231,0.1)] text-[#000000] text-sm font-bold mb-8">
          <span className="material-icons-round text-[16px]">campaign</span>
          La nouvelle ère de la gestion sportive
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-['Montserrat'] leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Gérez votre club amateur comme des <span className="text-black">professionnels</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-[#404040] mb-10 max-w-2xl leading-relaxed">
          Centralisez la communication, les convocations, le suivi médical et les performances. 
          De l'entraîneur aux parents, tout le monde reste connecté.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button onClick={onLoginClick} className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#000000] text-white font-bold text-lg hover:bg-[#5a4bcf] transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(108,92,231,0.3)]">
            Démarrer maintenant
          </button>
          <button onClick={() => onNavigate('features')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-[#E0E7FF] text-[#000000] font-bold text-lg hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2">
            <span className="material-icons-round text-[#000000]">play_circle</span>
            Voir les Fonctionnalités
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5E5E5] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(108,92,231,0.1)] text-[#000000] flex items-center justify-center mb-6">
              <span className="material-icons-round text-3xl">sports_score</span>
            </div>
            <h3 className="text-xl font-bold mb-3 font-['Montserrat']">Suivi des Performances</h3>
            <p className="text-[#737373] leading-relaxed">Analysez l'évolution de vos joueurs. Statistiques de match, assiduité et progression individuelle.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5E5E5] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(255,109,0,0.1)] text-[#FF6D00] flex items-center justify-center mb-6">
              <span className="material-icons-round text-3xl">local_hospital</span>
            </div>
            <h3 className="text-xl font-bold mb-3 font-['Montserrat']">Carnet de Santé</h3>
            <p className="text-[#737373] leading-relaxed">Gérez les blessures, suivez la récupération et assurez la sécurité des joueurs à chaque instant.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5E5E5] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(0,210,255,0.1)] text-[#00A1CC] flex items-center justify-center mb-6">
              <span className="material-icons-round text-3xl">groups</span>
            </div>
            <h3 className="text-xl font-bold mb-3 font-['Montserrat']">Espace Parents</h3>
            <p className="text-[#737373] leading-relaxed">Les parents restent informés des convocations, des annulations et peuvent suivre les matchs en direct.</p>
          </div>
        </div>
      </section>
      
      <PublicFooter />
    </div>
  );
}
