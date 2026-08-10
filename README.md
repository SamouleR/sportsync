# SportSync ⚽️

SportSync est une application web moderne de gestion de club de sport (focalisée sur le football, mais adaptable à d'autres sports), conçue pour faciliter la communication et l'organisation entre l'administration, les entraîneurs, les joueurs et les parents.

## 🌟 Fonctionnalités Principales

### 1. Dashboard Multi-Rôles
L'application propose une interface personnalisée selon le rôle de l'utilisateur connecté :
- **Administrateur** : Gestion globale du club, des membres, ajout d'entraînements et de matchs, gestion des permissions.
- **Coach** : Création des compositions tactiques, convocation des joueurs, suivi des statistiques et des présences, ajout de commentaires privés sur les joueurs.
- **Joueur** : Visualisation de son planning, de ses statistiques de match et de ses convocations.
- **Parent** : Espace dédié pour suivre le planning de ses enfants, suivre les matchs en direct, régler les cotisations (finances) et déclarer les absences.

### 2. Espace "Live Match" (Suivi en Direct)
- Un tableau de bord complet permettant au coach de lancer un match en direct.
- **Caméra** : Intégration du flux webcam pour simuler une retransmission en direct ou enregistrer le match.
- **Chronologie** : Ajout d'événements (Buts, Cartons) en temps réel.
- **Côté Parents** : Les parents peuvent se connecter à la page Live et voir le score, le chronomètre, la vidéo et les événements s'actualiser en temps réel de manière réactive (sans rafraîchir la page).
- **Statistiques** : À la fin du match, le coach peut clôturer la rencontre, ce qui met à jour la forme et le score global des joueurs (ex: un buteur voit sa "Forme" augmenter).

### 3. Tactique et Composition (Lineup Builder)
- Interface de composition "Drag & Drop" (glisser-déposer).
- Possibilité de modifier dynamiquement le dispositif tactique à la volée (ex: 4-4-2, 4-2-3-1, 4-3-3, 3-5-2 pour le foot à 11).
- Traduction complète des postes en français (Gardien, Buteur, Milieu Défensif, etc.).
- Intégration de photos de profil pour un rendu professionnel.

### 4. Gestion Avancée des Effectifs
- Visualisation de l'effectif sous forme de grille adaptative.
- **Fiches Joueurs** : Édition des caractéristiques d'un joueur, gestion de sa catégorie (U11, U13, Senior...), de son niveau (Régional, Départemental), et du statut de son Certificat Médical (Validé / Manquant).
- Le coach peut laisser des notes privées sur l'évolution d'un joueur.

### 5. Sécurité Renforcée
- Exigence d'un mot de passe fort à l'inscription et la modification des profils (Majuscule, minuscule, chiffre, caractère spécial, 8 caractères minimum).
- Simulation de validation par Authentification à Double Facteur (2FA - Email) lors de la connexion pour protéger les accès.

### 6. Design et Expérience Utilisateur (UI/UX)
- Interface Glassmorphism (effets de transparence et de flou, `backdrop-filter`).
- Design ultra-réactif (Responsive) s'adaptant aussi bien sur écrans d'ordinateur que sur mobiles et tablettes.
- Micro-animations fluides.

## 🛠️ Stack Technique

- **Frontend** : React.js (Vite)
- **Styling** : Tailwind CSS + CSS Natif (Glassmorphism & animations)
- **Base de données / État** : Gestion d'état locale persistante et réactive.
- **Icônes** : Google Material Icons.
- **Photos de profil** : Pravatar (génération dynamique).

## 🚀 Installation & Démarrage

1. Cloner le dépôt :
\`\`\`bash
git clone https://github.com/SamouleR/sportsync.git
\`\`\`

2. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

3. Lancer le serveur de développement :
\`\`\`bash
npm run dev
\`\`\`

4. Ouvrez \`http://localhost:5173\` dans votre navigateur.

## 👥 Comptes de démonstration

L'application intègre des données de test. Utilisez l'un de ces comptes (Mot de passe: \`123\`) pour essayer les différentes interfaces :
- **Admin** : admin@sportsync.fr
- **Coach** : coach@sportsync.fr
- **Parent** : parent@sportsync.fr
- **Joueur** : lucas@sportsync.fr
