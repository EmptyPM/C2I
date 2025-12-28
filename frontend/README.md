# Frontend - Crypto Investment Platform

This is the frontend application for the Crypto Investment Platform, built with [Next.js](https://nextjs.org).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:4000`

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Configuration

The frontend is configured to connect to the backend API at `http://localhost:4000/api`.

To change the API URL, update the `api-client.ts` file in the `lib` directory.

## 📁 Project Structure

```
frontend/
├── app/              # Next.js app directory (pages and layouts)
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── dashboard/   # Dashboard-specific components
├── lib/             # Utility functions and API client
├── hooks/           # Custom React hooks
└── public/          # Static assets
```

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time updates

## 📖 Key Features

- User authentication and authorization
- Dashboard with investment tracking
- Deposit and withdrawal management
- Real-time profit updates
- Admin panel
- Responsive design

For more information about the full project, see the root [README.md](../README.md).
