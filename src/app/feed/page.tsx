"use client"

import { useState, useEffect } from 'react';
import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Review } from '@/lib/mock-data';
import { getReviews, createReview, likeReview } from '@/lib/actions';

export default function ActivityFeedPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data.map(r => ({
          id: r.id,
          user: r.user,
          avatar: r.avatar,
          game: r.game,
          rating: r.rating,
          content: r.content,
          likes: r.likes,
          comments: r.comments,
          time: new Date(r.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        })));
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    loadReviews();
  }, []);

  const [gameName, setGameName] = useState('Minecraft');
  const [rating, setRating] = useState(5);
  const [opinionText, setOpinionText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleShareOpinion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!opinionText.trim()) {
      toast({
        title: 'Error',
        description: 'Please write your review details.',
        variant: 'destructive',
      });
      return;
    }

    const newReview: Review = {
      id: `opt-${Date.now()}`,
      user: 'Pilot_Alex',
      avatar: 'https://picsum.photos/seed/pilot/40/40',
      game: gameName,
      rating: rating,
      content: opinionText.trim(),
      likes: 0,
      comments: 0,
      time: 'Just now',
    };

    setReviews([newReview, ...reviews]);
    setOpinionText('');
    setGameName('Minecraft');
    setRating(5);
    setIsOpen(false);

    try {
      await createReview(newReview.game, newReview.rating, newReview.content);
      toast({
        title: 'Success',
        description: 'Your opinion has been shared to the feed!',
      });
      
      const data = await getReviews();
      setReviews(data.map(r => ({
        id: r.id,
        user: r.user,
        avatar: r.avatar,
        game: r.game,
        rating: r.rating,
        content: r.content,
        likes: r.likes,
        comments: r.comments,
        time: new Date(r.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      })));
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  const handleLike = async (id: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
    toast({
      title: 'Liked',
      description: 'You liked this opinion.',
    });
    try {
      await likeReview(id);
    } catch (err) {
      console.error('Failed to like review:', err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 bg-background p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-bold mb-2">Activity <span className="text-primary neon-text">Feed</span></h2>
            <p className="text-muted-foreground">What the OMNIX community is playing and saying.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" /> Share Opinion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleShareOpinion}>
                <DialogHeader>
                  <DialogTitle>Share Your Opinion</DialogTitle>
                  <DialogDescription>
                    Post a mini-review or thoughts on a game you've been playing recently.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="game" className="text-right">
                      Game
                    </Label>
                    <select
                      id="game"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Minecraft">Minecraft</option>
                      <option value="Valorant">Valorant</option>
                      <option value="Elden Ring">Elden Ring</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rating" className="text-right">
                      Rating
                    </Label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="content" className="text-right pt-2">
                      Review
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts on gameplay, performance, map changes, or coordinates..."
                      value={opinionText}
                      onChange={(e) => setOpinionText(e.target.value)}
                      className="col-span-3 min-h-[100px]"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Post Review</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">
          {reviews.map((post) => (
            <Card key={post.id} className="bg-card border-border/50 overflow-hidden hover:border-primary/20 transition-all animate-slide-up">
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
                <p className="text-foreground leading-relaxed mb-6 whitespace-pre-line">
                  {post.content}
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                  >
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

          {reviews.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No activity opinions shared yet. Be the first to share one!
            </div>
          )}
          
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
