import { useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { formatTanggalWaktu } from "../../utils/format";

const Dashboard = () => {
  const { user } = useAuth();

  // Angka awal 0; diisi dari GET /api/dashboard/admin saat mount.
  // Bila API gagal (mis. backend tidak jalan), angka tetap 0 dan halaman tidak crash.
  const [stats, setStats] = useState({
    totalInventaris: 0,
    inventarisBaik: 0,
    inventarisRusak: 0,
    laporanKerusakan: 0,
  });
  const [aktivitas, setAktivitas] = useState([]);
  const [aktivitasGagal, setAktivitasGagal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/dashboard/admin")
      .then((response) => {
        if (cancelled) return;
        const dashboard =
          response?.data?.data?.dashboard || response?.data?.dashboard || {};
        setStats({
          totalInventaris: dashboard.totalInventaris ?? 0,
          inventarisBaik: dashboard.inventarisBaik ?? 0,
          inventarisRusak: dashboard.inventarisRusak ?? 0,
          laporanKerusakan: dashboard.laporanKerusakan ?? 0,
        });
      })
      .catch(() => {
        // Fallback: biarkan angka 0 yang sudah ada.
      });

    api
      .get("/log-aktivitas", { params: { limit: 5 } })
      .then((response) => {
        if (cancelled) return;
        setAktivitas(response?.data?.data || []);
      })
      .catch(() => {
        if (!cancelled) setAktivitasGagal(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = [
    {
      title: "Total Inventaris",
      value: String(stats.totalInventaris),
      description: "Seluruh barang terdaftar",
      icon: "📦",
      color: "bg-[#E6F2FF]",
      iconColor: "text-[#2975B2]",
    },
    {
      title: "Kondisi Baik",
      value: String(stats.inventarisBaik),
      description: "Barang dalam kondisi baik",
      icon: "✓",
      color: "bg-[#E3F5EB]",
      iconColor: "text-[#219461]",
    },
    {
      title: "Barang Rusak",
      value: String(stats.inventarisRusak),
      description: "Barang perlu diperiksa",
      icon: "⚠",
      color: "bg-[#FCE8E8]",
      iconColor: "text-[#C74040]",
    },
    {
      title: "Laporan Menunggu",
      value: String(stats.laporanKerusakan),
      description: "Laporan belum ditangani",
      icon: "◷",
      color: "bg-[#FFF2DE]",
      iconColor: "text-[#E07A1F]",
    },
  ];

  return (
    <MainWrapper
      title="Dashboard Admin"
      description="Selamat datang di Sistem Inventaris dan Pelaporan Sarana SMPIT At-Taufiq."
    >
      {/* Welcome */}
      <div className="bg-[linear-gradient(90deg,#1B4A76,#1F598A,#23689E)] rounded-xl p-6 text-white">
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
            className="bg-white rounded-xl p-5 shadow-sm border border-[#EAEEF4]"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold text-[#133354] mt-3">
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
      <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4]">
        <div className="p-5 border-b border-[#EAEEF4]">
          <h2 className="text-lg font-semibold text-[#133354]">
            Aktivitas Terbaru
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Riwayat aktivitas yang terjadi dalam sistem.
          </p>
        </div>

        {aktivitasGagal || aktivitas.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">📋</div>

            <h3 className="text-gray-700 font-medium">
              Belum Ada Aktivitas
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Aktivitas sistem akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EAEEF4]">
            {aktivitas.map((item) => (
              <li key={item.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="inline-block self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F2FF] text-[#2975B2] whitespace-nowrap">
                  {item.aksi}
                </span>
                <span className="text-sm text-gray-700 flex-1">{item.detail}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {item.pengguna} • {formatTanggalWaktu(item.waktu)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainWrapper>
  );
};

export default Dashboard;
