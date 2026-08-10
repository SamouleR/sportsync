const STORAGE_KEY = 'sportsync_data';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'sportsync_secure_key_2026';

// ===== Sport Configuration Constants =====
export const SPORTS_CONFIG = {
  football: {
    label: 'Football',
    icon: 'sports_soccer',
    formats: {
      'foot11': {
        label: 'Foot à 11',
        titulaires: 11,
        remplacants: 7,
        maxConvocation: 18,
        positions: ['Gardien','Défenseur central','Latéral droit','Latéral gauche','Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Avant-centre','Second attaquant'],
        positionCategories: {
          'Gardien': ['Gardien'],
          'Défenseurs': ['Défenseur central','Latéral droit','Latéral gauche'],
          'Milieux': ['Milieu défensif','Milieu central','Milieu offensif'],
          'Attaquants': ['Ailier droit','Ailier gauche','Avant-centre','Second attaquant'],
        },
      },
      'foot5': {
        label: 'Foot à 5',
        titulaires: 5,
        remplacants: 3,
        maxConvocation: 8,
        positions: ['Gardien','Défenseur','Pivot','Ailier droit','Ailier gauche'],
        positionCategories: {
          'Gardien': ['Gardien'],
          'Défenseurs': ['Défenseur'],
          'Attaquants': ['Pivot','Ailier droit','Ailier gauche'],
        },
      },
    },
  },
  basketball: {
    label: 'Basketball',
    icon: 'sports_basketball',
    formats: {
      'basket5x5': {
        label: 'Basket 5x5',
        titulaires: 5,
        remplacants: 7,
        maxConvocation: 12,
        positions: ['Meneur','Arrière','Ailier','Ailier fort','Pivot'],
        positionCategories: {
          'Extérieurs': ['Meneur','Arrière'],
          'Intérieurs': ['Ailier','Ailier fort','Pivot'],
        },
      },
      'basket3x3': {
        label: 'Basket 3x3',
        titulaires: 3,
        remplacants: 1,
        maxConvocation: 4,
        positions: ['Meneur','Ailier','Pivot'],
        positionCategories: {
          'Postes': ['Meneur','Ailier','Pivot'],
        },
      },
    },
  },
};

