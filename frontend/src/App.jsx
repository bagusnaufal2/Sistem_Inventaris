import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventaris from "./pages/admin/Inventaris";
import Lokasi from "./pages/admin/Lokasi";
import Kerusakan from "./pages/admin/Kerusakan";
import Perbaikan from "./pages/admin/Perbaikan";
import Laporan from "./pages/admin/Laporan";
import Pengguna from "./pages/admin/Pengguna";
import Kategori from "./pages/admin/Kategori";
import LogAktivitas from "./pages/admin/LogAktivitas";
import Pengaturan from "./pages/admin/Pengaturan";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Admin */}
        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        {/* Halaman Admin */}
        <Route path="/admin/inventaris" element={<Inventaris />} />
        <Route path="/admin/lokasi" element={<Lokasi />} />
        <Route path="/admin/kerusakan" element={<Kerusakan />} />
        <Route path="/admin/perbaikan" element={<Perbaikan />} />
        <Route path="/admin/laporan" element={<Laporan />} />
        <Route path="/admin/pengguna" element={<Pengguna />} />
        <Route path="/admin/kategori" element={<Kategori />} />
        <Route path="/admin/log-aktivitas" element={<LogAktivitas />} />
        <Route path="/admin/pengaturan" element={<Pengaturan />} />

        {/* Halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
