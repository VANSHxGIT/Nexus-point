# 🎮 Nexus Point

**Nexus Point** is a premium, real-time chatting and experience-sharing platform designed specifically for gamers across the globe. Built on Next.js 15, React 19, and Google Genkit AI, it provides a centralized dashboard—a "Gaming Nexus"—where players can share thoughts, coordinate gameplay in game-specific hubs, match with highly compatible squad mates using Generative AI, and securely manage their gaming handles.

---

## 🚀 Key Features & Use Cases

### 💬 1. Dynamic Game Hubs
* **World Chats**: Enter game-specific channels (e.g., *Minecraft*, *Valorant*, *Elden Ring*) to join live global conversations.
* **Coordination**: Ideal for coordinate-sharing, LFG (Looking for Group) requests, and live feedback on game updates.
* **Teammate Panels**: Hub sidebars list active players currently inside the hub for instant interaction.

### 🧠 2. AI Teammate Matchmaker
* **GenAI Analysis**: Powered by Google Genkit & Gemini 2.5 Flash.
* **Custom Persona Profiles**: Players describe their gaming philosophy, style, and attitude (e.g., "chill play, team-oriented, low toxicity, entry fragger").
* **Smart Matching**: The AI analyzes preferences against other potential teammates and gives a compatibility rating along with a structured explanation of *why* they fit.

### 🔒 3. Identity Vault
* **Access Control**: Store and manage handles/IDs across multiple services (Steam, Discord, Minecraft, Valorant, etc.).
* **Granular Privacy Settings**: Configure access on a per-handle basis:
  * **Public**: Visible to all Nexus Point users.
  * **Mutuals Only**: Visible only to accepted teammates.
  * **Private**: Hidden from the public directory.
* **Security Logs**: Monitor who has viewed or requested access to your credentials.

### 📰 4. Activity Feed (Experience Sharing)
* **Mini-Reviews**: Post updates, opinions, and star-rated reviews on recent play sessions.
* **Community Engagement**: Engage with other players' reviews via liking, commenting, and sharing.

### ✉️ 5. Direct Messaging
* **Seamless Chatting**: Instant one-on-one private messaging threads to coordinate game details and build gaming rapport.

---

## 🎨 Design Language & Aesthetics

Nexus Point is designed to feel immersive, modern, and high-performance, mirroring the interface aesthetics of contemporary gaming hardware and client interfaces.
* **Primary Color**: Vibrant Amethyst (`#9554E8`) - represents energetic digital connection.
* **Background Color**: Deep Obsidian (`#15111B`) - creates a premium high-contrast, focused dark-mode theme.
* **Accent Color**: Neon Cobalt (`#5471E8`) - provides visual hierarchy and highlights call-to-action details.
* **Typography**:
  * **Headings**: `Space Grotesk` - tech-centric, geometric, and modern.
  * **Body**: `Inter` - ultra-readable for dense chat threads and logs.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **AI Engine**: [Google Genkit AI SDK](https://firebase.google.com/docs/genkit) (utilizing the Gemini 2.5 Flash model)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Components**: Headless primitives powered by [Radix UI](https://www.radix-ui.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Backend Integration**: Prepared for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) & Firebase DB integrations.

---

## 🚀 Getting Started

### 📋 Prerequisites
* Node.js v18+ or v20+ installed.
* A Gemini API key.

### 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Nexus-point-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser to view the application.

5. **Start Genkit Developer UI (Optional):**
   To inspect flows, prompts, and run trace evaluations:
   ```bash
   npm run genkit:dev
   ```

---

## 📂 Project Structure

```text
nexus-point/
├── docs/                        # Project blueprint & design docs
│   └── blueprint.md             # Visual identity and architecture blueprint
├── src/
│   ├── ai/                      # Genkit flows, prompts, and config
│   │   ├── flows/               # AI compatibility matchmaking logic
│   │   └── genkit.ts            # Genkit instance initialization
│   ├── app/                     # Next.js App Router (Pages, layout, global styles)
│   │   ├── feed/                # Social feed / experience sharing
│   │   ├── hubs/                # Game-specific world chatrooms
│   │   ├── matchmaker/          # AI Teammate Matchmaker
│   │   ├── messages/            # Private messaging threads
│   │   ├── settings/            # User account settings
│   │   ├── vault/               # Identity Vault (credentials manager)
│   │   └── layout.tsx           # Global page framework
│   ├── components/              # Shared components (layouts, UI, AI features)
│   │   ├── ai/                  # AI UI components (Compatibility checker)
│   │   ├── layout/              # Sidebar & navigation
│   │   └── ui/                  # Reusable UI primitives (Radix wrappers)
│   └── lib/                     # Mock data, helper functions, and utility files
```
