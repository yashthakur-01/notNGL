# 🎭 NotNGL

<p align="center">
  <img src="public/notngl.png" alt="NotNGL Logo" width="200"/>
</p>

<p align="center">
  <strong>Say it. I won't tell them.</strong>
</p>
<p align="center">
  <strong>LINK - https://not-ngl.vercel.app/</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📖 About

**NotNGL** is an anonymous messaging platform that lets you send and receive completely anonymous messages. No accounts to expose, no awkward follow-ups, and no fear of being judged. Create your unique profile link, share it on Instagram, WhatsApp, or with friends, and let the mystery messages roll in!

## ✨ Features

- 🔐 **User Authentication** - Secure sign-up and sign-in with email verification
- 💬 **Anonymous Messaging** - Send messages without revealing your identity
- 🎲 **AI Message Suggestions** - Get creative message ideas powered by Google Gemini AI
- 📬 **Inbox Management** - View, manage, and delete received messages
- 🔔 **Toggle Receiving** - Control when you want to accept new messages
- ✉️ **Email Verification** - OTP-based email verification system using Resend
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🌈 **Modern UI** - Stunning gradient backgrounds with Tailwind CSS

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDBAtlas](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Auth.js) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Email Service** | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| **AI Integration** | [LangChain](https://js.langchain.com/) + [Google Gemini](https://ai.google.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashthakur-01/NotNGL.git
   cd NotNGL
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com/) for email services |
| `AUTH_SECRET` | Secret key for NextAuth.js session encryption |
| `GOOGLE_API_KEY` | Google Gemini API key for AI message suggestions |

Example:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notngl
RESEND_API_KEY=re_xxxxxxxxxxxx
AUTH_SECRET=your-super-secret-key-here
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sign-up` | POST | Register a new user |
| `/api/verify-code` | POST | Verify email with OTP code |
| `/api/auth/[...nextauth]` | * | NextAuth.js authentication routes |
| `/api/check-username` | POST | Check if a username exists |
| `/api/check-unique-username` | POST | Check username availability during sign-up |
| `/api/send-message` | POST | Send an anonymous message to a user |
| `/api/get-messages` | GET | Get all messages for authenticated user |
| `/api/delete-message` | DELETE | Delete a specific message |
| `/api/accept-messages` | GET/PATCH | Get or toggle message acceptance status |
| `/api/suggest-message` | GET | Get AI-generated message suggestions |

## 📁 Project Structure

```
NotNGL/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (sign-in, sign-up, verify)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   └── profile/           # Public profile pages
│   ├── components/            # React components
│   │   └── ui/               # UI components (shadcn/ui)
│   ├── helpers/              # Utility functions
│   ├── lib/                  # Library configurations
│   ├── model/                # Mongoose models
│   ├── schemas/              # Zod validation schemas
│   ├── types/                # TypeScript type definitions
│   └── auth.ts               # NextAuth.js configuration
├── public/                    # Static assets
├── emails/                    # Email templates
└── ...config files
```

## 🎨 Features in Detail

### Anonymous Messaging
Users can share their unique profile link (`/profile/username`) anywhere. Anyone with the link can send them anonymous messages without creating an account.

### AI Message Suggestions
Stuck on what to say? The app uses Google Gemini AI to generate creative and fun message suggestions that you can use as inspiration.

### Email Verification
New users receive a verification email with a 6-digit OTP code. The code is valid for 1 hour and ensures email authenticity.

### Dashboard
Authenticated users get access to a dashboard where they can:
- View all received messages
- Delete individual messages
- Toggle whether they're accepting new messages
- Copy their profile link to share

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yashthakur-01">Yash Thakur</a>
</p>

<p align="center">
  <sub>No tracking. No names. Just messages.</sub>
</p>
