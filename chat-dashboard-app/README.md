# ChatApp - Real-time Chat & Dashboard

Aplikasi web chat real-time dengan dashboard manajemen yang dibangun menggunakan Next.js dan Supabase.

## 🚀 Fitur Utama

### Untuk Pengguna (User)
- ✅ Chat real-time dengan sinkronisasi langsung
- ✅ Interface yang responsif dan user-friendly
- ✅ Sistem autentikasi yang aman
- ✅ Notifikasi online status
- ✅ Riwayat pesan

### Untuk Admin
- ✅ Dashboard komprehensif dengan statistik real-time
- ✅ Monitoring aktivitas chat
- ✅ Manajemen pengguna
- ✅ Grafik aktivitas per jam
- ✅ Top users berdasarkan aktivitas
- ✅ Kontrol penuh atas pesan dan pengguna

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **UI Components**: Lucide React, Recharts
- **Form Handling**: React Hook Form, Zod
- **Styling**: Tailwind CSS

## 📋 Prasyarat

- Node.js 18+ 
- npm atau yarn
- Akun Supabase

## 🔧 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd chat-dashboard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Buat project baru di [Supabase](https://supabase.com)
   - Jalankan migration SQL yang ada di folder `supabase/migrations/`
   - Copy URL dan API keys

4. **Konfigurasi Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## 🗄️ Database Schema

### Tables
- **profiles**: Data pengguna dengan role (admin/user)
- **chat_rooms**: Room chat yang tersedia
- **messages**: Pesan chat dengan relasi ke user dan room
- **user_stats**: Statistik aktivitas pengguna

### Row Level Security (RLS)
- Implementasi keamanan tingkat baris untuk semua tabel
- Role-based access control
- Admin memiliki akses penuh, user terbatas

## 🔐 Sistem Autentikasi

- **Registrasi**: Email + password dengan verifikasi
- **Login**: Email + password
- **Role Management**: Otomatis assign role 'user', admin dapat mengubah
- **Protected Routes**: Middleware untuk mengatur akses berdasarkan role

## 📱 Responsive Design

- Mobile-first approach
- Sidebar yang dapat dilipat di mobile
- Layout yang adaptif untuk semua ukuran layar
- Touch-friendly interface

## 🔄 Real-time Features

- **Chat Messages**: Sinkronisasi pesan secara real-time
- **Online Status**: Tracking pengguna yang sedang online
- **Admin Dashboard**: Update statistik secara real-time
- **Typing Indicators**: (dapat ditambahkan)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Monitoring & Analytics

Dashboard admin menyediakan:
- Total pengguna terdaftar
- Total pesan terkirim
- Pengguna aktif (24 jam terakhir)
- Grafik aktivitas per jam
- Top 5 pengguna paling aktif

## 🔧 Kustomisasi

### Menambah Room Chat Baru
```sql
INSERT INTO chat_rooms (name, description, created_by) 
VALUES ('Room Name', 'Description', 'admin_user_id');
```

### Mengubah Role Pengguna
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- Pastikan email dan password benar
- Cek apakah akun sudah diverifikasi

### Real-time tidak berfungsi
- Cek koneksi internet
- Pastikan Supabase Realtime enabled
- Cek browser console untuk error

### Database connection error
- Verifikasi environment variables
- Cek Supabase project status
- Pastikan RLS policies sudah dijalankan

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan Next.js dan Supabase**

