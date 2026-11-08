import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

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

        {/* Halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
