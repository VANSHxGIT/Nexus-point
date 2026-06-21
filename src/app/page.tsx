import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_GAMES } from '@/lib/mock-data';
import { getDashboardStats } from '@/lib/actions';
import { Gamepad2, Users, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const { totalPlayersOnline, totalReviews, compatibleMatches, totalHubs } = await getDashboardStats();

  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <header className="mb-10">
          <h2 className="text-4xl font-headline font-bold mb-2">Welcome Back, <span className="text-primary neon-text">Pilot</span></h2>
          <p className="text-muted-foreground">Your gaming cockpit is ready. {totalPlayersOnline} players online now.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Global Activity</CardTitle>
              <Flame className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalReviews}</div>
              <p className="text-xs text-muted-foreground">reviews shared today</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Compatible Matches</CardTitle>
              <Users className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{compatibleMatches}</div>
              <p className="text-xs text-muted-foreground">new recommendations for you</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Hubs</CardTitle>
              <Gamepad2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHubs}</div>
              <p className="text-xs text-muted-foreground">available game chatrooms</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-headline font-bold">Trending Game Hubs</h3>
            <Link href="/hubs" className="text-primary hover:underline text-sm font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_GAMES.map((game) => (
              <Link href={`/hubs/${game.id}`} key={game.id} className="group">
                <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:translate-y-[-4px]">
                  <div className="relative aspect-video">
                    <Image
                      src={game.hero}
                      alt={game.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="mb-2 bg-secondary/80 backdrop-blur-sm">{game.category}</Badge>
                      <h4 className="text-xl font-headline font-bold">{game.name}</h4>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {game.playersOnline} players
                      </span>
                      <span className="text-primary font-bold group-hover:neon-text">Join Hub →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
