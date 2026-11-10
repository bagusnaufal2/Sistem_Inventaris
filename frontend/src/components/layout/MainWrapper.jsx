import Sidebar from "../navigation/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MainWrapper = ({ title, description, children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#F6F8FB]">
      <Sidebar />

      <div className="flex-1 min-w-0 h-screen flex flex-col">
        {/* Header — sesuai Figma: putih, breadcrumb, search, avatar */}
        <header className="bg-white border-b border-[#EAEEF4] px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <nav className="text-sm text-gray-500 flex items-center gap-2 min-w-0">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="hover:text-[#2975B2] font-medium shrink-0"
            >
              Beranda
            </button>
            <span className="text-gray-300 shrink-0">/</span>
            <span className="text-[#133354] font-semibold truncate">
              {title}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari data..."
              className="hidden sm:block bg-[#F6F8FB] rounded-lg px-3.5 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6F2FF] text-[#2975B2] flex items-center justify-center text-sm font-bold shrink-0">
                AD
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold text-[#133354]">
                  {user?.name || "Admin Sarpras"}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-[25px]"
          style={{
            padding: window.innerWidth <= 660 ? "30px 14px" : "40px",
          }}
        >
          {/* Judul halaman */}
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-2xl sm:text-3xl text-[#133354] font-semibold">
              {title}
            </h1>

            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>

          {/* Konten halaman */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainWrapper;
