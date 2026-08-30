# 🎯 Interview AI Review

An AI-powered interview preparation & resume review platform built with **React**, **Node.js/Express**, **MongoDB**, and **Google Gemini AI**.

Interview AI Review analyzes candidate resumes against job descriptions to generate comprehensive interview readiness reports—including match scores, technical and behavioral questions with ideal answers, skill gap severity analysis, custom preparation roadmaps, and ATS-friendly PDF resume generation.

---

## 📁 Repository & Folder Structure

```
interview-ai-review/
├── Backend/                      # Node.js & Express API Server
│   ├── api/                      # Vercel serverless entry point
│   │   └── index.js
│   ├── src/
│   │   ├── config/               # Database configuration (MongoDB / Mongoose)
│   │   │   └── database.js
│   │   ├── controllers/          # Express route controllers
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/          # Authentication & security middlewares
│   │   │   └── auth.middleware.js
│   │   ├── models/               # Mongoose schemas (User, Blacklist)
│   │   │   ├── blacklist.model.js
│   │   │   └── user.model.js
│   │   ├── routes/               # API endpoint definitions
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   └── services/             # Gemini AI integration & Puppeteer PDF service
│   │       └── ai.service.js
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   ├── server.js                 # Local Express server entry point
│   └── vercel.json               # Backend Vercel deployment config
│
├── Frontend/                     # React 19 + Vite Frontend Client
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # Shared reusable components
│   │   ├── features/             # Feature-based pages & state modules
│   │   │   ├── auth/             # Auth pages (Login, Register)
│   │   │   └── interview/        # Interview report generator & dashboard
│   │   ├── style/                # Global styles & SCSS modules
│   │   │   └── style.scss
│   │   ├── App.jsx               # Main React Application component
│   │   ├── app.routes.jsx        # Client-side route configuration
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Vite bundler configuration
│   └── vercel.json               # Frontend Vercel deployment config
│
├── .gitignore                    # Global Git ignore rules
├── package.json                  # Root dependencies config
└── README.md                     # Project documentation
```

---

## ✨ Features

- 🤖 **AI-Driven Interview Reports**: Generates tailored match scores, targeted technical questions, behavioral scenarios, and key learning outcomes based on uploaded resumes and target job descriptions.
- 🎯 **Skill Gap Analysis**: Identifies missing candidate skills categorized by severity (low, medium, high) to target key weaknesses before interviews.
- 📅 **Custom Preparation Plan**: Delivers a step-by-step, day-by-day action plan with specific study topics and coding/behavioral practice goals.
- 📄 **ATS Resume Generator & PDF Export**: Generates professionally styled, ATS-compliant HTML resumes tailored to job descriptions and converts them to downloadable PDFs.
- 🔐 **Secure Authentication**: User sign-up and sign-in using JWT tokens, HTTP-only cookies, and password hashing (`bcryptjs`).
- ⚡ **Mock Fallback Mode**: Gracefully handles missing database connections or API keys with built-in mock modes for fast local testing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: `react-router`
- **Styling**: SCSS / Vanilla CSS
- **HTTP Client**: `axios`

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ORM
- **AI Engine**: Google GenAI (`@google/genai` - Gemini 2.5 Flash)
- **PDF Generation**: Puppeteer
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
- **Validation**: Zod & Zod-to-JSON-Schema

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** instance (Local or MongoDB Atlas cluster)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### 2. Clone the Repository

```bash
git clone https://github.com/Uttam7898/interview-ai-review.git
cd interview-ai-review
```

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder by copying `.env.example`:

```env
# Google GenAI API Key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/interview-ai

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key

# Allowed CORS Origin
CORS_ORIGIN=http://localhost:5173

# Port & Node Environment
PORT=3000
NODE_ENV=development
```

Start the Backend development server:

```bash
npm run dev
```

> The Backend will start on `http://localhost:3000`.

### 4. Frontend Setup

In a new terminal window:

```bash
cd Frontend
npm install
npm run dev
```

> The Frontend will start on `http://localhost:5173`.

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & issue JWT cookie | ❌ |
| `GET` | `/api/auth/logout` | Clear auth token cookie & invalidate JWT | ❌ |
| `GET` | `/api/auth/get-me` | Retrieve authenticated user profile | ✅ |
| `POST` | `/api/interview/generate-report` | Generate AI interview report | ✅ |
| `POST` | `/api/interview/generate-resume` | Generate tailored resume PDF | ✅ |

---

## 🚢 Deployment

### Deploying on Vercel

Both `Backend` and `Frontend` include pre-configured `vercel.json` files for seamless Vercel deployment.

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push origin main
   ```
2. **Deploy Backend**: Import the repository on Vercel, set the Root Directory to `Backend`, and configure Environment Variables (`GOOGLE_GENAI_API_KEY`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`).
3. **Deploy Frontend**: Import the repository on Vercel, set the Root Directory to `Frontend`, and set build command to `npm run build`.

---

## 📝 License

This project is open source under the [ISC License](LICENSE).
