import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      login(user, token);

      // Arahkan pengguna berdasarkan role
switch (user.role) {
  case "ADMIN":
    navigate("/admin/dashboard");
    break;

  case "PETUGAS":
    navigate("/petugas/dashboard");
    break;

  case "GURU":
    navigate("/guru/dashboard");
    break;

  case "KEPALA_SEKOLAH":
    navigate("/kepala-sekolah/dashboard");
    break;

  default:
    setError("Role pengguna tidak dikenali.");
    break;
}
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <img
            src="/logo/logoatq.png"
            alt="Logo SMPIT At-Taufiq"
            className="login-logo"
          />
          <h2>Selamat Datang</h2>
          <p>
            Sistem Inventaris dan Pelaporan Sarana
            SMPIT At-Taufiq
          </p>
        </div>

        <div className="login-right">
          <h2 className="login-form-title">Login to Your Account</h2>

          <form onSubmit={handleLogin}>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
