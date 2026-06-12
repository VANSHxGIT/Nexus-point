import Link from 'next/link';
import { Home, MessageSquare, Shield, Users, Gamepad2, TrendingUp, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Gamepad2, label: 'Game Hubs', href: '/hubs' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Shield, label: 'Identity Vault', href: '/vault' },
  { icon: Users, label: 'Find Teammates', href: '/matchmaker' },
  { icon: TrendingUp, label: 'Activity Feed', href: '/feed' },
];

export function NexusSidebar() {
  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 bg-card/50 backdrop-blur-md flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">N</div>
          Nexus Point
        </h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.label === 'Dashboard' ? '/' : item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
