import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const laporanContoh = [
  { id: "KR-001", barang: "Printer Canon PIXMA G2010", pelapor: "Bu Rina Wulandari", tanggal: "03 Nov 2026", deskripsi: "Printer tidak bisa menarik kertas, lampu indikator berkedip.", status: "Menunggu" },
  { id: "KR-002", barang: "Kursi Siswa Plastik", pelapor: "Pak Andi Wijaya", tanggal: "04 Nov 2026", deskripsi: "Kaki kursi patah, tidak bisa dipakai duduk.", status: "Diproses" },
  { id: "KR-003", barang: "AC Daikin 1 PK", pelapor: "Pak Ahmad Fauzi", tanggal: "05 Nov 2026", deskripsi: "AC tidak dingin, hanya keluar angin biasa.", status: "Diproses" },
  { id: "KR-004", barang: "Proyektor Epson EB-X05", pelapor: "Bu Siti Aminah", tanggal: "06 Nov 2026", deskripsi: "Gambar proyektor buram dan sering mati sendiri.", status: "Menunggu" },
  { id: "KR-005", barang: "Speaker Portable JBL", pelapor: "Pak Rizky Pratama", tanggal: "06 Nov 2026", deskripsi: "Suara speaker kresek-kresek saat volume besar.", status: "Selesai" },
  { id: "KR-006", barang: "Laptop ASUS VivoBook 14", pelapor: "Pak Dedi Kurniawan", tanggal: "07 Nov 2026", deskripsi: "Baterai laptop cepat habis, hanya bertahan 20 menit.", status: "Menunggu" },
  { id: "KR-007", barang: "Papan Tulis Whiteboard", pelapor: "Bu Ratna Dewi", tanggal: "08 Nov 2026", deskripsi: "Permukaan whiteboard sulit dihapus, bekas spidol menempel.", status: "Selesai" },
  { id: "KR-008", barang: "Kipas Angin Standing", pelapor: "Bu Maya Lestari", tanggal: "09 Nov 2026", deskripsi: "Kipas berbunyi keras dan putaran tidak stabil.", status: "Diproses" },
];

const badgeStatus = (status) => {
  if (status === "Selesai") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Diproses") return "bg-[#DCEEFF] text-[#2878B5]";
  return "bg-amber-100 text-amber-700";
};

const Kerusakan = () => {
  return (
    <MainWrapper
      title="Laporan Kerusakan"
      description="Daftar laporan kerusakan barang yang dilaporkan oleh guru dan staf sekolah."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#163A5F]">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Barang</th>
                <th className="px-5 py-3 font-semibold">Pelapor</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Deskripsi</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {laporanContoh.map((laporan) => (
                <tr key={laporan.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-[#2878B5]">{laporan.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{laporan.barang}</td>
                  <td className="px-5 py-3 text-gray-600">{laporan.pelapor}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{laporan.tanggal}</td>
                  <td className="px-5 py-3 text-gray-600 max-w-xs">{laporan.deskripsi}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStatus(laporan.status)}`}>
                      {laporan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Kerusakan;
