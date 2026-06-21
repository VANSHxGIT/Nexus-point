"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, BrainCircuit, UserCheck, Shield } from 'lucide-react';
import { getTeammatesCompatibility } from '@/lib/actions';
import type { PlayerCompatibilityRecommendationsOutput } from '@/ai/flows/player-compatibility-recommendations';
import { MOCK_USERS } from '@/lib/mock-data';

export function CompatibilityChecker() {
  const [profile, setProfile] = useState('');
  const [results, setResults] = useState<PlayerCompatibilityRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (!profile.trim()) return;
    setLoading(true);
    try {
      const res = await getTeammatesCompatibility(profile);
      setResults(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="bg-card border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-24 h-24 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            AI Compatibility Matcher
          </CardTitle>
          <CardDescription>
            Tell OMNIX AI about your gaming style, preferences, and what you look for in a teammate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: I enjoy competitive tactical shooters like Valorant. I prefer playing entry frag and value clear communication. Looking for chill people who can keep cool during clutch moments..."
            className="min-h-[120px] bg-background border-border/50 focus:border-primary/50 rounded-xl"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />
          <Button
            onClick={handleAnalysis}
            disabled={loading || !profile.trim()}
            className="w-full bg-primary hover:bg-primary/80 h-12 text-lg font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Compatibility...
              </span>
            ) : (
              'Find Compatible Teammates'
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {results.recommendations.map((rec) => {
            const user = MOCK_USERS.find(u => u.id === rec.playerId);
            if (!user) return null;
            return (
              <Card key={rec.playerId} className="bg-muted/20 border-secondary/20 hover:border-secondary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12 border border-secondary/50">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg">{user.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-secondary font-medium">
                        <UserCheck className="w-3 h-3" /> Compatible Match
                      </div>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-sm italic text-muted-foreground border-l-2 border-secondary">
                    "{rec.compatibilityReason}"
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Shield className="w-4 h-4" /> Identity Vault
                    </Button>
                    <Button size="sm" className="bg-secondary">Message</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
