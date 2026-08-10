import React from 'react';

export default function PublicNavbar({ onNavigate, currentView, onLoginClick }) {
  const navLinkClass = (view) => 
    `hover:text-[#000000] pb-1 transition-colors font-bold uppercase tracking-wider text-[0.8rem] ${
      currentView === view 
        ? 'text-[#000000] border-b-[3px] border-[#000000]' 
        : 'text-[#737373] border-b-[3px] border-transparent'
    }`;

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between z-50 sticky top-0 bg-white border-b border-[#E5E5E5]">
      <div className="flex items-center gap-1 cursor-pointer" onClick={() => onNavigate('landing')}>
        <span className="font-['Montserrat'] font-extrabold text-2xl tracking-tight text-[#000000]">
          SportSync<span className="text-[#000000]">.</span>
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <button onClick={() => onNavigate('landing')} className={navLinkClass('landing')}>
          Accueil
        </button>
        <button onClick={() => onNavigate('club')} className={navLinkClass('club')}>
          Le Club
        </button>
        <button onClick={() => onNavigate('features')} className={navLinkClass('features')}>
          Fonctionnalités
        </button>
        <button onClick={() => onNavigate('parents')} className={navLinkClass('parents')}>
          Espace Parents
        </button>
        <button onClick={() => onNavigate('contact')} className={navLinkClass('contact')}>
          Contact
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#737373] hover:text-[#000000] hover:bg-gray-200 transition-colors">
          <span className="material-icons-round text-[20px]">light_mode</span>
        </button>
        
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 rounded bg-[#000000] text-white font-bold text-xs hover:bg-[#404040] transition-colors flex items-center gap-2 uppercase tracking-wide"
        >
          Se Connecter
          <span className="material-icons-round text-[16px]">arrow_forward</span>
        </button>
      </div>
    </nav>
  );
}
