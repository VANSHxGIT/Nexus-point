
import type { Metadata } from 'next';
import { NexusSidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, User, Lock, Monitor, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings | OMNIX.GG',
  description: 'Manage your OMNIX account settings, notifications, and privacy.',
  icons: {
    icon: '/images/gear-icon.png',
  },
};

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 bg-background p-8">
        <header className="mb-10">
          <h2 className="text-4xl font-headline font-bold mb-2">OMNIX <span className="text-primary">Settings</span></h2>
          <p className="text-muted-foreground">Manage your account, privacy, and notifications.</p>
        </header>

        <div className="max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Settings
              </CardTitle>
              <CardDescription>Update your public information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <p className="text-sm font-medium">Pilot_Alex_42</p>
                </div>
                <div className="space-y-2">
                   <Button variant="outline" size="sm">Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-secondary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Requests</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts when someone wants to join your squad.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Direct Messages</Label>
                  <p className="text-xs text-muted-foreground">Alerts for private conversation updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
             <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="w-5 h-5" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Deactivate OMNIX Account</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
