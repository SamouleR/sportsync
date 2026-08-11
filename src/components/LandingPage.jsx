import React, { useState } from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';

export default function LandingPage({ onNavigate, currentView, onLoginClick }) {
  const [activeTab, setActiveTab] = useState('calendrier');

  const tabsData = {
    'inscriptions': {
      title: "Simplifiez vos inscriptions et suivez tous vos paiements",
      bullets: [
        "Créer vos formulaires d'inscription en ligne et collectez automatiquement",
        "Informations des licenciés, documents et règlements",
        "Carte bancaire, chèque, espèces, virement, Pass'Sport : tout est centralisé"
      ]
    },
    'membres': {
      title: "Centralisez la base de données de vos membres",
      bullets: [
        "Retrouvez toutes les informations en un clic",
        "Gérez les rôles et permissions",
        "Communiquez facilement avec les bons groupes"
      ]
    },
    'calendrier': {
      title: "Un planning club fiable et toujours à jour",
      bullets: [
        "Centralisez, accessible depuis l'application mobile utilisée par tous les membres du club",
        "Entraînements, matchs, tournois, événements du club",
        "Chaque membre voit uniquement les événements qui le concernent"
      ]
    },
    'messagerie': {
      title: "Une communication fluide et ciblée",
      bullets: [
        "Envoyez des messages aux bonnes personnes",
        "Fini les boucles WhatsApp interminables",
        "Suivez qui a lu vos messages"
      ]
    },
    'sportive': {
      title: "Simplifiez la vie des coachs",
      bullets: [
        "Convocations, présences et absences",
        "Suivi des présences et statistiques individuelles/collectives",
        "Échanges via forum dédié et gestion du covoiturage"
      ]
    },
    'sponsors': {
      title: "Offrez une visibilité maximale à vos sponsors",
      bullets: [
        "Affichez vos sponsors sur les bannières",
        "Digitalisez votre offre de sponsoring",
        "Valorisez vos partenaires auprès de votre communauté"
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Montserrat'] bg-white">
      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />

      <main className="flex-1 flex flex-col">
        {/* New Dark Blue Hero Section */}
        <section className="px-4 py-8">
          <div className="max-w-[1400px] mx-auto bg-[#0f172a] rounded-[40px] p-10 lg:p-16 xl:p-20 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
            
            <div className="flex-1 z-10 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight uppercase">
                LE LOGICIEL TOUT-EN-UN POUR <br/>
                <span className="text-[#22c55e]">GÉRER VOTRE CLUB</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                SportSync Club est l'application web et mobile pensée pour piloter l'ensemble de votre club, simplement. Moins d'administratif. Moins d'outils dispersés. Plus de temps pour le sport et les personnes qui le font vivre.
              </p>
              
              <a href="#features" className="text-[#22c55e] hover:text-[#16a34a] font-bold text-sm mb-8 inline-block underline underline-offset-4">
                Découvrir nos fonctionnalités
              </a>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button onClick={onLoginClick} className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#22c55e] text-white font-bold text-lg hover:bg-[#16a34a] transition-colors shadow-lg">
                  Créer mon espace club
                </button>
                <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto text-white font-bold text-lg hover:text-slate-300 transition-colors text-center">
                  Demander une démo
                </button>
              </div>
            </div>

            {/* Right side mockups (Placeholders based on screenshots) */}
            <div className="flex-1 w-full relative h-[400px] lg:h-[500px]">
              {/* Main mockup window */}
              <div className="absolute top-0 right-0 w-[85%] lg:w-[90%] h-[280px] bg-white rounded-3xl p-4 shadow-2xl flex flex-col z-20">
                 <div className="flex justify-between items-center border-b pb-3 mb-3">
                   <div className="font-bold text-[#0f172a] text-sm">Liste des collectes</div>
                   <div className="bg-[#22c55e] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                     <span className="material-icons-round text-[12px]">add</span> Créer une campagne
                   </div>
                 </div>
                 <div className="flex-1 bg-slate-50 rounded-xl flex flex-col gap-2 p-2 relative overflow-hidden">
                    <div className="h-10 bg-white rounded-lg shadow-sm flex items-center justify-between px-3"><div className="w-1/2 h-3 bg-slate-200 rounded"></div><div className="w-1/4 h-3 bg-slate-200 rounded"></div></div>
                    <div className="h-10 bg-white rounded-lg shadow-sm flex items-center justify-between px-3"><div className="w-1/2 h-3 bg-slate-200 rounded"></div><div className="w-1/4 h-3 bg-slate-200 rounded"></div></div>
                    <div className="h-10 bg-white rounded-lg shadow-sm flex items-center justify-between px-3"><div className="w-1/2 h-3 bg-slate-200 rounded"></div><div className="w-1/4 h-3 bg-slate-200 rounded"></div></div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <span className="material-icons-round text-[#22c55e] text-4xl ml-1">play_arrow</span>
                      </div>
                    </div>
                 </div>
              </div>
              
              {/* Bottom left image block */}
              <div className="absolute bottom-0 left-0 w-[45%] h-[180px] bg-gradient-to-tr from-emerald-800 to-[#22c55e] rounded-3xl shadow-xl overflow-hidden flex items-center justify-center z-10">
                 <span className="material-icons-round text-white/30 text-8xl">emoji_events</span>
              </div>
              
              {/* Bottom right image block */}
              <div className="absolute bottom-4 right-[5%] w-[35%] h-[220px] bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center z-30">
                 <span className="material-icons-round text-white/30 text-8xl">sports_soccer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi SportSync */}
        <section className="py-24 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-black text-center text-[#0f172a] mb-20 uppercase tracking-tight">
            Pourquoi SportSync <span className="text-[#22c55e]">Club</span> ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f8fafc] border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <span className="material-icons-round text-2xl text-[#0f172a]">account_balance_wallet</span>
              </div>
              <h3 className="font-extrabold text-[#0f172a] text-lg mb-4 leading-snug">Sécurisez<br/>votre budget</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Collectez les cotisations et tous les paiements en ligne, sans frais, pour une trésorerie immédiate. Valorisez vos sponsors avec une visibilité dédiée sur l'application.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f8fafc] border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <span className="material-icons-round text-2xl text-[#0f172a]">hourglass_empty</span>
              </div>
              <h3 className="font-extrabold text-[#0f172a] text-lg mb-4 leading-snug">Gagnez un temps<br/>précieux</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Supprimez les fichiers Excel et les groupes WhatsApp. Automatisez vos convocations, le suivi des présences et la gestion des documents administratifs.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f8fafc] border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <span className="material-icons-round text-2xl text-[#0f172a]">diversity_3</span>
              </div>
              <h3 className="font-extrabold text-[#0f172a] text-lg mb-4 leading-snug">Fidélisez<br/>votre communauté</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Améliorez l'expérience de vos licenciés et rassurez les parents grâce à un outil professionnel qui simplifie la vie de tout le club.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f8fafc] border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <span className="material-icons-round text-2xl text-[#0f172a]">favorite_border</span>
              </div>
              <h3 className="font-extrabold text-[#0f172a] text-lg mb-4 leading-snug">Profitez d'une équipe à<br/>votre service</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Profitez d'une équipe de passionnés qui répond à toutes vos questions pour vous épauler au quotidien dans la gestion de votre club.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 max-w-[1400px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-black text-center text-[#0f172a] mb-16 uppercase tracking-tight">
            Ils nous font confiance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0f172a] rounded-[40px] p-4 flex flex-col sm:flex-row gap-8">
              <div className="w-full sm:w-[250px] h-[300px] bg-slate-800 rounded-[32px] overflow-hidden flex items-center justify-center shrink-0">
                 <span className="material-icons-round text-slate-600 text-6xl">person</span>
              </div>
              <div className="w-full flex flex-col justify-center text-white py-4 pr-6">
                <p className="text-[15px] italic mb-6 leading-relaxed text-slate-300">
                  "SportSync nous aide au quotidien à structurer notre organisation sportive en facilitant la gestion des convocations, des présences et de la communication avec les familles. C'est un outil central qui fluidifie la coordination."
                </p>
                <div className="font-bold text-sm">Romain ROUSSELLE – Encadrant</div>
                <div className="text-xs text-white/50 mb-4 font-medium mt-1">Octobre 2025</div>
                <div className="font-bold text-sm mt-auto text-white">Rugby Club Tricastin</div>
              </div>
            </div>
            
            <div className="bg-[#0f172a] rounded-[40px] p-4 flex flex-col sm:flex-row gap-8">
              <div className="w-full sm:w-[250px] h-[300px] bg-slate-800 rounded-[32px] overflow-hidden flex items-center justify-center shrink-0">
                 <span className="material-icons-round text-slate-600 text-6xl">person</span>
              </div>
              <div className="w-full flex flex-col justify-center text-white py-4 pr-6">
                <p className="text-[15px] italic mb-6 leading-relaxed text-slate-300">
                  "L'application SportSync est notre seul canal de communication pour tout le club. Ça nous permet d'être mieux organisés et surtout de fluidifier notre communication auprès de tous nos licenciés."
                </p>
                <div className="font-bold text-sm">Azaline GAUBERT – Responsable</div>
                <div className="text-xs text-white/50 mb-4 font-medium mt-1">Mars 2026</div>
                <div className="font-bold text-sm mt-auto text-white">AS IFS Football</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase (Vertical Tabs) */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-slate-100 mt-12">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] uppercase tracking-tight leading-[1.2]">
              Tout ce dont vous avez besoin<br/>
              <span className="text-[#22c55e]">pour gérer</span> votre association sportive
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Tabs List */}
            <div className="w-full lg:w-[300px] flex flex-col gap-2 shrink-0 lg:border-r border-[#e2e8f0] lg:pr-8">
              {Object.keys(tabsData).map((tabKey) => (
                <button 
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)} 
                  className={`text-left py-4 px-6 font-bold text-[15px] transition-all rounded-xl ${
                    activeTab === tabKey 
                      ? 'text-[#0f172a] bg-white shadow-md border-l-4 border-[#0f172a]' 
                      : 'text-[#94a3b8] hover:text-[#0f172a] hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  {/* Human readable label mapping */}
                  {tabKey === 'inscriptions' && 'Inscriptions & paiements'}
                  {tabKey === 'membres' && 'Gestion des membres'}
                  {tabKey === 'calendrier' && 'Calendrier'}
                  {tabKey === 'messagerie' && 'Messagerie'}
                  {tabKey === 'sportive' && 'Gestion sportive'}
                  {tabKey === 'sponsors' && 'Visibilité sponsors'}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-12 items-center min-h-[450px]">
              {/* Mockup area */}
              <div className="w-full lg:w-1/2 h-[450px] bg-[#0f172a] rounded-[40px] flex items-center justify-center p-8 relative overflow-hidden shadow-xl">
                 {/* Decorative elements based on active tab */}
                 {activeTab === 'calendrier' && (
                   <div className="flex flex-col gap-5 w-full max-w-[320px] mx-auto z-10">
                     <div className="bg-white rounded-2xl p-5 shadow-2xl transform rotate-[-3deg] transition-all hover:rotate-0">
                       <div className="flex justify-between font-bold text-[15px] mb-4 text-[#0f172a]">
                         <span className="text-slate-500 font-medium">Jeu 23 sept.</span> 
                         <span>Les Olympiens U19</span>
                       </div>
                       <div className="flex gap-3">
                         <div className="flex-1 bg-[#22c55e] text-white text-center py-2.5 rounded-lg text-sm font-bold shadow-sm">Présent</div>
                         <div className="flex-1 bg-[#ef4444] text-white text-center py-2.5 rounded-lg text-sm font-bold shadow-sm">Absent</div>
                       </div>
                     </div>
                     <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg ml-8 opacity-80">
                       <div className="flex justify-between font-bold text-[15px] text-[#0f172a]">
                         <span className="text-slate-500 font-medium">Mar 28 sept.</span> 
                         <span>AS Colombes</span>
                       </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'sportive' && (
                   <div className="relative w-full h-full flex flex-col justify-center items-center">
                     <span className="material-icons-round text-white/10 text-[180px] absolute">sports</span>
                     <div className="bg-white rounded-full px-5 py-3 flex items-center gap-3 absolute left-4 top-1/3 shadow-xl z-10 animate-bounce" style={{animationDuration: '3s'}}>
                       <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">+1</div>
                       <span className="text-sm font-bold text-slate-800 pr-2">Sébastien</span>
                     </div>
                     <div className="bg-white rounded-full px-5 py-3 flex items-center gap-3 absolute right-4 bottom-1/3 shadow-xl z-10 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
                       <span className="text-sm font-bold text-slate-800 pl-2">Marie</span>
                       <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">-1</div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'inscriptions' && (
                   <div className="relative w-full h-full flex flex-col justify-center items-center gap-6">
                     <div className="bg-white rounded-2xl p-5 flex items-center gap-4 w-5/6 self-end shadow-2xl z-20">
                       <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center"><span className="material-icons-round text-slate-400">person</span></div>
                       <div>
                         <div className="font-bold text-base text-[#0f172a]">Lola Parret</div>
                         <div className="text-[13px] text-slate-500 font-medium">Saison 2026-2027 • Séniors F.</div>
                       </div>
                     </div>
                     <div className="bg-white/90 rounded-2xl p-5 flex items-center gap-4 w-5/6 self-start shadow-xl z-10 transform scale-95 opacity-90">
                       <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center"><span className="material-icons-round text-slate-400">person</span></div>
                       <div>
                         <div className="font-bold text-base text-[#0f172a]">Basile Dupont</div>
                         <div className="text-[13px] text-slate-500 font-medium">Saison 2026-2027 • U19</div>
                       </div>
                     </div>
                   </div>
                 )}
                 {/* Generic fallback for others */}
                 {!['calendrier', 'sportive', 'inscriptions'].includes(activeTab) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-4 border-white/10 flex items-center justify-center">
                         <span className="material-icons-round text-white/20 text-7xl">widgets</span>
                      </div>
                    </div>
                 )}
              </div>
              
              {/* Text area */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center pl-0 lg:pl-4">
                 <h3 className="text-[28px] font-bold text-[#0f172a] mb-8 leading-tight">
                   {tabsData[activeTab].title}
                 </h3>
                 <ul className="flex flex-col gap-5 mb-10">
                   {tabsData[activeTab].bullets.map((bullet, i) => (
                     <li key={i} className="flex items-start gap-4 text-[15px]">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a] mt-2.5 shrink-0"></span>
                       <span className="text-[#334155] leading-relaxed font-medium">{bullet}</span>
                     </li>
                   ))}
                 </ul>
                 <div>
                   <button className="px-8 py-4 rounded-full bg-[#22c55e] text-white font-bold text-[15px] hover:bg-[#16a34a] transition-colors shadow-md">
                     En savoir plus
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
