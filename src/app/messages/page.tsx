
'use client';

import { useState } from 'react';
import { NexusSidebar } from '@/components/layout/sidebar';
import { MOCK_THREADS, MessageThread } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(threads[0].id);
  const [inputValue, setInputValue] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'me' as const,
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThreads = threads.map(thread => {
      if (thread.id === activeThreadId) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastMessage: inputValue,
          time: 'Just now',
          unread: false
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    setInputValue('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <NexusSidebar />
      <main className="flex-1 flex flex-col bg-background">
        <div className="flex h-full">
          {/* Threads Sidebar */}
          <aside className="w-80 border-r border-border flex flex-col bg-card/10">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-headline font-bold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-10 bg-muted/30" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border/50">
                {threads.map((thread) => (
                  <div 
                    key={thread.id} 
                    onClick={() => setActiveThreadId(thread.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-all",
                      activeThreadId === thread.id ? "bg-primary/10 border-r-2 border-primary" : "",
                      thread.unread && activeThreadId !== thread.id ? 'bg-primary/5' : ''
                    )}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={thread.user.avatar} />
                        <AvatarFallback>{thread.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {thread.user.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm truncate">{thread.user.name}</h4>
                        <span className="text-[10px] text-muted-foreground">{thread.time}</span>
                      </div>
                      <p className={cn(
                        "text-xs truncate",
                        thread.unread && activeThreadId !== thread.id ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}>
                        {thread.lastMessage}
                      </p>
                    </div>
                    {thread.unread && activeThreadId !== thread.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>

          {/* Chat Window */}
          <section className="flex-1 flex flex-col bg-card/5">
            <header className="p-4 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-primary/20">
                  <AvatarImage src={activeThread.user.avatar} />
                  <AvatarFallback>{activeThread.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">{activeThread.user.name}</h4>
                  <span className={cn(
                    "text-[10px] font-medium",
                    activeThread.user.status === 'online' ? "text-green-500" : "text-muted-foreground"
                  )}>
                    {activeThread.user.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {activeThread.messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-2 rounded-2xl text-sm mb-1 shadow-sm border",
                      msg.sender === 'me' 
                        ? "bg-primary text-primary-foreground border-primary rounded-tr-none" 
                        : "bg-muted/50 text-foreground border-border/50 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-background border-t border-border">
              <div className="relative max-w-4xl mx-auto flex gap-2">
                <Input 
                  placeholder={`Write a message to ${activeThread.user.name}...`} 
                  className="bg-muted/20 border-border/50 focus:border-primary/50" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  size="icon" 
                  className="shrink-0 shadow-lg shadow-primary/20"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
