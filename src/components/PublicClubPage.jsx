import React, { useState, useEffect } from 'react';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';
import { getPublicTeam } from '../data/store';

export default function PublicClubPage({ onNavigate, currentView, onLoginClick }) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setTeam(getPublicTeam());
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative text-[#000000]">
      <PublicNavbar onNavigate={onNavigate} currentView={currentView} onLoginClick={onLoginClick} />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E8F0FE] rounded-full blur-[100px] -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold font-['Montserrat'] mb-6 tracking-tight text-center">
          Le Club<span className="text-[#404040]">.</span>
        </h1>
        <p className="text-lg text-[#404040] mb-24 max-w-2xl mx-auto text-center leading-relaxed">
          Découvrez ceux qui font vivre notre club au quotidien, nos différentes catégories et nos infrastructures de qualité.
        </p>

        {/* Team Section */}
        <section id="team" className="mb-24">
          <h2 className="text-3xl font-extrabold font-['Montserrat'] mb-12 tracking-tight">Notre Staff</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
            {team.map((member) => (
              <div key={member.id} className="flex flex-col">
                <div className="w-full aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center mb-6 text-[#737373] text-sm font-medium">
                  Photo de {member.name}
                </div>
                <h3 className="text-lg font-bold text-[#000000] font-['Montserrat'] mb-1">{member.name}</h3>
                <p className="text-[0.65rem] font-bold text-[#000000] uppercase tracking-wider mb-2 leading-relaxed">
                  {member.role}
                </p>
                <a href={`mailto:${member.email}`} className="text-xs text-[#737373] hover:text-[#000000] transition-colors mt-auto">
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Infrastructures */}
        <section id="infrastructures">
          <h2 className="text-3xl font-extrabold font-['Montserrat'] mb-12 tracking-tight">Nos Infrastructures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video bg-gray-50 rounded-3xl flex items-center justify-center text-[#737373] border border-[#E5E5E5]">
              [Photo Terrain Principal]
            </div>
            <div className="aspect-video bg-gray-50 rounded-3xl flex items-center justify-center text-[#737373] border border-[#E5E5E5]">
              [Photo Vestiaires & Club House]
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
