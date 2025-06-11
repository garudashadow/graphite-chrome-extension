# Setup Guide - ChatApp

Panduan lengkap untuk menjalankan aplikasi ChatApp di lingkungan development dan production.

## 📋 Prasyarat

- Node.js 18+ dan npm
- Akun Supabase (gratis)
- Git

## 🚀 Quick Start

### 1. Clone dan Install Dependencies

```bash
git clone <repository-url>
cd chat-dashboard-app
npm install
```

### 2. Setup Supabase

1. **Buat Project Baru**
   - Kunjungi [Supabase](https://supabase.com)
   - Klik "New Project"
   - Pilih organization dan beri nama project
   - Pilih region terdekat
   - Buat password database yang kuat
   - Tunggu project selesai dibuat (~2 menit)

2. **Dapatkan API Keys**
   - Masuk ke project dashboard
   - Klik "Settings" → "API"
   - Copy `Project URL` dan `anon public` key

3. **Setup Database Schema**
   - Klik "SQL Editor" di sidebar
   - Klik "New Query"
   - Copy paste isi file `supabase/migrations/001_initial_schema.sql`
   - Klik "Run" untuk menjalankan migration

### 3. Konfigurasi Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 👤 Membuat Admin User

Setelah registrasi user pertama, ubah role menjadi admin:

1. Masuk ke Supabase Dashboard
2. Klik "Table Editor" → "profiles"
3. Cari user yang ingin dijadikan admin
4. Edit kolom `role` dari `user` menjadi `admin`
5. Save changes

## 🗄️ Database Schema Overview

### Tables
- **profiles**: Data pengguna dengan role
- **chat_rooms**: Room chat yang tersedia
- **messages**: Pesan chat
- **user_stats**: Statistik aktivitas pengguna

### Default Data
- Room "General" akan otomatis dibuat
- User stats akan otomatis dibuat saat registrasi

## 🔧 Development Commands

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production build
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Kunjungi [Vercel](https://vercel.com)
   - Import repository dari GitHub
   - Set environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Deploy

3. **Update Supabase Settings**
   - Masuk ke Supabase Dashboard
   - Klik "Authentication" → "URL Configuration"
   - Tambahkan domain Vercel ke "Site URL" dan "Redirect URLs"

### Manual Deployment

```bash
# Build aplikasi
npm run build

# Jalankan di production
npm start
```

## 🔐 Security Setup

### Supabase RLS (Row Level Security)

RLS sudah dikonfigurasi otomatis melalui migration. Policies yang diterapkan:

- **Profiles**: User bisa lihat semua, edit milik sendiri, admin bisa edit semua
- **Messages**: User bisa lihat semua, kirim/edit milik sendiri, admin bisa kelola semua
- **Chat Rooms**: User bisa lihat semua, admin bisa kelola semua
- **User Stats**: User bisa lihat semua, update milik sendiri, admin bisa kelola semua

### Environment Variables

Pastikan environment variables tidak ter-commit ke repository:
- `.env.local` sudah ada di `.gitignore`
- Gunakan `.env.local.example` sebagai template

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- Pastikan email dan password benar
- Cek apakah user sudah terdaftar
- Pastikan Supabase Auth enabled

### Error: "Failed to fetch"
- Cek koneksi internet
- Pastikan Supabase URL dan API key benar
- Cek Supabase project status

### Real-time tidak berfungsi
- Pastikan Supabase Realtime enabled
- Cek browser console untuk error WebSocket
- Pastikan RLS policies tidak memblokir akses

### Build error
- Pastikan semua dependencies terinstall
- Cek TypeScript errors dengan `npm run type-check`
- Pastikan environment variables tersedia

### Database connection error
- Verifikasi credentials di `.env.local`
- Pastikan database migration sudah dijalankan
- Cek Supabase project tidak dalam maintenance

## 📊 Monitoring

### Supabase Dashboard
- **Database**: Monitor query performance
- **Auth**: Lihat user registrations dan logins
- **Realtime**: Monitor WebSocket connections
- **Logs**: Debug errors dan performance issues

### Application Monitoring
- Check browser console untuk client-side errors
- Monitor network requests di DevTools
- Gunakan Vercel Analytics untuk production metrics

## 🔄 Updates

### Database Schema Updates
1. Buat file migration baru di `supabase/migrations/`
2. Jalankan di Supabase SQL Editor
3. Test di development environment
4. Deploy ke production

### Application Updates
1. Test changes locally
2. Commit dan push ke repository
3. Vercel akan auto-deploy dari main branch
4. Monitor deployment logs

## 📞 Support

Jika mengalami masalah:
1. Cek troubleshooting guide di atas
2. Lihat Supabase logs untuk database issues
3. Cek browser console untuk client errors
4. Buat issue di repository dengan detail error

---

**Happy coding! 🚀**

