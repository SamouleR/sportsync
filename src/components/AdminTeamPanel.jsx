import React, { useState, useEffect } from 'react';
import { getPublicTeam, addPublicTeamMember, updatePublicTeamMember, deletePublicTeamMember } from '../data/store';
import { useToast } from '../App';

export default function AdminTeamPanel() {
  const [team, setTeam] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const { showToast } = useToast();

  const refreshTeam = () => {
    setTeam(getPublicTeam());
  };

  useEffect(() => {
    refreshTeam();
  }, []);

  const handleAdd = () => {
    setCurrentMember({ name: '', role: '', email: '', photoUrl: '' });
    setIsEditing(true);
  };

  const handleEdit = (member) => {
    setCurrentMember({ ...member });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      deletePublicTeamMember(id);
      showToast("Membre supprimé");
      refreshTeam();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentMember.id) {
      updatePublicTeamMember(currentMember.id, currentMember);
      showToast("Membre mis à jour");
    } else {
      addPublicTeamMember(currentMember);
      showToast("Membre ajouté");
    }
    setIsEditing(false);
    setCurrentMember(null);
    refreshTeam();
  };

  if (isEditing) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm mb-4">
          <span className="material-icons-round text-[18px]">arrow_back</span>
          Retour
        </button>
        <h2 className="text-2xl font-bold font-['Montserrat'] text-[#000000] mb-6">
          {currentMember.id ? 'Modifier un membre' : 'Ajouter un membre'}
        </h2>
        
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="mb-4">
            <label className="input-label">Nom complet</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={currentMember.name}
              onChange={e => setCurrentMember({...currentMember, name: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="input-label">Rôle / Fonction</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={currentMember.role}
              onChange={e => setCurrentMember({...currentMember, role: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="input-label">Email de contact</label>
            <input 
              required
              type="email" 
              className="input-field" 
              value={currentMember.email}
              onChange={e => setCurrentMember({...currentMember, email: e.target.value})}
            />
          </div>
          <div className="flex gap-4 mt-8">
            <button type="submit" className="btn btn-primary">Enregistrer</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2 uppercase font-['Montserrat']">
            Équipe Publique
          </h1>
          <p className="text-[#404040]">Gérez les membres affichés sur la page d'accueil (Notre Équipe).</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          <span className="material-icons-round">person_add</span>
          Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E5E5]">
              <th className="p-4 font-semibold text-[0.8rem] text-[#737373] uppercase tracking-wider w-[25%]">Nom</th>
              <th className="p-4 font-semibold text-[0.8rem] text-[#737373] uppercase tracking-wider w-[40%]">Rôle</th>
              <th className="p-4 font-semibold text-[0.8rem] text-[#737373] uppercase tracking-wider w-[20%]">Email</th>
              <th className="p-4 font-semibold text-[0.8rem] text-[#737373] uppercase tracking-wider text-right w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-[#737373]">
                  Aucun membre défini.
                </td>
              </tr>
            ) : (
              team.map(member => (
                <tr key={member.id} className="border-b border-[#E5E5E5] hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-[#000000]">{member.name}</td>
                  <td className="p-4 text-[0.85rem] text-[#404040] pr-8" title={member.role}>
                    <div className="line-clamp-2">{member.role}</div>
                  </td>
                  <td className="p-4 text-[0.85rem] text-[#737373]">{member.email}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(member)} className="btn btn-icon btn-ghost text-[#404040] hover:text-[#000000]">
                        <span className="material-icons-round text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="btn btn-icon btn-ghost text-red-600 hover:text-red-800">
                        <span className="material-icons-round text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
