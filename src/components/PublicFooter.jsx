import React from 'react';

export default function PublicFooter() {
  return (
    <footer className="w-full bg-[#000000] text-white py-6 z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="material-icons-round text-[14px]">sports_soccer</span>
          <span className="font-['Montserrat'] font-bold tracking-tight text-white">SportSync</span>
          <span>© 2026. Tous droits réservés.</span>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">CGU</a>
        </div>
      </div>
    </footer>
  );
}
