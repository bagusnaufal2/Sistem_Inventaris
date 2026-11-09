import Sidebar from "../navigation/Sidebar";
import { useNavigate } from "react-router-dom";

const MainWrapper = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#F5F7FA]">
      <Sidebar />

      <main
        className="flex-1 min-w-0 h-screen overflow-y-auto flex flex-col gap-[25px]"
        style={{
          padding: window.innerWidth <= 660 ? "30px 14px" : "40px",
        }}
      >
        {/* Header halaman */}
        <div className="flex flex-col w-full gap-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-[#163A5F] hover:text-[#2878B5] text-2xl"
              aria-label="Kembali"
            >
              ←
            </button>

            <h1 className="text-2xl sm:text-3xl text-[#163A5F] font-semibold">
              {title}
            </h1>
          </div>

          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>

        {/* Konten halaman */}
        {children}
      </main>
    </div>
  );
};

export default MainWrapper;
