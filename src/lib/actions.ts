'use server';

import { prisma } from './db';
import { revalidatePath } from 'next/cache';
import { MOCK_GAMES } from './mock-data';

// 1. Dashboard Stats
export async function getDashboardStats() {
  const totalPlayersOnline = MOCK_GAMES.reduce((acc, game) => acc + game.playersOnline, 0).toLocaleString();
  const totalReviews = await prisma.review.count();
  const compatibleMatches = await prisma.user.count({
    where: { NOT: { id: 'u1' } },
  });
  const totalHubs = MOCK_GAMES.length;

  return {
    totalPlayersOnline,
    totalReviews,
    compatibleMatches,
    totalHubs,
  };
}

// 2. Identity Vault Credentials
export async function getCredentials() {
  return prisma.credential.findMany({
    where: { userId: 'u1' },
  });
}

export async function createCredential(platform: string, handle: string, status: string) {
  const cred = await prisma.credential.create({
    data: {
      userId: 'u1',
      platform,
      handle,
      status,
    },
  });
  revalidatePath('/vault');
  return cred;
}

// 3. Activity Feed Reviews
export async function getReviews() {
  return prisma.review.findMany({
    orderBy: { time: 'desc' },
  });
}

export async function createReview(game: string, rating: number, content: string) {
  const review = await prisma.review.create({
    data: {
      user: 'Pilot_Alex',
      avatar: 'https://picsum.photos/seed/pilot/40/40',
      game,
      rating,
      content,
      likes: 0,
      comments: 0,
    },
  });
  revalidatePath('/feed');
  revalidatePath('/');
  return review;
}

export async function likeReview(id: string) {
  const review = await prisma.review.update({
    where: { id },
    data: {
      likes: { increment: 1 },
    },
  });
  revalidatePath('/feed');
  return review;
}

// 4. Messaging & Hubs
export async function getMessages(threadId: string) {
  const msgs = await prisma.message.findMany({
    where: { threadId },
    orderBy: { time: 'asc' },
  });
  return msgs.map(m => ({
    id: m.id,
    userId: m.senderId,
    userName: m.senderName,
    userAvatar: m.senderAvatar,
    content: m.text,
    timestamp: new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

export async function createMessage(threadId: string, text: string, senderId: string = 'me') {
  let senderName = 'Pilot_Alex';
  let senderAvatar = 'https://picsum.photos/seed/pilot/40/40';

  if (senderId !== 'me' && senderId !== 'u1') {
    const user = await prisma.user.findUnique({ where: { id: senderId } });
    if (user) {
      senderName = user.name;
      senderAvatar = user.avatar;
    }
  }

  const msg = await prisma.message.create({
    data: {
      threadId,
      senderId,
      senderName,
      senderAvatar,
      text,
    },
  });

  revalidatePath('/messages');
  revalidatePath(`/hubs/${threadId}`);
  return msg;
}

export async function getThreads() {
  const threadDefinitions = [
    { id: 't1', user: { name: 'CyberCat', avatar: 'https://picsum.photos/seed/cat/150/150', status: 'online' as const } },
    { id: 't2', user: { name: 'ShadowBlade', avatar: 'https://picsum.photos/seed/shadow/150/150', status: 'offline' as const } },
    { id: 't3', user: { name: 'Starlight_99', avatar: 'https://picsum.photos/seed/star/150/150', status: 'online' as const } },
  ];

  return Promise.all(
    threadDefinitions.map(async (t) => {
      const msgs = await prisma.message.findMany({
        where: { threadId: t.id },
        orderBy: { time: 'asc' },
      });

      const lastMsg = msgs[msgs.length - 1];

      return {
        ...t,
        lastMessage: lastMsg ? lastMsg.text : 'No messages yet.',
        time: lastMsg
          ? new Date(lastMsg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Recently',
        unread: false,
        messages: msgs.map((m) => ({
          id: m.id,
          sender: m.senderId === 'me' ? ('me' as const) : ('them' as const),
          text: m.text,
          time: new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
      };
    })
  );
}

// 5. AI Teammate Compatibility
import { getPlayerCompatibilityRecommendations } from '@/ai/flows/player-compatibility-recommendations';

export async function getTeammatesCompatibility(profile: string) {
  const users = await prisma.user.findMany({
    where: { NOT: { id: 'u1' } },
  });

  const potentialTeammates = users.map((u) => ({
    id: u.id,
    profile: u.preferences,
  }));

  return getPlayerCompatibilityRecommendations({
    currentPlayerProfile: profile,
    potentialTeammates,
  });
}
