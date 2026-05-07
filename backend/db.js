const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL
});

pool.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal! Cek password di .env bro:', err.stack);
    } else {
        console.log('Terkoneksi ke database PostgreSQL!');
    }
});

module.exports = pool;