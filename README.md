# 🕉️ SriSri Solutions

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)

**SriSri Solutions** is a modern, full-stack application designed specifically for **Art of Living** teachers and volunteers. It simplifies the process of creating beautiful, personalized, and "WhatsApp-ready" promotional messages for courses by simply pasting a registration link.

---

## ✨ Key Features

- **🚀 Instant Generation**: Paste an `aolt.in` or `artofliving.online` link and get professional messages in seconds.
- **🎨 Tailored Personalization**: Fine-tune messages based on:
  - **Target Audience**: Newcomers, regular practitioners, youth, etc.
  - **Message Tone**: Warm, professional, enthusiastic, or calm.
  - **Length**: Short & punchy or detailed & informative.
  - **Core Benefit**: Stress relief, health, focus, or spiritual growth.
  - **Emoji Level**: From minimal to "social media ready."
- **📱 WhatsApp Optimized**: Messages are pre-formatted with line breaks and emojis, ready to be copied and shared.
- **🛡️ Intelligent Normalization**: Automatically extracts event IDs and fetches real-time course data (teachers, dates, venue, online/offline status) from AOL servers.
- **✨ Modern UI/UX**: Built with React 19, Tailwind CSS 4, and Framer Motion for a fluid, premium experience.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite 8)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Fetching**: Native Fetch API with normalization logic.
- **Development**: [tsx](https://github.com/privatenumber/tsx) for fast, type-safe execution.

---

## 📂 Project Structure

```text
srisri-solutions-vite/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/           # API client logic
│   │   ├── components/    # Reusable UI & Feature components
│   │   ├── layout/        # AppShell, Sidebar, etc.
│   │   ├── pages/         # Page-level components
│   │   └── styles/        # Global CSS (Tailwind 4)
│   └── vite.config.ts
├── server/                # Express Backend
│   ├── routes/            # API Endpoints
│   ├── services/          # Business logic (AOL API normalization)
│   └── index.ts           # Server entry point
└── README.md              # You are here!
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/srisri-solutions-vite.git
   cd srisri-solutions-vite
   ```

2. **Configure Environment Variables**:
   
   **Server**:
   ```bash
   cd server
   cp .env.example .env
   # Add your AOL_API_URL in .env
   ```

   **Client**:
   ```bash
   cd ../client
   cp .env.example .env
   ```

3. **Install Dependencies**:
   ```bash
   # In root (if using workspaces) or separately:
   cd client && npm install
   cd ../server && npm install
   ```

4. **Run the Application**:

   **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```

   **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

The application should now be running at `http://localhost:5173` (Frontend) and `http://localhost:3000` (Backend).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the ISC License. See `server/package.json` for more information.

---

## ❤️ Acknowledgments

- Inspired by the vision of **Sri Sri Ravi Shankar**.
- Dedicated to the **Art of Living** global family of teachers and volunteers.
- Built with love and service.

---
*Created by [Srisri Solutions](https://github.com/your-username)*
