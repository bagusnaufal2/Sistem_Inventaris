import MainWrapper from "../../components/layout/MainWrapper";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const summaryCards = [
    {
      title: "Total Inventaris",
      value: "0",
      description: "Seluruh barang terdaftar",
      icon: "📦",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Kondisi Baik",
      value: "0",
      description: "Barang dalam kondisi baik",
      icon: "✓",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Barang Rusak",
      value: "0",
      description: "Barang perlu diperiksa",
      icon: "⚠",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Laporan Menunggu",
      value: "0",
      description: "Laporan belum ditangani",
      icon: "◷",
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <MainWrapper
      title="Dashboard Admin"
      description="Selamat datang di Sistem Inventaris dan Pelaporan Sarana SMPIT At-Taufiq."
    >
      {/* Welcome */}
      <div className="bg-[#143F66] rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold">
          Selamat Datang, {user?.name || "Admin"}!
        </h2>
        <p className="text-sm text-blue-100 mt-2">
          Berikut adalah ringkasan informasi inventaris dan fasilitas sekolah.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold text-[#143F66] mt-3">
                  {card.value}
                </h3>
              </div>

              <div
                className={`${card.color} ${card.iconColor} w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold`}
              >
                {card.icon}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#143F66]">
            Aktivitas Terbaru
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Riwayat aktivitas yang terjadi dalam sistem.
          </p>
        </div>

        <div className="p-8 text-center">
          <div className="text-4xl mb-3">📋</div>

          <h3 className="text-gray-700 font-medium">
            Belum Ada Aktivitas
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            Aktivitas sistem akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Dashboard;
