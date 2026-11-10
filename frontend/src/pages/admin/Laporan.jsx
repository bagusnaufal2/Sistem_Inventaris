import { useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import {
  BarChart,
  Bar,
  Cell,
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
  // Batang tertinggi memakai biru utama Figma (#2975B2), sisanya biru muda (#ADD1ED).
  const perKategori = statistik?.perKategori || [];
  const jumlahTerbesar = Math.max(0, ...perKategori.map((d) => d.jumlah ?? 0));
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
              <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-[#EAEEF4]">
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-[#133354] mt-3">{card.value}</h3>
                <p className="text-xs text-gray-400 mt-4">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#EAEEF4] flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            <span>Laporan menunggu: <strong className="text-[#133354]">{ringkasan.laporanMenunggu ?? 0}</strong></span>
            <span>Perbaikan berlangsung: <strong className="text-[#133354]">{ringkasan.perbaikanBerlangsung ?? 0}</strong></span>
            <span>Total biaya perbaikan: <strong className="text-[#133354]">{formatRupiah(ringkasan.totalBiayaPerbaikan ?? 0)}</strong></span>
          </div>

          {/* Grafik */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] p-5">
              <h2 className="text-lg font-semibold text-[#133354]">Jumlah Barang per Kategori</h2>
              <p className="text-sm text-gray-500 mt-1">Distribusi inventaris berdasarkan kategori barang.</p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistik?.perKategori || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="kategori" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                      {perKategori.map((d) => (
                        <Cell
                          key={d.kategori}
                          fill={d.jumlah === jumlahTerbesar && jumlahTerbesar > 0 ? "#2975B2" : "#ADD1ED"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] p-5">
              <h2 className="text-lg font-semibold text-[#133354]">Tren Laporan Kerusakan</h2>
              <p className="text-sm text-gray-500 mt-1">Jumlah laporan kerusakan per bulan (6 bulan terakhir).</p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statistik?.tren || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="laporan" stroke="#2975B2" strokeWidth={2} dot={{ fill: "#2975B2" }} />
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
