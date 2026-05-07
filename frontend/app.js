// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/common/Navbar";

// Import semua halaman (dengan nama file huruf kecil)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
import AdminBorrowingsPage from "./pages/AdminBorrowingsPage";

/**
 * FILE UTAMA APLIKASI
 *
 * STRUKTUR ROUTING:
 * /login               → Halaman login (tanpa proteksi)
 * /register            → Halaman daftar (tanpa proteksi)
 * /dashboard           → Dashboard user (wajib login)
 * /inventory           → Daftar inventaris (wajib login)
 * /my-borrowings       → Peminjaman saya (khusus student/mahasiswa)
 * /admin/borrowings    → Kelola peminjaman (khusus coordinator)
 * /                    → Redirect ke dashboard
 */

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Routes>
            {/* ==================== HALAMAN PUBLIK (Tanpa Login) ==================== */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ==================== HALAMAN YANG WAJIB LOGIN ==================== */}

            {/* Dashboard - Semua user yang login bisa akses */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Inventaris - Semua user yang login bisa akses */}
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <InventoryPage />
                </PrivateRoute>
              }
            />

            {/* Peminjaman Saya - KHUSUS MAHASISWA (student) */}
            <Route
              path="/my-borrowings"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <MyBorrowingsPage />
                </PrivateRoute>
              }
            />

            {/* Kelola Peminjaman - KHUSUS KOORDINATOR */}
            <Route
              path="/admin/borrowings"
              element={
                <PrivateRoute allowedRoles={["coordinator"]}>
                  <AdminBorrowingsPage />
                </PrivateRoute>
              }
            />

            {/* ==================== REDIRECT ==================== */}
            {/* Root path redirect ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 - Halaman tidak ditemukan */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Halaman tidak ditemukan</p>
                  <a
                    href="/dashboard"
                    className="text-blue-600 hover:underline"
                  >
                    Kembali ke Dashboard →
                  </a>
                </div>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
