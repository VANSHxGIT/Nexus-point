"use client"

import { useState, useEffect } from 'react';
import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Key, Eye, EyeOff, Plus, Gamepad, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getCredentials, createCredential } from '@/lib/actions';

export default function VaultPage() {
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState<{ platform: string; id: string; status: string }[]>([]);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const data = await getCredentials();
        setCredentials(data.map(c => ({ platform: c.platform, id: c.handle, status: c.status })));
      } catch (err) {
        console.error('Failed to load credentials:', err);
      }
    };
    loadCredentials();
  }, []);

  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState('Public');
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !handle.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if platform already exists
    if (credentials.some(c => c.platform.toLowerCase() === platform.trim().toLowerCase())) {
      toast({
        title: 'Error',
        description: 'A credential for this platform already exists.',
        variant: 'destructive',
      });
      return;
    }

    const newCred = {
      platform: platform.trim(),
      id: handle.trim(),
      status: status
    };

    setCredentials([...credentials, newCred]);
    setPlatform('');
    setHandle('');
    setStatus('Public');
    setIsOpen(false);

    try {
      await createCredential(newCred.platform, newCred.id, newCred.status);
      toast({
        title: 'Success',
        description: `Added credential for ${newCred.platform}.`,
      });
    } catch (err) {
      console.error('Failed to save credential:', err);
    }
  };

  const handleCopy = (text: string, platformName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast({
      title: 'Copied!',
      description: `${platformName} ID has been copied to your clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 bg-background p-8">
        <header className="mb-10">
          <h2 className="text-4xl font-headline font-bold mb-2">Identity <span className="text-primary neon-text">Vault</span></h2>
          <p className="text-muted-foreground">Securely store and manage who sees your gaming handles across platforms.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((cred) => (
                <Card key={cred.platform} className="bg-card border-border/50 group hover:border-primary/30 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Gamepad className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-headline">{cred.platform}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      {cred.status === 'Public' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {cred.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/50">
                      <code className="text-sm font-mono truncate mr-2">{cred.id}</code>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(cred.id, cred.platform)}
                        >
                          {copiedId === cred.id ? (
                            <Check className="w-4 h-4 text-green-500 animate-pulse" />
                          ) : (
                            <Copy className="w-4 h-4 opacity-50 hover:opacity-100" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Key className="w-4 h-4 opacity-50" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-muted/20 border-dashed border-border flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-all min-h-[170px]">
                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">Add New Credential</span>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddCredential}>
                    <DialogHeader>
                      <DialogTitle>Add New Credential</DialogTitle>
                      <DialogDescription>
                        Store a new gaming handle and configure its privacy.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="platform" className="text-right">
                          Platform
                        </Label>
                        <Input
                          id="platform"
                          placeholder="e.g. Steam, Discord"
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="handle" className="text-right">
                          Handle / ID
                        </Label>
                        <Input
                          id="handle"
                          placeholder="e.g. Gamer#1234"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Visibility
                        </Label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Public">Public</option>
                          <option value="Mutuals Only">Mutuals Only</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Credential</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Security Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Set sensitive IDs to "Mutuals Only" to ensure only accepted teammates can view your full profile credentials.
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { user: 'CyberCat', time: '2h ago', action: 'Viewed Valorant ID' },
                  { user: 'ShadowBlade', time: '5h ago', action: 'Requested Discord' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-xs pb-3 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <span className="font-bold text-foreground">{item.user}</span> {item.action}
                    </div>
                    <span className="text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
