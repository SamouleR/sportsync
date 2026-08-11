import React, { useState } from 'react';

export default function PublicNavbar({ onNavigate, currentView, onLoginClick }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navLinkClass = (view) => 
    `hover:text-[#0f172a] pb-1 transition-colors font-medium text-[0.9rem] flex items-center gap-1 cursor-pointer ${
      currentView === view 
        ? 'text-[#0f172a] font-bold' 
        : 'text-[#475569]'
    }`;

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between z-50 sticky top-0 bg-white border-b border-[#E5E5E5] font-['Montserrat']">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
        <div className="flex items-center gap-1">
           <span className="font-extrabold text-3xl tracking-tighter text-[#22c55e]">S<span className="text-[#0f172a]">E</span></span>
           <span className="font-medium text-xl tracking-tight text-[#0f172a] ml-1">SportSync</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-8 relative h-full">
        {/* Dropdown Pour les clubs */}
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => setActiveDropdown('clubs')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className={`${navLinkClass('clubs')} py-2`}>
            Pour les clubs
            <span className="material-icons-round text-[16px] text-[#475569] group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
          
          {activeDropdown === 'clubs' && (
            <div className="absolute top-[40px] left-[-100px] pt-4 w-[800px]">
              <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xl p-8 flex gap-8">
                {/* Column 1 */}
                <div className="w-1/3 border-r border-[#E5E5E5] pr-6">
                  <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">NOTRE LOGICIEL DE GESTION TOUT-EN-UN</h4>
                  <div className="flex flex-col gap-3">
                    <a href="#" className="flex items-center gap-3 text-[#0f172a] hover:text-[#22c55e] font-bold text-sm transition-colors group/link">
                      <span className="material-icons-round text-[18px] text-[#0f172a] group-hover/link:text-[#22c55e]">arrow_forward</span>
                      Découvrir
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                      <span className="material-icons-round text-[18px] text-[#94a3b8]">local_offer</span>
                      Offres clubs
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                      <span className="material-icons-round text-[18px] text-[#94a3b8]">campaign</span>
                      Faire sponsoriser mon club
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#22c55e] hover:text-[#16a34a] font-bold text-sm transition-colors mt-2">
                      <span className="material-icons-round text-[18px]">verified_user</span>
                      Inscrire mon club
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#22c55e] hover:text-[#16a34a] font-bold text-sm transition-colors">
                      <span className="material-icons-round text-[18px]">campaign</span>
                      Demander une démo
                    </a>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div className="w-1/3 pr-6">
                   <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">FONCTIONNALITÉS</h4>
                   <div className="flex flex-col gap-4">
                      <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[18px] text-[#0f172a]">payment</span>
                        Inscriptions & Paiement
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[18px] text-[#0f172a]">calendar_today</span>
                        Calendrier & Planning
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[18px] text-[#0f172a]">chat</span>
                        Communication & Messagerie
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[18px] text-[#0f172a]">checkroom</span>
                        Gestion des équipes
                      </a>
                   </div>
                </div>

                {/* Column 3 */}
                <div className="w-1/3">
                   <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">SPORTS</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <a href="#" className="flex items-center gap-2 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[16px] text-[#0f172a]">sports_soccer</span> Football
                      </a>
                      <a href="#" className="flex items-center gap-2 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[16px] text-[#0f172a]">sports_rugby</span> Rugby
                      </a>
                      <a href="#" className="flex items-center gap-2 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[16px] text-[#0f172a]">sports_basketball</span> Basketball
                      </a>
                      <a href="#" className="flex items-center gap-2 text-[#334155] hover:text-[#0f172a] text-sm transition-colors">
                        <span className="material-icons-round text-[16px] text-[#0f172a]">sports_handball</span> Handball
                      </a>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Pour les équipes */}
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => setActiveDropdown('equipes')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className={`${navLinkClass('equipes')} py-2`}>
            Pour les équipes
            <span className="material-icons-round text-[16px] text-[#475569] group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
        </div>

        {/* Sponsoring */}
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => setActiveDropdown('sponsoring')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className={`${navLinkClass('sponsoring')} py-2`}>
            Sponsoring
            <span className="material-icons-round text-[16px] text-[#475569] group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
        </div>

        {/* Ressources */}
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => setActiveDropdown('ressources')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className={`${navLinkClass('ressources')} py-2`}>
            Ressources
            <span className="material-icons-round text-[16px] text-[#475569] group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a href="#" className="hidden xl:block text-[#0f172a] hover:text-[#0f172a] font-bold text-sm mr-2 transition-colors">
          Rejoindre une équipe
        </a>
        
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 rounded-full bg-[#0f172a] text-white font-bold text-sm hover:bg-[#1e293b] transition-colors shadow-md"
        >
          Connexion
        </button>
        
        <button 
          className="hidden sm:flex px-5 py-2.5 rounded-full bg-[#22c55e] text-white font-bold text-sm hover:bg-[#16a34a] transition-colors items-center gap-1 shadow-md"
        >
          Inscription
          <span className="material-icons-round text-[18px]">arrow_drop_down</span>
        </button>
      </div>
    </nav>
  );
}
