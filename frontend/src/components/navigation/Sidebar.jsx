import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 640);

  const role = user?.role;

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 640;
      setIsMobile(mobileView);

      if (!mobileView) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const adminMenus = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
    { label: "Data Inventaris", path: "/admin/inventaris", icon: "▤" },
    { label: "Lokasi & Ruangan", path: "/admin/lokasi", icon: "⌖" },
    { label: "Laporan Kerusakan", path: "/admin/kerusakan", icon: "⚠" },
    { label: "Manajemen Perbaikan", path: "/admin/perbaikan", icon: "⚒" },
    { label: "Laporan & Statistik", path: "/admin/laporan", icon: "▥" },
    { label: "Manajemen Pengguna", path: "/admin/pengguna", icon: "♙" },
    { label: "Kategori Barang", path: "/admin/kategori", icon: "▦" },
    { label: "Log Aktivitas", path: "/admin/log-aktivitas", icon: "◷" },
    { label: "Pengaturan", path: "/admin/pengaturan", icon: "⚙" },
  ];

  const menus = role === "ADMIN" ? adminMenus : [];

  return (
    <div
      className="shrink-0 sidebar-container sidebar-scroll"
      style={{
        width: isMobile ? (isOpen ? "230px" : "55px") : "250px",
        height: "100vh",
        position: isMobile ? "fixed" : "relative",
        left: 0,
        top: 0,
        zIndex: 20,
        background: "#133354",
        boxShadow: "5px 0px 27px rgba(0, 0, 0, 0.15)",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
        transition: "width 0.3s ease",
      }}
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-start mb-8 text-white">
        {isOpen && (
            <div className="flex items-center gap-3 text-white">
                <img
                    src="/logo/logoatq.png"
                    alt="Logo SMPIT At-Taufiq"
                    className="w-12 h-12 object-contain shrink-0"
                />
            <div className="flex flex-col">
                 <p className="text-base font-bold whitespace-nowrap">
                    AT-Taufiq
                </p>
                <p className="text-xs text-[#A4B5C7]">
                    SARPRAS MANAGEMENT
                </p>
            </div>
        </div>
        )}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-xl"
              aria-label="Toggle sidebar"
            >
              {isOpen ? "<" : ">"}
            </button>
          )}
        </div>

        {isOpen && (
          <p className="text-sm font-semibold text-[#A4B5C7] mb-4">
            MENU UTAMA
          </p>
        )}

        <div className="flex flex-col gap-2">
          {menus.map((menu) => (
            <MenuItem
              key={menu.path}
              label={menu.label}
              path={menu.path}
              icon={
                <span className="text-xl w-6 text-center">
                  {menu.icon}
                </span>
              }
              isOpen={isOpen}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-white/10 w-full"
        >
          <span className="text-xl">⇥</span>
          {isOpen && <span>Logout</span>}
        </button>
        {isOpen && (
          <p className="text-xs text-[#A4B5C7] px-3 pb-1">
            SMPIT AT-Taufiq • v1.0
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
