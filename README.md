# SISTEM MANAJEMEN PEMINJAMAN FASILITAS LABORATORIUM IT

**Proyek Kelompok - Secure Software Engineering** **Teknik Informatika, Universitas Palangka Raya**

---

## Anggota Kelompok
1. **Muhammad Rony Kurniawan** (2330105030018)
2. **Syawal Hidayat** (2330305030073)

---

## Deskripsi Sistem
**Sistem Manajemen Peminjaman Fasilitas Laboratorium IT** adalah aplikasi berbasis web yang dirancang untuk memfasilitasi mahasiswa dalam meminjam inventaris dan *resource* laboratorium (seperti PC, perangkat jaringan, atau proyektor) secara efisien dan aman. 

Sistem ini beroperasi dengan dua peran utama (*Role-Based Access Control*):
- **Mahasiswa:** Mengajukan permohonan peminjaman fasilitas.
- **Koordinator:** Mengelola ketersediaan inventaris dan memiliki hak eksklusif untuk menyetujui (*Approve*) atau menolak (*Reject*) permohonan.

Fokus utama dari pengembangan sistem ini adalah menjaga integritas data ketersediaan barang dan mencegah manipulasi hak akses antarpengguna.

---

## Fokus Implementasi Keamanan (Security by Design)
Sistem ini dibangun dengan mematuhi prinsip *Secure Software Development Life Cycle* (S-SDLC), mengimplementasikan perlindungan terhadap ancaman utama (STRIDE):

1. **Autentikasi & Manajemen Sesi:** - Penyimpanan *password* menggunakan algoritma *hashing* `bcrypt`.
   - Manajemen sesi aman tanpa menggunakan *localStorage*, melainkan menggunakan *token* dalam `HttpOnly` dan `Secure` Cookie.
2. **Otorisasi (Least Privilege):** - Implementasi RBAC yang sangat ketat untuk memastikan tidak ada eskalasi hak akses (IDOR/Privilege Escalation) dari Mahasiswa menuju rute/API Koordinator.
3. **Validasi & Proteksi Injeksi:** - Penggunaan *Parameterized Query* mutlak pada semua eksekusi *database* untuk meniadakan ancaman *SQL Injection*.
   - Sanitasi *input/output* sisi *server* untuk menangkal ancaman *Cross-Site Scripting* (XSS) pada kolom deskripsi peminjaman.
4. **HTTP Security Headers:** - Mengaplikasikan *Content-Security-Policy* (CSP), *X-Frame-Options*, dan *anti-MIME sniffing*.

---

## Stack Teknologi
- **Frontend:** React.js
- **Backend API:** Node.js + Express
- **Database:** PostgreSQL

---

## Cara Menjalankan Aplikasi (How to Run)
*(Catatan: Instruksi detail akan diperbarui seiring dengan selesainya pengembangan fitur di branch fitur)*

**Prasyarat:**
- Node.js (v18+)
- PostgreSQL Database

**Langkah Instalasi:**
1. *Clone* repositori ini: `git clone [URL-REPO]`
2. Masuk ke direktori *backend* dan instal dependensi: `cd backend && npm install`
3. Masuk ke direktori *frontend* dan instal dependensi: `cd frontend && npm install`
4. Buat *file* `.env` pada direktori *backend* untuk konfigurasi *database* (jangan di-*commit*!).
5. Jalankan *server* lokal untuk pengujian.
