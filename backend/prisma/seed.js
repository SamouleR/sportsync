import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Club Config
  await prisma.clubConfig.create({
    data: { sport: 'football', format: 'foot11' }
  });

  // Create Public Team Members
  const teamMembers = [
    { name: 'Soufian Ben Amor', role: 'RESPONSABLE INFORMATIQUE', email: 'soufian@test.fr' },
    { name: 'Sylvie Fabre', role: 'CHEFFE DE DÉPARTEMENT', email: 'sylvie@test.fr' }
  ];
  for (const m of teamMembers) {
    await prisma.publicTeamMember.create({ data: m });
  }

  // Create Users
  const users = [
    { name: 'Admin Dubois', email: 'admin@sportsync.fr', password: 'admin123', role: 'admin', team: 'Équipe Senior', avatar: 'AD', avatarColor: 'hsl(10,70%,50%)' },
    { name: 'Coach Martin', email: 'coach@sportsync.fr', password: 'coach123', role: 'coach', team: 'Équipe Senior', avatar: 'CM', avatarColor: 'hsl(50,70%,50%)' },
    { name: 'Samuel Ralaikoa', email: 'samuelralaikoa@gmail.com', password: 'samuel123', role: 'coach', team: 'Équipe Senior', avatar: 'SR', avatarColor: 'hsl(280,70%,50%)' },
    { name: 'Lucas Dupont', email: 'lucas@sportsync.fr', password: 'joueur123', role: 'player', team: 'Équipe Senior', avatar: 'LD', avatarColor: 'hsl(120,70%,50%)', position: 'Milieu', category: 'Senior', level: 'Régional', medicalStatus: 'Validé', stats: { create: { rating: 85, stamina: 92, form: 8.5 } } },
    { name: 'Théo Bernard', email: 'theo@sportsync.fr', password: 'joueur123', role: 'player', team: 'Équipe Senior', avatar: 'TB', avatarColor: 'hsl(200,70%,50%)', position: 'Défenseur', category: 'Senior', level: 'Régional', medicalStatus: 'Manquant', stats: { create: { rating: 78, stamina: 88, form: 7.2 } } }
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
