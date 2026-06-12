import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Key, Eye, EyeOff, Plus, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function VaultPage() {
  const credentials = [
    { platform: 'Valorant', id: 'Ghost#4432', status: 'Public' },
    { platform: 'Minecraft', id: 'TheBuilder_X', status: 'Private' },
    { platform: 'Discord', id: 'NexusAdmin#0001', status: 'Mutuals Only' },
    { platform: 'Steam', id: 'Sarahrider', status: 'Public' },
  ];

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
                    <Badge variant="outline" className="text-[10px]">
                      {cred.status === 'Public' ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {cred.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/50">
                      <code className="text-sm font-mono">{cred.id}</code>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Key className="w-4 h-4 opacity-50" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-muted/20 border-dashed border-border flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/30 transition-all">
                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Add New Credential</span>
              </Card>
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
