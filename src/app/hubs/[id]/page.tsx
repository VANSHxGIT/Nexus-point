
'use client';

import { useState, use } from 'react';
import { NexusSidebar } from '@/components/layout/sidebar';
import { MOCK_GAMES, MOCK_CHATS, ChatMessage } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Users, Info, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const game = MOCK_GAMES.find((g) => g.id === id);
  const initialChats = MOCK_CHATS[id] || [];
  
  const [messages, setMessages] = useState<ChatMessage[]>(initialChats);
  const [inputValue, setInputValue] = useState('');

  if (!game) notFound();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'me',
      userName: 'Pilot_Alex',
      userAvatar: 'https://picsum.photos/seed/pilot/40/40',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <NexusSidebar />
      <main className="flex-1 flex flex-col bg-background">
        <header className="relative h-48 w-full border-b border-border">
          <Image
            src={game.hero}
            alt={game.name}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="relative w-24 h-36 rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg">
                <Image src={game.poster} alt={game.name} fill className="object-cover" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 border-primary text-primary">{game.category}</Badge>
                <h2 className="text-4xl font-headline font-bold text-white neon-text">{game.name} World Chat</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4" /> {game.playersOnline} gamers currently active
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-4 group animate-slide-up">
                    <Avatar className="w-10 h-10 border border-primary/20">
                      <AvatarImage src={msg.userAvatar} />
                      <AvatarFallback>{msg.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm hover:text-primary cursor-pointer transition-colors">
                          {msg.userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <div className={`rounded-2xl rounded-tl-none px-4 py-2 text-sm border max-w-[80%] ${
                        msg.userId === 'me' ? 'bg-primary/20 border-primary/30' : 'bg-muted/40 border-border/50'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="relative mt-auto">
              <Input
                placeholder={`Send a message to ${game.name} hub...`}
                className="pr-12 py-6 bg-card border-border/50 focus:border-primary/50 rounded-xl"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <aside className="hidden lg:block w-72 border-l border-border bg-card/20 p-6">
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" /> Active Teammates
            </h3>
            <div className="space-y-4">
              {['Starlight_99', 'GamerPro_X', 'CyberCat', 'ShadowBlade'].map((user) => (
                <div key={user} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-all">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://picsum.photos/seed/${user}/32/32`} />
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <span className="text-sm font-medium">{user}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
