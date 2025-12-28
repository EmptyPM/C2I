# Crypto Investment Platform

A full-stack cryptocurrency investment platform built with Next.js (frontend) and NestJS (backend).

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **SQLite** (for database - comes with Node.js)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add the following environment variables:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key-here"
PORT=4000
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

5. Start the backend server:
```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

The backend server will run on **http://localhost:4000**

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

## 📁 Project Structure

```
crypto-invest-platform/
├── backend/          # NestJS backend API
│   ├── src/         # Source code
│   ├── prisma/      # Database schema and migrations
│   └── package.json
├── frontend/        # Next.js frontend application
│   ├── app/        # Next.js app directory
│   ├── components/ # React components
│   └── package.json
└── README.md
```

## 🛠️ Available Scripts

### Backend Scripts

```bash
npm run start:dev      # Start development server with hot reload
npm run start          # Start production server
npm run start:prod     # Build and start production server
npm run build          # Build the project
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
```

### Frontend Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Lint code
```

## 🔧 Environment Variables

### Backend (.env)

- `DATABASE_URL` - SQLite database connection string
- `JWT_SECRET` - Secret key for JWT token encryption
- `PORT` - Backend server port (default: 4000)

### Frontend (.env.local)

No environment variables required by default. The frontend is configured to connect to `http://localhost:4000` for API requests.

## 📝 Database Management

### Run Migrations

```bash
cd backend
npx prisma migrate dev
```

### View Database

```bash
cd backend
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and edit the database.

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

⚠️ **Warning:** This will delete all data in the database.

## 🎯 Key Features

- User authentication (Register, Login, Password Reset)
- Investment packages and trading simulation
- Deposit and withdrawal management
- Profit calculation and distribution
- Referral system
- Admin dashboard
- Real-time forex price updates
- TRC20 (USDT) deposit support

## 📚 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Modern database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time updates
- **bcrypt** - Password hashing

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates

## 🔐 Default Admin Account

After setting up the database, you'll need to create an admin account through the registration process and then manually update the user's role to `ADMIN` in the database.

## 📖 API Documentation

The backend API is available at `http://localhost:4000/api`

### Main Endpoints:
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/deposits/*` - Deposit management
- `/api/withdrawals/*` - Withdrawal management
- `/api/admin/*` - Admin endpoints (requires ADMIN role)
- `/api/settings/*` - Platform settings

## 🐛 Troubleshooting

### Backend Issues

1. **Database connection errors:**
   - Make sure the `DATABASE_URL` in `.env` is correct
   - Run `npx prisma generate` to regenerate Prisma Client
   - Run `npx prisma migrate dev` to apply migrations

2. **Port already in use:**
   - Change the `PORT` in `.env` file
   - Or kill the process using port 4000

### Frontend Issues

1. **Cannot connect to backend:**
   - Make sure the backend is running on port 4000
   - Check `lib/api-client.ts` for the correct API URL

2. **Build errors:**
   - Delete `node_modules` and `.next` folder
   - Run `npm install` again
   - Run `npm run dev` again

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For issues or feature requests, please contact the development team.

