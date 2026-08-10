import React from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';

export default function PublicFeaturesPage({ onNavigate, currentView, onLoginClick }) {
  return (
    <div className="min-h-screen flex flex-col relative text-[#000000]">
      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgba(108,92,231,0.1)] rounded-full blur-[100px] -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Montserrat'] mb-6 tracking-tight">
            Fonctionnalités<span className="text-[#404040]">.</span>
          </h1>
          <p className="text-lg text-[#404040] max-w-2xl mx-auto leading-relaxed">
            Tout ce dont vous avez besoin pour gérer votre club comme des professionnels, réuni dans une seule plateforme.
          </p>
        </div>

        {/* Detailed Features */}
        <section className="w-full">
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold font-['Montserrat'] mb-6 tracking-tight">
                Suivi Médical Intégré<span className="text-[#404040]">.</span>
              </h2>
              <p className="text-[#404040] text-lg leading-relaxed mb-6">
                Fini les feuilles volantes et les oublis. Notre module d'infirmerie vous permet de garder une trace précise des blessures de vos joueurs, des temps de récupération estimés et des certificats médicaux.
              </p>
              <ul className="space-y-4 text-[#737373]">
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Historique complet par joueur</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Alertes de retour au jeu</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Partage sécurisé avec le staff</li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-gray-50 rounded-2xl border border-[#E5E5E5] flex items-center justify-center text-[#737373] shadow-inner">
                [Illustration Suivi Médical]
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-24">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold font-['Montserrat'] mb-6 tracking-tight">
                Statistiques & Live Match<span className="text-[#404040]">.</span>
              </h2>
              <p className="text-[#404040] text-lg leading-relaxed mb-6">
                Donnez vie à vos matchs. L'entraîneur ou son adjoint peut saisir les actions (buts, cartons, changements) en direct. Les parents et supporters suivent le fil du match depuis chez eux.
              </p>
              <ul className="space-y-4 text-[#737373]">
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Chronologie temps réel</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Bilan automatique après le match</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Engagement de la communauté</li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-gray-50 rounded-2xl border border-[#E5E5E5] flex items-center justify-center text-[#737373] shadow-inner">
                [Illustration Live Match]
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold font-['Montserrat'] mb-6 tracking-tight">
                Gestion des Convocations<span className="text-[#404040]">.</span>
              </h2>
              <p className="text-[#404040] text-lg leading-relaxed mb-6">
                Organisez vos matchs et entraînements en quelques clics. Les joueurs et parents reçoivent des notifications et peuvent confirmer leur présence instantanément.
              </p>
              <ul className="space-y-4 text-[#737373]">
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Réponses en un clic</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Statistiques de présence</li>
                <li className="flex items-center gap-3"><span className="material-icons-round text-[#000000]">check_circle</span> Relances automatiques</li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-gray-50 rounded-2xl border border-[#E5E5E5] flex items-center justify-center text-[#737373] shadow-inner">
                [Illustration Convocations]
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <PublicFooter />
    </div>
  );
}
