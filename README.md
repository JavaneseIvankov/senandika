# Senandika

🌐 **Live Demo**: [senandika-seven.vercel.app](https://senandika-seven.vercel.app)

Aplikasi web modern yang dibangun dengan Next.js 16, React 19, dan TypeScript untuk manajemen konten dan interaksi pengguna dengan fitur AI terintegrasi.

## 🚀 Fitur Utama

- **Autentikasi Modern** - Sistem autentikasi yang aman menggunakan Better Auth
- **AI Integration** - Integrasi dengan Google AI dan OpenAI untuk fitur-fitur AI
- **Database Management** - Menggunakan Drizzle ORM dengan Neon Database (PostgreSQL serverless)
- **UI Components** - Komponen UI modern dengan Radix UI dan Tailwind CSS
- **Form Management** - Pengelolaan form dengan React Hook Form dan validasi Zod
- **Dark Mode** - Dukungan tema gelap/terang dengan next-themes
- **Data Visualization** - Visualisasi data dengan Recharts
- **Responsive Design** - Desain responsif dengan Tailwind CSS 4

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.1
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animations**: Embla Carousel, tw-animate-css

### Backend & Database
- **Database**: Neon Database (PostgreSQL Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth

### AI & Machine Learning
- **AI SDK**: Vercel AI SDK
- **Providers**: Google AI, OpenAI

### Developer Tools
- **Linter/Formatter**: Biome
- **Database Tools**: Drizzle Kit
- **Compiler**: Babel React Compiler

## 📦 Instalasi

### Prerequisites
- Node.js 20.x atau lebih tinggi
- pnpm (recommended) atau npm

### Setup

1. Clone repository
```bash
git clone https://github.com/JavaneseIvankov/senandika.git
cd senandika
```

2. Install dependencies
```bash
pnpm install
# atau
npm install
```

3. Setup environment variables
```bash
# Buat file .env.local dan tambahkan variabel yang diperlukan
# Lihat .env.example untuk referensi
```

4. Generate dan migrate database
```bash
pnpm db:genmig
# atau
npm run db:genmig
```

5. Jalankan development server
```bash
pnpm dev
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Menjalankan development server

# Production
pnpm build        # Build aplikasi untuk production
pnpm start        # Menjalankan production server

# Code Quality
pnpm lint         # Cek kualitas kode dengan Biome
pnpm format       # Format kode dengan Biome

# Database
pnpm db:generate  # Generate schema database
pnpm db:migrate   # Jalankan migrasi database
pnpm db:genmig    # Generate dan migrate sekaligus
```

## 📁 Struktur Project

```
senandika/
├── src/
│   ├── actions/      # Server actions
│   ├── app/          # Next.js app directory
│   ├── features/     # Feature modules
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Library utilities
│   └── shared/       # Shared components dan utilities
├── public/           # Static assets
├── migrations/       # Database migrations
├── references/       # Documentation references
└── ...config files
```

## 🔧 Konfigurasi

Project ini menggunakan beberapa file konfigurasi:
- `next.config.ts` - Konfigurasi Next.js
- `tailwind.config.js` - Konfigurasi Tailwind CSS
- `biome.json` - Konfigurasi Biome (linter/formatter)
- `drizzle.config.ts` - Konfigurasi Drizzle ORM
- `components.json` - Konfigurasi komponen UI
- `tsconfig.json` - Konfigurasi TypeScript

## 👥 Author

[**JavaneseIvankov**](https://github.com/JavaneseIvankov) - Back End
[**fahrypratama17**](https://github.com/fahrypratama17) - Front End

## 🌟 Acknowledgments

- Next.js Team
- Vercel
- Radix UI Team
- Semua kontributor open source yang membuat project ini memungkinkan

---

⭐ Jika project ini bermanfaat, jangan lupa berikan star di GitHub!
