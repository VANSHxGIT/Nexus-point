
'use client';

import { useState, useEffect } from 'react';
import { NexusSidebar } from '@/components/layout/sidebar';
import { MessageThread } from '@/lib/mock-data';
import { getThreads, createMessage, getUserProfile } from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MoreVertical, Pin, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('t1');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedThreadIds, setPinnedThreadIds] = useState<string[]>([]);
  const [deletedThreadIds, setDeletedThreadIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; threadId: string } | null>(null);

  useEffect(() => {
    try {
      const pinned = localStorage.getItem('omnix_pinned_threads');
      const deleted = localStorage.getItem('omnix_deleted_threads');
      if (pinned) setPinnedThreadIds(JSON.parse(pinned));
      if (deleted) setDeletedThreadIds(JSON.parse(deleted));
    } catch (e) {
      console.error('Failed to load chat preferences from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    window.addEventListener('contextmenu', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('contextmenu', handleClose);
    };
  }, []);

  const pinThread = (threadId: string) => {
    const nextPinned = [...pinnedThreadIds, threadId];
    setPinnedThreadIds(nextPinned);
    localStorage.setItem('omnix_pinned_threads', JSON.stringify(nextPinned));
  };

  const unpinThread = (threadId: string) => {
    const nextPinned = pinnedThreadIds.filter(id => id !== threadId);
    setPinnedThreadIds(nextPinned);
    localStorage.setItem('omnix_pinned_threads', JSON.stringify(nextPinned));
  };

  const deleteThread = (threadId: string) => {
    const nextDeleted = [...deletedThreadIds, threadId];
    setDeletedThreadIds(nextDeleted);
    localStorage.setItem('omnix_deleted_threads', JSON.stringify(nextDeleted));
    
    // Switch to next available non-deleted thread if the deleted one was active
    if (activeThreadId === threadId) {
      const remaining = threads.filter(t => t.id !== threadId && !nextDeleted.includes(t.id));
      if (remaining.length > 0) {
        const sortedRemaining = [...remaining].sort((a, b) => {
          const aPinned = pinnedThreadIds.includes(a.id);
          const bPinned = pinnedThreadIds.includes(b.id);
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;
          return 0;
        });
        setActiveThreadId(sortedRemaining[0].id);
      } else {
        setActiveThreadId('');
      }
    }
  };

  useEffect(() => {
    let active = true;
    const fetchThreads = async () => {
      try {
        const data = await getThreads();
        if (!active) return;

        // Check if there is a query param for a user to start chat with
        const searchParams = new URLSearchParams(window.location.search);
        const startUser = searchParams.get('user');
        const isInvite = searchParams.get('invite') === 'true';

        let localDeleted: string[] = [];
        try {
          const deleted = localStorage.getItem('omnix_deleted_threads');
          if (deleted) localDeleted = JSON.parse(deleted);
        } catch (e) {}

        if (startUser) {
          const existingThread = data.find(t => t.user.name.toLowerCase() === startUser.toLowerCase());
          if (existingThread) {
            setThreads(data);
            setActiveThreadId(existingThread.id);
            // Clear deleted state for this thread if it was previously deleted
            setDeletedThreadIds(prev => {
              const updated = prev.filter(id => id !== existingThread.id);
              localStorage.setItem('omnix_deleted_threads', JSON.stringify(updated));
              return updated;
            });
            if (isInvite) {
              setInputValue("Hey! I'd like to invite you to my squad. Let's team up!");
            }
          } else {
            // Retrieve teammate details dynamically
            try {
              const profileData = await getUserProfile(startUser);
              const newThreadId = `t-${profileData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
              
              const newThread = {
                id: newThreadId,
                user: {
                  name: profileData.name,
                  avatar: profileData.avatar,
                  status: 'online' as const
                },
                lastMessage: 'No messages yet.',
                time: 'Recently',
                unread: false,
                messages: []
              };
              
              setThreads([newThread, ...data]);
              setActiveThreadId(newThreadId);
              setDeletedThreadIds(prev => {
                const updated = prev.filter(id => id !== newThreadId);
                localStorage.setItem('omnix_deleted_threads', JSON.stringify(updated));
                return updated;
              });
              if (isInvite) {
                setInputValue("Hey! I'd like to invite you to my squad. Let's team up!");
              }
            } catch (err) {
              console.error('Failed to fetch user profile for message routing:', err);
              setThreads(data);
              const activeList = data.filter(t => !localDeleted.includes(t.id));
              if (activeList.length > 0) {
                setActiveThreadId(activeList[0].id);
              }
            }
          }
        } else {
          setThreads(data);
          const activeList = data.filter(t => !localDeleted.includes(t.id));
          if (activeList.length > 0) {
            setActiveThreadId(activeList[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch threads:', err);
      }
    };
    fetchThreads();
    return () => {
      active = false;
    };
  }, []);

  const filteredAndSortedThreads = threads
    .filter(thread => !deletedThreadIds.includes(thread.id))
    .filter(thread => thread.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aPinned = pinnedThreadIds.includes(a.id);
      const bPinned = pinnedThreadIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  const activeThread = filteredAndSortedThreads.find(t => t.id === activeThreadId) || filteredAndSortedThreads[0] || {
    id: '',
    user: { name: 'Chat', avatar: '', status: 'offline' as const },
    lastMessage: '',
    time: '',
    unread: false,
    messages: []
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const text = inputValue.trim();
    setInputValue('');

    const newMessage = {
      id: `opt-${Date.now()}`,
      sender: 'me' as const,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThreads = threads.map(thread => {
      if (thread.id === activeThreadId) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastMessage: text,
          time: 'Just now',
          unread: false
        };
      }
      return thread;
    });

    setThreads(updatedThreads);

    try {
      await createMessage(activeThreadId, text, 'me');
      const data = await getThreads();
      setThreads(data);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <NexusSidebar />
      <main className="flex-1 flex flex-col bg-background">
        <div className="flex h-full">
          {/* Threads Sidebar */}
          <aside className="w-80 border-r border-border flex flex-col bg-card/10">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-headline font-bold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search chats..." 
                  className="pl-10 bg-muted/30" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredAndSortedThreads.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground/60 text-sm">
                  No chats found
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredAndSortedThreads.map((thread) => (
                    <div 
                      key={thread.id} 
                      onClick={() => setActiveThreadId(thread.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const menuWidth = 160;
                        const menuHeight = 90;
                        const posX = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX;
                        const posY = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY;
                        setContextMenu({ x: posX, y: posY, threadId: thread.id });
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-all relative group",
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
                          <h4 className="font-bold text-sm truncate flex items-center gap-1.5">
                            {thread.user.name}
                            {pinnedThreadIds.includes(thread.id) && (
                              <Pin className="w-3 h-3 text-primary fill-primary/30 rotate-45 shrink-0" />
                            )}
                          </h4>
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
              )}
            </ScrollArea>
          </aside>

          {/* Chat Window */}
          <section className="flex-1 flex flex-col bg-card/5">
            {!activeThread.id ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card/5">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-muted-foreground">No Chat Selected</h3>
                <p className="text-sm text-muted-foreground/60 max-w-sm mt-1">
                  Choose a chat from the sidebar or find new teammates to start messaging.
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </section>
        </div>
      </main>

      {/* Custom Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-50 min-w-[160px] bg-card/95 backdrop-blur-md border border-border/80 shadow-2xl rounded-xl p-1.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            top: contextMenu.y,
            left: contextMenu.x 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (pinnedThreadIds.includes(contextMenu.threadId)) {
                unpinThread(contextMenu.threadId);
              } else {
                pinThread(contextMenu.threadId);
              }
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all cursor-pointer text-left group/btn"
          >
            <Pin className="w-3.5 h-3.5 group-hover/btn:text-primary transition-colors rotate-45" />
            {pinnedThreadIds.includes(contextMenu.threadId) ? 'Unpin Chat' : 'Pin Chat'}
          </button>
          <button
            onClick={() => {
              deleteThread(contextMenu.threadId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-200 hover:bg-destructive/20 transition-all cursor-pointer text-left mt-0.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
}
