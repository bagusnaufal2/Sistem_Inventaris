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

// DATA CONTOH — belum ada API backend untuk modul ini
const barangPerKategori = [
  { kategori: "Elektronik", jumlah: 86 },
  { kategori: "Furnitur", jumlah: 124 },
  { kategori: "Buku", jumlah: 210 },
  { kategori: "Alat Tulis", jumlah: 58 },
  { kategori: "Olahraga", jumlah: 34 },
];

const trenLaporan = [
  { bulan: "Jun", laporan: 4 },
  { bulan: "Jul", laporan: 7 },
  { bulan: "Agu", laporan: 5 },
  { bulan: "Sep", laporan: 9 },
  { bulan: "Okt", laporan: 6 },
  { bulan: "Nov", laporan: 8 },
];

// DATA CONTOH — belum ada API backend untuk modul ini
const ringkasanContoh = [
  { title: "Total Inventaris", value: "512", description: "Seluruh barang terdaftar" },
  { title: "Kondisi Baik", value: "468", description: "Barang dalam kondisi baik" },
  { title: "Barang Rusak", value: "21", description: "Barang perlu diperiksa" },
  { title: "Dalam Perbaikan", value: "23", description: "Barang sedang diperbaiki" },
];

const Laporan = () => {
  return (
    <MainWrapper
      title="Laporan & Statistik"
      description="Ringkasan statistik inventaris dan tren laporan kerusakan SMPIT At-Taufiq."
    >
      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {ringkasanContoh.map((card) => (
          <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{card.title}</p>
            <h3 className="text-3xl font-bold text-[#166143] mt-3">{card.value}</h3>
            <p className="text-xs text-gray-400 mt-4">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-[#163A5F]">Jumlah Barang per Kategori</h2>
          <p className="text-sm text-gray-500 mt-1">Distribusi inventaris berdasarkan kategori barang.</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barangPerKategori}>
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
          <p className="text-sm text-gray-500 mt-1">Jumlah laporan kerusakan per bulan (Jun–Nov 2026).</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trenLaporan}>
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
    </MainWrapper>
  );
};

export default Laporan;
