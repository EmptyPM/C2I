<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Backend - Crypto Investment Platform

Backend API for the Crypto Investment Platform, built with [NestJS](https://nestjs.com/).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=4000
```

3. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

4. Start the development server:
```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

The server will run on **http://localhost:4000**

## 📝 Available Scripts

```bash
npm run start:dev      # Start development server with hot reload
npm run start          # Start production server
npm run start:prod     # Build and start production server
npm run build          # Build the project
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## 🔧 Environment Variables

Required environment variables in `.env`:

- `DATABASE_URL` - SQLite database connection string (e.g., `file:./dev.db`)
- `JWT_SECRET` - Secret key for JWT token encryption
- `PORT` - Server port (default: 4000)

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── deposits/       # Deposit management
│   ├── withdrawals/    # Withdrawal management
│   ├── settings/       # Platform settings
│   ├── profit-engine/  # Profit calculation engine
│   └── ...
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── test/               # Test files
```

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Modern database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time WebSocket support
- **bcrypt** - Password hashing
- **TypeScript** - Type safety

## 📡 API Endpoints

The API is available at `http://localhost:4000/api`

### Main Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/deposits/my` - Get user deposits
- `POST /api/withdrawals` - Create withdrawal
- `GET /api/admin/*` - Admin endpoints (requires ADMIN role)
- `GET /api/settings/*` - Platform settings

For more information about the full project, see the root [README.md](../README.md).

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
