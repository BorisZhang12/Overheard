# Overheard 🗣️

**Play the game live:** [overheardgame.com](https://overheardgame.com)

Overheard is a daily, Wordle-style deduction game where players try to guess the exact relationship between two people based on snippets of overheard dialogue. Read the room, piece together the context clues, and solve the puzzle in three guesses or less!

---

## 🎮 How to Play
- **Read the Room:** You start with a single line of overheard dialogue between Speaker A and Speaker B.
- **Make a Guess:** Select the relationship between the two speakers from a grid of options.
- **Reveal Clues:** If you guess incorrectly (or choose to reveal a hint), the next line of the conversation is revealed, giving you more context.
- **Win:** Guess the correct relationship before running out of your 3 guesses!
- **Share:** Your stats are tracked daily. Win or lose, share your puzzle grid results with your friends.

---

## 🏗️ Tech Stack
This project was built with a modern, serverless architecture focusing on speed, security, and a minimalist design.

### Frontend
- **Framework:** React.js via Vite
- **Styling:** Vanilla CSS3 (Custom properties, Flexbox/Grid) for an ultra-lightweight, zero-dependency bundle.
- **State Management:** Custom React hooks (`useGameState`) deeply integrated with the `localStorage` API for seamless offline-to-online state synchronization.

### Backend & Infrastructure
- **Database (BaaS):** Supabase (PostgreSQL)
- **Security:** Strict PostgreSQL Row Level Security (RLS) policies allowing secure user-isolated stat tracking while maintaining global read access for community solve counts.
- **Authentication:** Supabase Auth (Google OAuth 2.0 & Email/Password) with enforced **Email Enumeration Protection**.
- **Email Delivery:** Resend API (via custom verified SMTP).
- **Deployment:** Vercel (Edge network CI/CD) and Cloudflare (DNS routing & CNAME Flattening).

---

## 💡 How It Was Created
Overheard was built from the ground up to take the viral, daily-puzzle mechanics of Wordle and apply them to human psychology and deduction. 

**Key architectural challenges solved during development:**
1. **Offline-to-Online Migration:** Engineered a seamless local-storage architecture that allows guests to play the game frictionlessly without an account, and instantly migrates and isolates their local cache into an authenticated database session the moment they sign up.
2. **Race Condition Mitigation:** Developed an optimistic UI rendering system to handle race conditions where the client fetches historical user statistics while asynchronous database `upsert` queries are still processing on the server.
3. **Email Enumeration Protection:** Implemented strict security flows during authentication and password resets to prevent malicious actors from scraping registered emails, gracefully handling UI states without leaking database records.

---

## 🛠️ Local Development

To run this project locally:

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
