import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Share2, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REVIEWS = [
  {
    id: 'r1',
    user: 'CyberCat',
    avatar: 'https://picsum.photos/seed/cat/40/40',
    game: 'Minecraft',
    rating: 5,
    content: 'Just discovered an amazing seed for survival! The cave systems are incredible and the resource generation is top notch. Anyone want the coords?',
    likes: 24,
    comments: 12,
    time: '45m ago'
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
    time: '2h ago'
  }
];

export default function ActivityFeedPage() {
  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 bg-background p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-bold mb-2">Activity <span className="text-primary neon-text">Feed</span></h2>
            <p className="text-muted-foreground">What the Nexus community is playing and saying.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="w-4 h-4 mr-2" /> Share Opinion
          </Button>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">
          {REVIEWS.map((post) => (
            <Card key={post.id} className="bg-card border-border/50 overflow-hidden hover:border-primary/20 transition-all">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold">{post.user}</h4>
                      <p className="text-xs text-muted-foreground">{post.time} • Posted in <span className="text-secondary font-medium">{post.game}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < post.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <p className="text-foreground leading-relaxed mb-6">
                  {post.content}
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center py-10">
            <Badge variant="outline" className="border-border text-muted-foreground cursor-pointer hover:bg-muted/50 transition-all px-4 py-2">
               Load More Activity
            </Badge>
          </div>
        </div>
      </main>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );
}
