require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// 1. SECURITY HEADERS (Checklist OWASP: Done)
app.use(helmet());

// 2. MIDDLEWARE UTAMA
app.use(express.json()); // Supaya bisa baca JSON dari Frontend
app.use(cookieParser()); // Supaya bisa baca Token JWT di Cookie
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Izin akses untuk React

// 3. RATE LIMITING (Checklist OWASP: Done)
// Mencegah Brute Force: Maksimal 50 request per 15 menit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50,
    message: "Terlalu banyak request dari IP ini, coba lagi nanti."
});
app.use('/api/', limiter);

// --- ROUTING API ---
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend aman dan berjalan bro!" });
});

// 1. ENDPOINT REGISTER (Bukti: Password Hashing & Parameterized Query)
app.post('/api/register', async (req, res, next) => {
    try {
        const { nim, nama, password, role } = req.body;
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await pool.query(
            'INSERT INTO users (nim, nama, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, nim, nama, role',
            [nim, nama, hashedPassword, role || 'mahasiswa']
        );
        res.status(201).json({ message: "Registrasi berhasil!", user: result.rows[0] });
    } catch (err) {
        next(err); 
    }
});

// 2. ENDPOINT LOGIN (Bukti: JWT di HttpOnly Cookie)
app.post('/api/login', async (req, res, next) => {
    try {
        const { nim, password } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE nim = $1', [nim]);
        
        if (userResult.rows.length === 0) return res.status(401).json({ error: "NIM atau Password salah!" });
        const user = userResult.rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) return res.status(401).json({ error: "NIM atau Password salah!" });

        const token = jwt.sign(
            { id: user.id, nim: user.nim, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } 
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 
        });
        res.json({ message: "Login berhasil!", role: user.role });
    } catch (err) {
        next(err);
    }
});

// 4. CENTRALIZED ERROR HANDLING (Checklist OWASP: Done)
// Mencegah error database bocor ke layar pengguna
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack); 
    res.status(500).json({ error: "Terjadi kesalahan pada sistem server!" });
});

// 5. JALANKAN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend menyala di http://localhost:${PORT}`);
});