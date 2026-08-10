import React, { useState, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../data/store';

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', role: 'player', password: '', category: 'Senior', level: 'Régional', medicalCert: { status: 'Manquant' } });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce membre ?')) {
      deleteUser(id);
      loadUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      password: user.password,
      category: user.category || 'Senior',
      level: user.level || 'Régional',
      medicalCert: { status: user.medicalCert?.status || 'Manquant' }
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strong password regex: 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères, dont 1 majuscule, 1 chiffre et 1 caractère spécial (@$!%*?&).');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'player', password: '', category: 'Senior', level: 'Régional', medicalCert: { status: 'Manquant' } });
    loadUsers();
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Admin</span>;
      case 'coach': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold">Coach</span>;
      case 'player': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Joueur</span>;
      case 'parent': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Parent</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#000000] tracking-tight">Gestion des Membres</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez les accès, les rôles et les informations des membres.</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', role: 'player', password: '', category: 'Senior', level: 'Régional', medicalCert: { status: 'Manquant' } }); setErrorMsg(''); }}
          className="px-4 py-2 bg-black text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <span className="material-icons-round text-sm">add</span> Ajouter un membre
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E5E5] mb-8">
          <h3 className="font-bold text-lg mb-4">{editingUser ? 'Modifier le membre' : 'Nouveau membre'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nom complet</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Rôle</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="player">Joueur</option>
                <option value="parent">Parent</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mot de passe</label>
              <input type="text" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Ex: SportSync2026!" />
            </div>

            {formData.role === 'player' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="U10">U10</option>
                    <option value="U11">U11</option>
                    <option value="U12">U12</option>
                    <option value="U13">U13</option>
                    <option value="U15">U15</option>
                    <option value="U17">U17</option>
                    <option value="U19">U19</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Niveau</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="Départemental">Départemental</option>
                    <option value="Régional">Régional</option>
                    <option value="National">National</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Certificat Médical</label>
                  <select value={formData.medicalCert.status} onChange={e => setFormData({...formData, medicalCert: { status: e.target.value }})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="Manquant">Manquant</option>
                    <option value="Validé">Validé</option>
                  </select>
                </div>
              </>
            )}
            {errorMsg && (
              <div className="md:col-span-2 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                <span className="material-icons-round text-[16px]">error</span> {errorMsg}
              </div>
            )}
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Membre</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 bg-cover bg-center"
                      style={user.photoUrl ? { backgroundImage: `url(${user.photoUrl})` } : { backgroundColor: user.avatarColor, color: 'white' }}
                    >
                      {!user.photoUrl && user.avatar}
                    </div>
                    <span className="font-bold text-sm text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span>{user.email}</span>
                    {user.role === 'player' && user.category && (
                      <span className="text-xs text-gray-400 mt-1">{user.category} - {user.level}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    {getRoleBadge(user.role)}
                    {user.role === 'player' && user.medicalCert && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.medicalCert.status === 'Validé' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        MÉDICAL : {user.medicalCert.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors mr-1">
                    <span className="material-icons-round text-[18px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <span className="material-icons-round text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
