## Social Growth SaaS Platform

A modern, high-performance SaaS platform for buying social media growth services (followers, likes, views, engagement) for Instagram, TikTok, and YouTube.

### Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, REST API
- **Database**: MongoDB with Mongoose
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Payments**: Stripe integration (wallet top-ups / orders)
- **Deployment**: Vercel (frontend), Railway/Render (backend)

### Project Structure

- `frontend` – Next.js app (marketing site, user dashboard, admin panel)
- `backend` – Express API (auth, services, orders, wallet, referrals, coupons, admin, Stripe, SMM panel integration)

### Getting Started

1. **Backend**
   - Copy `backend/.env.example` to `.env` and fill in values.
   - Install dependencies:
     - `cd backend`
     - `npm install`
   - Run in development:
     - `npm run dev`

2. **Frontend**
   - Copy `frontend/.env.example` to `.env.local` and fill in values.
   - Install dependencies:
     - `cd frontend`
     - `npm install`
   - Run in development:
     - `npm run dev`

### Environment Variables (Backend)

See `backend/.env.example` for all variables:

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for signing JWTs
- `CLIENT_URL` – Frontend base URL (for CORS, email links)
- `STRIPE_SECRET_KEY` – Stripe secret key
- `STRIPE_WEBHOOK_SECRET` – Stripe webhook signing secret
- `SMM_API_URL` / `SMM_API_KEY` – External SMM panel API config

### Environment Variables (Frontend)

See `frontend/.env.example`:

- `NEXT_PUBLIC_API_BASE_URL` – Base URL of the backend API
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Public Stripe key

### Deployment Notes

- **Frontend (Vercel)**: Point project root to `frontend`, set env vars in Vercel dashboard.
- **Backend (Railway/Render)**: Point to `backend`, set Node version, environment variables, and MongoDB connection.

### Security Notes

- All sensitive operations are done via the backend API (never expose secrets on the frontend).
- JWT tokens are validated on each protected API route.
- Passwords are hashed with bcrypt before storage.

