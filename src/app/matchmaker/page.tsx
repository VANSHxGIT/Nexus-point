import { NexusSidebar } from '@/components/layout/sidebar';
import { CompatibilityChecker } from '@/components/ai/compatibility-checker';

export default function MatchmakerPage() {
  return (
    <div className="flex min-h-screen">
      <NexusSidebar />
      <main className="flex-1 bg-background p-8">
        <header className="mb-10 max-w-4xl mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-2">Teammate <span className="text-secondary">Matchmaker</span></h2>
          <p className="text-muted-foreground">Using Nexus GenAI to find your perfect gaming partners based on philosophy, playstyle, and personality.</p>
        </header>

        <CompatibilityChecker />
      </main>
    </div>
  );
}
