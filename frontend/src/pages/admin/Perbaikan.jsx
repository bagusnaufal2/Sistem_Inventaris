import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const perbaikanContoh = [
  { id: 1, barang: "Printer Canon PIXMA G2010", teknisi: "Pak Dedi Kurniawan", tanggalMulai: "04 Nov 2026", estimasiSelesai: "06 Nov 2026", status: "Berlangsung", biaya: "Rp150.000" },
  { id: 2, barang: "Kursi Siswa Plastik", teknisi: "Pak Rizky Pratama", tanggalMulai: "05 Nov 2026", estimasiSelesai: "07 Nov 2026", status: "Berlangsung", biaya: "Rp75.000" },
  { id: 3, barang: "AC Daikin 1 PK", teknisi: "Teknisi AC — CV Sejuk Mandiri", tanggalMulai: "06 Nov 2026", estimasiSelesai: "08 Nov 2026", status: "Berlangsung", biaya: "Rp350.000" },
  { id: 4, barang: "Speaker Portable JBL", teknisi: "Pak Dedi Kurniawan", tanggalMulai: "06 Nov 2026", estimasiSelesai: "07 Nov 2026", status: "Selesai", biaya: "Rp120.000" },
  { id: 5, barang: "Papan Tulis Whiteboard", teknisi: "Pak Rizky Pratama", tanggalMulai: "08 Nov 2026", estimasiSelesai: "09 Nov 2026", status: "Selesai", biaya: "Rp50.000" },
  { id: 6, barang: "Kipas Angin Standing", teknisi: "Pak Dedi Kurniawan", tanggalMulai: "09 Nov 2026", estimasiSelesai: "11 Nov 2026", status: "Menunggu Suku Cadang", biaya: "Rp100.000" },
  { id: 7, barang: "Proyektor Epson EB-X05", teknisi: "Teknisi Epson — PT Citra Prima", tanggalMulai: "07 Nov 2026", estimasiSelesai: "12 Nov 2026", status: "Berlangsung", biaya: "Rp450.000" },
  { id: 8, barang: "Meja Guru Kayu Jati", teknisi: "Pak Rizky Pratama", tanggalMulai: "02 Nov 2026", estimasiSelesai: "04 Nov 2026", status: "Selesai", biaya: "Rp200.000" },
];

const badgeStatus = (status) => {
  if (status === "Selesai") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Menunggu Suku Cadang") return "bg-amber-100 text-amber-700";
  return "bg-[#DCEEFF] text-[#2878B5]";
};

const Perbaikan = () => {
  return (
    <MainWrapper
      title="Manajemen Perbaikan"
      description="Daftar perbaikan barang yang sedang dan sudah dikerjakan beserta teknisi dan biayanya."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#163A5F]">
                <th className="px-5 py-3 font-semibold">Barang</th>
                <th className="px-5 py-3 font-semibold">Teknisi / Petugas</th>
                <th className="px-5 py-3 font-semibold">Tanggal Mulai</th>
                <th className="px-5 py-3 font-semibold">Estimasi Selesai</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Biaya</th>
              </tr>
            </thead>
            <tbody>
              {perbaikanContoh.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{item.barang}</td>
                  <td className="px-5 py-3 text-gray-600">{item.teknisi}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{item.tanggalMulai}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{item.estimasiSelesai}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStatus(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium whitespace-nowrap">{item.biaya}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Perbaikan;
