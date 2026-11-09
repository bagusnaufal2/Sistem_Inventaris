import { useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import { formatRupiah, pesanError } from "../../utils/format";

const Laporan = () => {
  const [statistik, setStatistik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/laporan/statistik")
      .then((res) => {
        if (!cancelled) setStatistik(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(pesanError(err, "Gagal memuat statistik."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ringkasan = statistik?.ringkasan || {};
  const cards = [
    { title: "Total Inventaris", value: String(ringkasan.totalInventaris ?? 0), description: "Seluruh barang terdaftar" },
    { title: "Kondisi Baik", value: String(ringkasan.inventarisBaik ?? 0), description: "Barang dalam kondisi baik" },
    { title: "Barang Rusak", value: String(ringkasan.inventarisRusak ?? 0), description: "Barang perlu diperiksa" },
    { title: "Dalam Perbaikan", value: String(ringkasan.dalamPerbaikan ?? 0), description: "Barang sedang diperbaiki" },
  ];

  return (
    <MainWrapper
      title="Laporan & Statistik"
      description="Ringkasan statistik inventaris dan tren laporan kerusakan SMPIT At-Taufiq."
    >
      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Memuat statistik...</p>
      ) : (
        <>
          {/* Kartu ringkasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cards.map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-[#166143] mt-3">{card.value}</h3>
                <p className="text-xs text-gray-400 mt-4">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            <span>Laporan menunggu: <strong className="text-[#163A5F]">{ringkasan.laporanMenunggu ?? 0}</strong></span>
            <span>Perbaikan berlangsung: <strong className="text-[#163A5F]">{ringkasan.perbaikanBerlangsung ?? 0}</strong></span>
            <span>Total biaya perbaikan: <strong className="text-[#163A5F]">{formatRupiah(ringkasan.totalBiayaPerbaikan ?? 0)}</strong></span>
          </div>

          {/* Grafik */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-[#163A5F]">Jumlah Barang per Kategori</h2>
              <p className="text-sm text-gray-500 mt-1">Distribusi inventaris berdasarkan kategori barang.</p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistik?.perKategori || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="kategori" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="jumlah" fill="#23845B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-[#163A5F]">Tren Laporan Kerusakan</h2>
              <p className="text-sm text-gray-500 mt-1">Jumlah laporan kerusakan per bulan (6 bulan terakhir).</p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statistik?.tren || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="laporan" stroke="#2878B5" strokeWidth={2} dot={{ fill: "#2878B5" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </MainWrapper>
  );
};

export default Laporan;