const defaultData = {
  clubConfig: {
    sport: 'football',
    format: 'foot11',
  },
  publicTeam: [
    { id: 'pt-1', name: 'Soufian Ben Amor', role: 'RESPONSABLE DES ENSEIGNEMENTS EN INFORMATIQUE', email: 'soufian.ben-amor@uvsq.fr', photoUrl: '' },
    { id: 'pt-2', name: 'Olivier Le Cadet', role: 'RESPONSABLE DES ENSEIGNEMENTS DE MATHÉMATIQUES ET DE DÉVELOPPEMENT WEB. DIRECTEUR DES ÉTUDES', email: 'lecadet@iut-velizy.uvsq.fr', photoUrl: '' },
    { id: 'pt-3', name: 'Jean-Marie Clech', role: 'PROFESSIONNEL, GRAPHIC DESIGN, INFOGRAPHIE', email: 'jean-marie.clech@uvsq.fr', photoUrl: '' },
    { id: 'pt-4', name: 'Sylvie Fabre', role: 'ENSEIGNANTE EN COMMUNICATION, PPP ET GESTION DE PROJET, RESPONSABLE DES STAGES ET DE LA POURSUITE D\'ÉTUDES. CHEFFE DE DÉPARTEMENT MMI', email: 'sylvie.fabre@uvsq.fr', photoUrl: '' },
    { id: 'pt-5', name: 'Cédric Fournerie', role: 'ENSEIGNANT RÉSEAUX ET TÉLÉCOMS', email: 'cedric.fournerie@uvsq.fr', photoUrl: '' },
    { id: 'pt-6', name: 'Xavier Hautbois', role: 'MAÎTRE DE CONFÉRENCES EN ART (MCF), RESPONSABLE DES ENSEIGNEMENTS DE MUSIQUE, ESTHÉTIQUE ET INTERACTIVITÉ', email: 'xavier.hautbois@orange.fr', photoUrl: '' },
    { id: 'pt-7', name: 'Thérèse Lepage', role: 'PROFESSEURE AGRÉGÉE D\'ANGLAIS (PRAG), RESPONSABLE DES ENSEIGNEMENTS D\'ANGLAIS', email: 'therese.crosnier@uvsq.fr', photoUrl: '' },
    { id: 'pt-8', name: 'Michel Pinosa', role: 'PROFESSIONNEL, ARTS PLASTIQUES, GRAPHIC DESIGN & WEB DESIGN', email: 'mmi@michelpinosa.com', photoUrl: '' }
  ],
  users: [
    { id:'admin-1', name:'Admin Dubois', email:'admin@sportsync.fr', password:'admin123', role:'admin', team:'Équipe Senior', avatar:'AD' },
    { id:'coach-1', name:'Coach Martin', email:'coach@sportsync.fr', password:'coach123', role:'coach', team:'Équipe Senior', avatar:'CM' },
    { id:'parent-1', name:'Parent Dupont', email:'parent@sportsync.fr', password:'parent123', role:'parent', children: ['player-1', 'player-2'], avatar:'PD', finances: { balance: -150, transactions: [{ id: 1, desc: 'Cotisation Annuelle', amount: -150, date: '2026-01-15' }] } },
    { id:'player-1', name:'Lucas Dupont', email:'lucas@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'LD', photoUrl: 'https://i.pravatar.cc/150?u=player-1', position:'Milieu', category: 'Senior', level: 'Régional', medicalCert: { status: 'Validé' }, coachComment: 'Très régulier', stats: { rating: 85, stamina: 92, form: 8.5, pace: 88, passing: 82, shooting: 75, defense: 60 } },
    { id:'player-2', name:'Théo Bernard', email:'theo@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'TB', photoUrl: 'https://i.pravatar.cc/150?u=player-2', position:'Défenseur', category: 'Senior', level: 'Régional', medicalCert: { status: 'Manquant' }, coachComment: 'À surveiller physiquement', stats: { rating: 78, stamina: 88, form: 7.2, pace: 75, passing: 65, shooting: 40, defense: 85 } },
    { id:'player-3', name:'Mathis Leroy', email:'mathis@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'ML', photoUrl: 'https://i.pravatar.cc/150?u=player-3', position:'Attaquant', category: 'Senior', level: 'Départemental', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 82, stamina: 75, form: 9.1 } },
    { id:'player-4', name:'Nathan Moreau', email:'nathan@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'NM', photoUrl: 'https://i.pravatar.cc/150?u=player-4', position:'Gardien', category: 'Senior', level: 'Régional', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 88, stamina: 99, form: 8.8 } },
    { id:'player-5', name:'Raphaël Simon', email:'raphael@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'RS', photoUrl: 'https://i.pravatar.cc/150?u=player-5', position:'Milieu', category: 'Senior', level: 'Régional', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 80, stamina: 85, form: 7.8 } },
    { id:'player-6', name:'Hugo Laurent', email:'hugo@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'HL', photoUrl: 'https://i.pravatar.cc/150?u=player-6', position:'Défenseur', category: 'Senior', level: 'Départemental', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 74, stamina: 80, form: 6.5 } },
    { id:'player-7', name:'Léo Fournier', email:'leo@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'LF', photoUrl: 'https://i.pravatar.cc/150?u=player-7', position:'Attaquant', category: 'Senior', level: 'Régional', medicalCert: { status: 'Manquant' }, coachComment: '', stats: { rating: 79, stamina: 82, form: 7.0 } },
    { id:'player-8', name:'Enzo Girard', email:'enzo@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'EG', photoUrl: 'https://i.pravatar.cc/150?u=player-8', position:'Milieu', category: 'Senior', level: 'Départemental', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 83, stamina: 90, form: 8.2 } },
    { id:'player-9', name:'Adam Roux', email:'adam@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'AR', photoUrl: 'https://i.pravatar.cc/150?u=player-9', position:'Défenseur', category: 'Senior', level: 'Régional', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 76, stamina: 78, form: 6.9 } },
    { id:'player-10', name:'Jules Bonnet', email:'jules@sportsync.fr', password:'joueur123', role:'player', team:'Équipe Senior', avatar:'JB', photoUrl: 'https://i.pravatar.cc/150?u=player-10', position:'Milieu', category: 'Senior', level: 'Départemental', medicalCert: { status: 'Validé' }, coachComment: '', stats: { rating: 84, stamina: 86, form: 8.4 } },
  ],
  trainings: [
    { id:'training-1', title:'Entraînement physique & tactique', date:'2026-05-05', startTime:'19:30', endTime:'21:00', location:'Terrain synthétique principal', message:'Prévoir des baskets de course et des protège-tibias.', team:'Équipe Senior', createdBy:'coach-1', createdAt:'2026-04-29T10:00:00' },
    { id:'training-2', title:'Séance technique — passes et contrôle', date:'2026-05-08', startTime:'18:00', endTime:'19:30', location:'Gymnase municipal', message:'Focus sur les transmissions courtes.', team:'Équipe Senior', createdBy:'coach-1', createdAt:'2026-04-29T10:30:00' },
    { id:'training-3', title:'Match amical inter-équipes', date:'2026-05-12', startTime:'20:00', endTime:'21:30', location:'Stade Jean Bouin', message:'Maillots blancs obligatoires.', team:'Équipe Senior', createdBy:'coach-1', createdAt:'2026-04-30T08:00:00' },
  ],
  responses: [
    { id:'r1', trainingId:'training-1', playerId:'player-1', status:'present', remark:'' },
    { id:'r2', trainingId:'training-1', playerId:'player-2', status:'present', remark:'' },
    { id:'r3', trainingId:'training-1', playerId:'player-3', status:'absent', remark:'Blessure au genou' },
    { id:'r4', trainingId:'training-1', playerId:'player-4', status:'late', arrivalTime:'19:45', remark:'Travail' },
    { id:'r5', trainingId:'training-1', playerId:'player-5', status:'present', remark:'' },
    { id:'r6', trainingId:'training-1', playerId:'player-6', status:'present', remark:'' },
    { id:'r7', trainingId:'training-2', playerId:'player-1', status:'present', remark:'' },
    { id:'r8', trainingId:'training-2', playerId:'player-2', status:'absent', remark:'Examen' },
  ],
  messages: [
    { id:'msg-1', trainingId:'training-1', userId:'coach-1', text:'N\'oubliez pas vos protège-tibias !', timestamp:'2026-05-04T16:00:00' },
    { id:'msg-2', trainingId:'training-1', userId:'player-1', text:'Bien reçu coach ! 👍', timestamp:'2026-05-04T16:15:00' },
    { id:'msg-3', trainingId:'training-1', userId:'player-5', text:'Quelqu\'un pour le covoiturage ?', timestamp:'2026-05-04T17:00:00' },
  ],
  medicalReports: [
    { id:'med-1', playerId:'player-3', type:'blessure', zone:'Genou droit', severity:'modérée', description:'Douleur au ligament interne après un contact.', startDate:'2026-04-28', estimatedReturn:'2026-05-15', status:'actif', createdAt:'2026-04-28T14:00:00' },
    { id:'med-2', playerId:'player-7', type:'gêne', zone:'Cheville gauche', severity:'légère', description:'Légère entorse lors du dernier match.', startDate:'2026-05-01', estimatedReturn:'2026-05-06', status:'actif', createdAt:'2026-05-01T10:00:00' },
  ],
  matches: [
    {
      id: 'm1', title: 'Championnat J14', date: new Date(Date.now() + 86400000*3).toISOString().split('T')[0], startTime: '15:00', endTime: '17:00',
      location: 'Stade Municipal', opponent: 'FC Ville', type: 'domicile', team: 'Équipe Senior',
      convocations: ['player-1', 'player-2', 'player-3'], convocationStatus: { 'player-1':'accepté', 'player-2':'décliné' },
      lineup: { 0: 'player-4', 1: 'player-2', 6: 'player-1', 9: 'player-3' },
      events: [],
      liveState: {
        time: 0,
        isRunning: false,
        scoreHome: 0,
        scoreAway: 0,
        events: []
      }
    },
    {
      id: 'm2', title: 'Coupe Régionale', date: new Date(Date.now() + 86400000*10).toISOString().split('T')[0], startTime: '20:00', endTime: '22:00',
      location: 'Stade Extérieur', opponent: 'AS Banlieue', type: 'extérieur', team: 'Équipe Senior',
      convocations: [], convocationStatus: {}, lineup: {}, events: [],
      liveState: {
        time: 0,
        isRunning: false,
        scoreHome: 0,
        scoreAway: 0,
        events: []
      }
    },
  ],
  notifications: [
    { id:'notif-1', userId:'player-1', type:'training', title:'Nouvel entraînement', message:'Entraînement physique & tactique le 05/05', read:false, createdAt:'2026-04-29T10:00:00', link:'training-1' },
    { id:'notif-2', userId:'player-1', type:'match', title:'Convocation match', message:'Vous êtes convoqué pour le match vs AS Rivière', read:false, createdAt:'2026-04-30T09:00:00', link:'match-1' },
  ],
  clubName: 'FC SportSync',
  publicMessages: [
    { id: 'pm-1', name: 'Jean Dupont', email: 'jean@exemple.com', subject: 'Demande de démo', message: 'Bonjour, je souhaiterais une démo pour notre club.', timestamp: '2026-05-01T12:00:00', read: false }
  ],
};

function initStore() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(defaultData), SECRET_KEY).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  }
}
function getData() { 
  initStore(); 
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (e) {
    console.error("Error decrypting data, falling back to default", e);
    return defaultData;
  }
}
function setData(d) { 
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(d), SECRET_KEY).toString();
  localStorage.setItem(STORAGE_KEY, encrypted); 
}

// ===== Auth =====
export function login(email, password) {
  const d = getData();
  return d.users.find(u => u.email === email && u.password === password) || null;
}

// ===== Trainings =====
export function getTrainings(team) {
  return getData().trainings.filter(t => t.team === team).sort((a,b) => new Date(a.date) - new Date(b.date));
}
export function getUpcomingTrainings(team) {
  const now = new Date(); now.setHours(0,0,0,0);
  return getTrainings(team).filter(t => new Date(t.date) >= now);
}
export function getTrainingById(id) { return getData().trainings.find(t => t.id === id) || null; }
export function createTraining(training) {
  const d = getData();
  const t = { ...training, id:'training-'+Date.now(), createdAt:new Date().toISOString() };
  d.trainings.push(t); setData(d); return t;
}
export function deleteTraining(id) {
  const d = getData();
  d.trainings = d.trainings.filter(t => t.id !== id);
  d.responses = d.responses.filter(r => r.trainingId !== id);
  d.messages = d.messages.filter(m => m.trainingId !== id);
  setData(d);
}

// ===== Responses =====
export function getResponsesForTraining(tid) { return getData().responses.filter(r => r.trainingId === tid); }
export function getPlayerResponse(tid, pid) { return getData().responses.find(r => r.trainingId === tid && r.playerId === pid) || null; }
export function setPlayerResponse(tid, pid, status, remark='', arrivalTime='') {
  const d = getData();
  const idx = d.responses.findIndex(r => r.trainingId === tid && r.playerId === pid);
  const resp = { id:'r-'+Date.now(), trainingId:tid, playerId:pid, status, remark, arrivalTime };
  if (idx >= 0) d.responses[idx] = { ...d.responses[idx], ...resp }; else d.responses.push(resp);
  setData(d); return resp;
}

// ===== Players =====
export function getPlayers(team) { return getData().users.filter(u => u.role === 'player' && u.team === team); }
export function addPlayer(p) {
  const d = getData();
  const np = { ...p, id:'player-'+Date.now(), password:'joueur123', role:'player',
    avatar:p.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),
    avatarColor:`hsl(${Math.random()*360},70%,60%)` };
  d.users.push(np); setData(d); return np;
}
export function removePlayer(pid) {
  const d = getData();
  d.users = d.users.filter(u => u.id !== pid);
  d.responses = d.responses.filter(r => r.playerId !== pid);
  setData(d);
}

// ===== Messages =====
export function getMessagesForTraining(tid) {
  return getData().messages.filter(m => m.trainingId === tid).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
}
export function sendMessage(tid, uid, text) {
  const d = getData();
  const m = { id:'msg-'+Date.now(), trainingId:tid, userId:uid, text, timestamp:new Date().toISOString() };
  d.messages.push(m); setData(d); return m;
}

// ===== Public Team Methods =====
export const getPublicTeam = () => getData().publicTeam || [];
export const addPublicTeamMember = (member) => {
  const data = getData();
  member.id = 'pt-' + Date.now();
  if (!data.publicTeam) data.publicTeam = [];
  data.publicTeam.push(member);
  saveData(data);
};
export const updatePublicTeamMember = (id, updates) => {
  const data = getData();
  const idx = (data.publicTeam || []).findIndex(m => m.id === id);
  if (idx > -1) {
    data.publicTeam[idx] = { ...data.publicTeam[idx], ...updates };
    saveData(data);
  }
};
export const deletePublicTeamMember = (id) => {
  const data = getData();
  if (!data.publicTeam) return;
  data.publicTeam = data.publicTeam.filter(m => m.id !== id);
  saveData(data);
};

// ===== Medical =====
export function getMedicalReports(team) {
  const d = getData();
  const playerIds = d.users.filter(u => u.role === 'player' && u.team === team).map(u => u.id);
  return (d.medicalReports||[]).filter(r => playerIds.includes(r.playerId)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function getMedicalReportsForPlayer(pid) {
  return (getData().medicalReports||[]).filter(r => r.playerId === pid).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function addMedicalReport(report) {
  const d = getData();
  if (!d.medicalReports) d.medicalReports = [];
  const r = { ...report, id:'med-'+Date.now(), createdAt:new Date().toISOString() };
  d.medicalReports.push(r); setData(d); return r;
}
export function updateMedicalReport(id, updates) {
  const d = getData();
  const idx = (d.medicalReports||[]).findIndex(r => r.id === id);
  if (idx >= 0) { d.medicalReports[idx] = { ...d.medicalReports[idx], ...updates }; setData(d); }
}
export function getActiveInjuries(team) {
  return getMedicalReports(team).filter(r => r.status === 'actif');
}

// ===== Matches & Convocations =====
export function getMatches(team) {
  return (getData().matches||[]).filter(m => m.team === team).sort((a,b) => new Date(a.date) - new Date(b.date));
}
export function getUpcomingMatches(team) {
  const now = new Date(); now.setHours(0,0,0,0);
  return getMatches(team).filter(m => new Date(m.date) >= now && !(m.liveState && m.liveState.isClosed));
}
export function getMatchById(id) {
  const d = getData();
  return (d.matches||[]).find(m => m.id === id);
}
export function updateMatchLiveState(id, liveState) {
  const d = getData();
  const match = (d.matches||[]).find(m => m.id === id);
  if (match) {
    match.liveState = liveState;
    setData(d);
  }
}
export function createMatch(match) {
  const d = getData();
  if (!d.matches) d.matches = [];
  const m = { ...match, id:'match-'+Date.now(), createdAt:new Date().toISOString(), convocations:[], convocationStatus:{} };
  d.matches.push(m); setData(d); return m;
}
export function updateMatchConvocations(matchId, playerIds) {
  const d = getData();
  const idx = (d.matches||[]).findIndex(m => m.id === matchId);
  if (idx >= 0) { d.matches[idx].convocations = playerIds; setData(d); }
}
export function updateMatchLineup(matchId, lineup) {
  const d = getData();
  const idx = (d.matches||[]).findIndex(m => m.id === matchId);
  if (idx >= 0) { d.matches[idx].lineup = lineup; setData(d); }
}
export function setConvocationResponse(matchId, playerId, status) {
  const d = getData();
  const idx = (d.matches||[]).findIndex(m => m.id === matchId);
  if (idx >= 0) {
    if (!d.matches[idx].convocationStatus) d.matches[idx].convocationStatus = {};
    d.matches[idx].convocationStatus[playerId] = status;
    setData(d);
  }
}
export function deleteMatch(id) {
  const d = getData();
  d.matches = (d.matches||[]).filter(m => m.id !== id);
  setData(d);
}
export function getPlayerAttendanceRate(pid, team) {
  const d = getData();
  const trainings = d.trainings.filter(t => t.team === team);
  const responses = d.responses.filter(r => r.playerId === pid);
  if (trainings.length === 0) return 0;
  const present = responses.filter(r => r.status === 'present' || r.status === 'late').length;
  return Math.round((present / trainings.length) * 100);
}

// ===== Notifications =====
export function getNotifications(userId) {
  return (getData().notifications||[]).filter(n => n.userId === userId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}
export function getUnreadCount(userId) {
  return getNotifications(userId).filter(n => !n.read).length;
}
export const markNotificationRead = (id) => {
  const data = getData();
  const notif = (data.notifications||[]).find(n => n.id === id);
  if (notif) {
    notif.read = true;
    setData(data);
  }
};

// ===== PUBLIC MESSAGES =====
export const getPublicMessages = () => {
  const data = getData();
  return data.publicMessages || [];
};

export const addPublicMessage = (msg) => {
  const data = getData();
  const newMsg = {
    ...msg,
    id: 'pm-' + Date.now(),
    timestamp: new Date().toISOString(),
    read: false
  };
  data.publicMessages = data.publicMessages || [];
  data.publicMessages.push(newMsg);
  setData(data);
  return newMsg;
};

export const deletePublicMessage = (id) => {
  const data = getData();
  data.publicMessages = (data.publicMessages || []).filter(m => m.id !== id);
  setData(data);
};

export const markPublicMessageRead = (id) => {
  const data = getData();
  const msg = (data.publicMessages || []).find(m => m.id === id);
  if (msg) {
    msg.read = true;
    setData(data);
  }
};

// ===== USERS MANAGEMENT =====
export const getUsers = () => {
  const data = getData();
  return data.users || [];
};

export const addUser = (user) => {
  const data = getData();
  const newUser = {
    ...user,
    id: `user-${Date.now()}`,
    photoUrl: `https://i.pravatar.cc/150?u=user-${Date.now()}`,
    avatar: user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),
    avatarColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    category: user.category || 'Senior',
    level: user.level || 'Départemental',
    medicalCert: { status: user.medicalCert?.status || 'Manquant' },
    coachComment: user.coachComment || '',
    stats: user.role === 'player' ? { rating: 70, form: 7.0, stamina: 99 } : undefined,
  };
  data.users.push(newUser);
  setData(data);
  return newUser;
};

export const updateUserStats = (userId, matchEvents) => {
  const data = getData();
  const user = data.users.find(u => u.id === userId);
  if (user && user.stats) {
    let ratingChange = 0;
    
    matchEvents.forEach(ev => {
      if (ev.type === 'BUT') ratingChange += 0.5;
      if (ev.type === 'PASSE D.') ratingChange += 0.3;
      if (ev.type === 'CARTON J.') ratingChange -= 0.3;
      if (ev.type === 'CARTON R.') ratingChange -= 1.0;
    });

    user.stats.rating = Math.min(99, Math.max(1, (user.stats.rating || 70) + ratingChange));
    
    // Decrease stamina and vary form randomly a bit
    user.stats.stamina = Math.max(10, (user.stats.stamina || 70) - 5);
    user.stats.form = Math.min(10, Math.max(1, (user.stats.form || 7.0) + (ratingChange > 0 ? 0.2 : -0.2)));
    
    // Round to 1 decimal for form, int for rating/stamina
    user.stats.rating = Math.round(user.stats.rating);
    user.stats.stamina = Math.round(user.stats.stamina);
    user.stats.form = Math.round(user.stats.form * 10) / 10;
    
    setData(data);
  }
};

export const closeMatch = (matchId) => {
  const data = getData();
  const match = data.matches.find(m => m.id === matchId);
  if (match) {
    match.liveState.isClosed = true;
    setData(data);
  }
};

export const updateUser = (id, updates) => {
  const data = getData();
  const idx = data.users.findIndex(u => u.id === id);
  if (idx !== -1) {
    data.users[idx] = { ...data.users[idx], ...updates };
    setData(data);
    return data.users[idx];
  }
  return null;
};

export const deleteUser = (id) => {
  const data = getData();
  data.users = data.users.filter(u => u.id !== id);
  setData(data);
};

export function markAllRead(userId) {
  const d = getData();
  (d.notifications||[]).forEach(n => { if (n.userId === userId) n.read = true; });
  setData(d);
}
export function addNotification(notif) {
  const d = getData();
  if (!d.notifications) d.notifications = [];
  d.notifications.push({ ...notif, id:'notif-'+Date.now(), read:false, createdAt:new Date().toISOString() });
  setData(d);
}

// ===== Calendar Export (iCal) =====
export function generateICS(training) {
  const dtStart = training.date.replace(/-/g,'') + 'T' + training.startTime.replace(':','') + '00';
  const dtEnd = training.date.replace(/-/g,'') + 'T' + training.endTime.replace(':','') + '00';
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SportSync//FR',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
    `SUMMARY:${training.title}`, `LOCATION:${training.location}`,
    `DESCRIPTION:${(training.message||'').replace(/\n/g,'\\n')}`,
    `UID:${training.id}@sportsync`, 'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
}
export function downloadICS(training) {
  const blob = new Blob([generateICS(training)], { type:'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `${training.title.replace(/[^a-zA-Z0-9]/g,'_')}.ics`;
  a.click(); URL.revokeObjectURL(url);
}
export function getGoogleCalendarUrl(training) {
  const s = training.date.replace(/-/g,'') + 'T' + training.startTime.replace(':','') + '00';
  const e = training.date.replace(/-/g,'') + 'T' + training.endTime.replace(':','') + '00';
  const p = new URLSearchParams({ action:'TEMPLATE', text:training.title, dates:`${s}/${e}`, location:training.location, details:training.message||'' });
  return `https://calendar.google.com/calendar/render?${p}`;
}

// ===== Helpers =====
export function getUserById(id) { return getData().users.find(u => u.id === id) || null; }
export function getClubName() { return getData().clubName; }
export function getTeams() { return ['Équipe Senior','U19','U17','U15','U13']; }
export function getLocations() { return ['Terrain synthétique principal','Gymnase municipal','Stade Jean Bouin','Terrain annexe B','Salle de musculation']; }
export function getTrainingStats(tid, team) {
  const resp = getResponsesForTraining(tid), pl = getPlayers(team);
  return { present:resp.filter(r=>r.status==='present').length, absent:resp.filter(r=>r.status==='absent').length,
    late:resp.filter(r=>r.status==='late').length, pending:pl.length-resp.length, total:pl.length };
}
export function resetData() { localStorage.removeItem(STORAGE_KEY); initStore(); }

// ===== Sport & Format Config =====
export function getClubConfig() { return getData().clubConfig || { sport:'football', format:'foot11' }; }
export function setClubConfig(sport, format) {
  const d = getData();
  d.clubConfig = { sport, format };
  setData(d);
}
export function getCurrentSportConfig() {
  const cfg = getClubConfig();
  return SPORTS_CONFIG[cfg.sport];
}
export function getCurrentFormatConfig() {
  const cfg = getClubConfig();
  return SPORTS_CONFIG[cfg.sport]?.formats[cfg.format];
}
export function getPositionsForCurrentFormat() {
  return getCurrentFormatConfig()?.positions || [];
}
export function getMaxConvocation() {
  return getCurrentFormatConfig()?.maxConvocation || 20;
}
export function getFormatLabel() {
  const cfg = getClubConfig();
  const sport = SPORTS_CONFIG[cfg.sport];
  const format = sport?.formats[cfg.format];
  return `${sport?.label || ''} — ${format?.label || ''}`;
}

