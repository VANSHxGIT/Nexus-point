import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.credential.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create default users
  const user1 = await prisma.user.create({
    data: {
      id: 'u1',
      name: 'Pilot_Alex',
      avatar: 'https://picsum.photos/seed/pilot/40/40',
      bio: 'Loves tactical shooters and building complex survival bases.',
      preferences: 'I prefer strategic play, good communication, and team-oriented players. Not a fan of toxicity.',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'u2',
      name: 'Sarah Craft',
      avatar: 'https://picsum.photos/seed/102/150/150',
      bio: 'Casual gamer looking for friendly groups to explore new RPG worlds.',
      preferences: 'I enjoy immersive storytelling, exploring map corners, and chatting about game lore.',
    },
  });

  console.log('Seeded users:', [user1.name, user2.name]);

  // 3. Create default credentials for the main user (u1)
  await prisma.credential.createMany({
    data: [
      { platform: 'Valorant', handle: 'Ghost#4432', status: 'Public', userId: 'u1' },
      { platform: 'Minecraft', handle: 'TheBuilder_X', status: 'Private', userId: 'u1' },
      { platform: 'Discord', handle: 'OMNIXAdmin#0001', status: 'Mutuals Only', userId: 'u1' },
      { platform: 'Steam', handle: 'Sarahrider', status: 'Public', userId: 'u1' },
    ],
  });

  console.log('Seeded credentials.');

  // 4. Create default reviews
  await prisma.review.createMany({
    data: [
      {
        id: 'r1',
        user: 'CyberCat',
        avatar: 'https://picsum.photos/seed/cat/40/40',
        game: 'Minecraft',
        rating: 5,
        content: 'Just discovered an amazing seed for survival! The cave systems are incredible and the resource generation is top notch. Anyone want the coords?',
        likes: 24,
        comments: 12,
      },
      {
        id: 'r2',
        user: 'ShadowBlade',
        avatar: 'https://picsum.photos/seed/shadow/40/40',
        game: 'Valorant',
        rating: 4,
        content: 'The new map updates for Haven are actually pretty balanced. Defender rotations feel more dynamic now. Definitely makes B site more viable.',
        likes: 56,
        comments: 8,
      },
    ],
  });

  console.log('Seeded reviews.');

  // 5. Create default hub chat messages
  await prisma.message.createMany({
    data: [
      // Minecraft hub
      { threadId: 'minecraft', senderId: 'u1', senderName: 'BlockMaster', senderAvatar: 'https://picsum.photos/seed/101/150/150', text: 'Anyone hosting a survival server?' },
      { threadId: 'minecraft', senderId: 'u2', senderName: 'CraftyDev', senderAvatar: 'https://picsum.photos/seed/102/150/150', text: 'Just finished my redstone calculator!' },
      
      // Valorant hub
      { threadId: 'valorant', senderId: 'u3', senderName: 'JettMain99', senderAvatar: 'https://picsum.photos/seed/103/150/150', text: 'Need a Sage for ranked. Gold 2 lobby.' },
      { threadId: 'valorant', senderId: 'u4', senderName: 'VandalWhiz', senderAvatar: 'https://picsum.photos/seed/104/150/150', text: 'That last update to Phoenix is insane.' },
      
      // Elden Ring hub
      { threadId: 'elden-ring', senderId: 'u5', senderName: 'TarnishedOne', senderAvatar: 'https://picsum.photos/seed/105/150/150', text: 'Malenia is actually impossible. Help?' },
      { threadId: 'elden-ring', senderId: 'u6', senderName: 'GraceSeeker', senderAvatar: 'https://picsum.photos/seed/106/150/150', text: 'Try using bleed build, it melts her.' },

      // DM thread: CyberCat (t1)
      { threadId: 't1', senderId: 'them', senderName: 'CyberCat', senderAvatar: 'https://picsum.photos/seed/cat/150/150', text: 'Hey, are you joining the server?' },
      { threadId: 't1', senderId: 'me', senderName: 'Pilot_Alex', senderAvatar: 'https://picsum.photos/seed/pilot/40/40', text: 'Yeah, just finishing up dinner.' },
      { threadId: 't1', senderId: 'them', senderName: 'CyberCat', senderAvatar: 'https://picsum.photos/seed/cat/150/150', text: 'Yo! Ready for that Minecraft session?' },

      // DM thread: ShadowBlade (t2)
      { threadId: 't2', senderId: 'me', senderName: 'Pilot_Alex', senderAvatar: 'https://picsum.photos/seed/pilot/40/40', text: 'That clutch on Haven was insane.' },
      { threadId: 't2', senderId: 'them', senderName: 'ShadowBlade', senderAvatar: 'https://picsum.photos/seed/shadow/150/150', text: 'Total luck honestly haha.' },
      { threadId: 't2', senderId: 'them', senderName: 'ShadowBlade', senderAvatar: 'https://picsum.photos/seed/shadow/150/150', text: 'Good games today, GG.' },

      // DM thread: Starlight_99 (t3)
      { threadId: 't3', senderId: 'them', senderName: 'Starlight_99', senderAvatar: 'https://picsum.photos/seed/star/150/150', text: 'Did you see the Elden Ring DLC trailer?' },
    ],
  });

  console.log('Seeded messaging threads and game hubs.');
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
