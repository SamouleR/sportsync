import React, { useState } from 'react';

export default function PublicNavbar({ onNavigate, currentView, onLoginClick }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navLinkClass = (view) => 
    `hover:text-[#000000] pb-1 transition-colors font-bold capitalize tracking-wider text-[0.85rem] flex items-center gap-1 cursor-pointer ${
      currentView === view 
        ? 'text-[#000000] border-b-[3px] border-[#000000]' 
        : 'text-[#737373] border-b-[3px] border-transparent'
    }`;

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between z-50 sticky top-0 bg-white border-b border-[#E5E5E5] font-['Montserrat']">
      <div className="flex items-center gap-1 cursor-pointer" onClick={() => onNavigate('landing')}>
        <span className="font-extrabold text-2xl tracking-tight text-[#000000]">
          SportSync<span className="text-[#000000]">.</span>
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-8 relative">
        <div onClick={() => onNavigate('landing')} className={navLinkClass('landing')}>
          Accueil
        </div>
        
        {/* Dropdown Le Club */}
        <div 
          className="relative group"
          onMouseEnter={() => setActiveDropdown('club')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className={navLinkClass('club')}>
            Le Club
            <span className="material-icons-round text-[16px] text-[#737373] group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
          
          {activeDropdown === 'club' && (
            <div className="absolute top-full left-0 pt-4 w-72">
              <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-lg p-2 flex flex-col gap-1">
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-start gap-3 transition-colors" onClick={() => onNavigate('club')}>
                  <span className="text-[#A3A3A3] mt-0.5">→</span>
                  <div>
                    <div className="font-bold text-[#404040] text-sm">Notre Histoire</div>
                    <div className="text-[#A3A3A3] text-xs mt-0.5">Découvrez les origines du club</div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-start gap-3 transition-colors" onClick={() => onNavigate('club')}>
                  <span className="text-[#A3A3A3] mt-0.5">→</span>
                  <div>
                    <div className="font-bold text-[#404040] text-sm">Notre Équipe</div>
                    <div className="text-[#A3A3A3] text-xs mt-0.5">Les dirigeants et entraîneurs</div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-start gap-3 transition-colors" onClick={() => onNavigate('club')}>
                  <span className="text-[#A3A3A3] mt-0.5">→</span>
                  <div>
                    <div className="font-bold text-[#404040] text-sm">Infrastructures</div>
                    <div className="text-[#A3A3A3] text-xs mt-0.5">Nos terrains et locaux</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div onClick={() => onNavigate('features')} className={navLinkClass('features')}>
          Fonctionnalités
        </div>
        
        <div onClick={() => onNavigate('parents')} className={navLinkClass('parents')}>
          Espace Parents
        </div>
        
        <div onClick={() => onNavigate('contact')} className={navLinkClass('contact')}>
          Contact
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#737373] hover:text-[#000000] hover:bg-gray-200 transition-colors">
          <span className="material-icons-round text-[20px]">light_mode</span>
        </button>
        
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 rounded bg-[#000000] text-white font-bold text-xs hover:bg-[#404040] transition-colors flex items-center gap-2 capitalize tracking-wide"
        >
          Se Connecter
          <span className="material-icons-round text-[16px]">arrow_forward</span>
        </button>
      </div>
    </nav>
  );
}
