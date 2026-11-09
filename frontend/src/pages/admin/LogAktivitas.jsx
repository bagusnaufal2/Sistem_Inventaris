import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const logContoh = [
  { id: 1, waktu: "09 Nov 2026, 08:15", pengguna: "Ahmad Fauzi", aksi: "Login", detail: "Admin masuk ke sistem dari perangkat kantor." },
  { id: 2, waktu: "09 Nov 2026, 08:32", pengguna: "Rina Wulandari", aksi: "Lapor Kerusakan", detail: "Melaporkan kerusakan Kipas Angin Standing (KR-008)." },
  { id: 3, waktu: "09 Nov 2026, 09:05", pengguna: "Dedi Kurniawan", aksi: "Mulai Perbaikan", detail: "Memulai perbaikan Kipas Angin Standing." },
  { id: 4, waktu: "08 Nov 2026, 13:40", pengguna: "Ahmad Fauzi", aksi: "Tambah Barang", detail: "Menambahkan 10 unit Buku Paket Matematika Kelas 8." },
  { id: 5, waktu: "08 Nov 2026, 15:12", pengguna: "Rizky Pratama", aksi: "Selesaikan Perbaikan", detail: "Perbaikan Papan Tulis Whiteboard selesai." },
  { id: 6, waktu: "07 Nov 2026, 10:20", pengguna: "Siti Aminah", aksi: "Lapor Kerusakan", detail: "Melaporkan kerusakan Proyektor Epson EB-X05 (KR-004)." },
  { id: 7, waktu: "07 Nov 2026, 11:00", pengguna: "Ahmad Fauzi", aksi: "Ubah Pengguna", detail: "Mengubah role Ratna Dewi menjadi Nonaktif." },
  { id: 8, waktu: "06 Nov 2026, 14:25", pengguna: "Maya Lestari", aksi: "Lapor Kerusakan", detail: "Melaporkan kerusakan Speaker Portable JBL (KR-005)." },
  { id: 9, waktu: "06 Nov 2026, 16:45", pengguna: "Dedi Kurniawan", aksi: "Selesaikan Perbaikan", detail: "Perbaikan Speaker Portable JBL selesai." },
  { id: 10, waktu: "05 Nov 2026, 09:30", pengguna: "Ahmad Fauzi", aksi: "Logout", detail: "Admin keluar dari sistem." },
];

const LogAktivitas = () => {
  return (
    <MainWrapper
      title="Log Aktivitas"
      description="Riwayat aktivitas seluruh pengguna dalam sistem inventaris."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#163A5F]">
                <th className="px-5 py-3 font-semibold">Waktu</th>
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
                <th className="px-5 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {logContoh.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{log.waktu}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{log.pengguna}</td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCEEFF] text-[#2878B5]">
                      {log.aksi}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};

export default LogAktivitas;
