import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const barangContoh = [
  { id: 1, nama: "Laptop ASUS VivoBook 14", kategori: "Elektronik", lokasi: "Lab Komputer", kondisi: "Baik", status: "Tersedia" },
  { id: 2, nama: "Proyektor Epson EB-X05", kategori: "Elektronik", lokasi: "Ruang Kelas 7A", kondisi: "Baik", status: "Dipinjam" },
  { id: 3, nama: "Meja Guru Kayu Jati", kategori: "Furnitur", lokasi: "Ruang Kelas 8B", kondisi: "Baik", status: "Tersedia" },
  { id: 4, nama: "Kursi Siswa Plastik", kategori: "Furnitur", lokasi: "Ruang Kelas 9C", kondisi: "Rusak Ringan", status: "Dalam Perbaikan" },
  { id: 5, nama: "Printer Canon PIXMA G2010", kategori: "Elektronik", lokasi: "Ruang TU", kondisi: "Rusak", status: "Dalam Perbaikan" },
  { id: 6, nama: "Papan Tulis Whiteboard 240cm", kategori: "Alat Tulis", lokasi: "Ruang Kelas 7B", kondisi: "Baik", status: "Tersedia" },
  { id: 7, nama: "AC Daikin 1 PK", kategori: "Elektronik", lokasi: "Ruang Guru", kondisi: "Baik", status: "Tersedia" },
  { id: 8, nama: "Lemari Arsip Besi 4 Pintu", kategori: "Furnitur", lokasi: "Ruang TU", kondisi: "Baik", status: "Tersedia" },
  { id: 9, nama: "Speaker Portable JBL", kategori: "Elektronik", lokasi: "Aula", kondisi: "Rusak Ringan", status: "Tersedia" },
  { id: 10, nama: "Buku Paket Matematika Kelas 8", kategori: "Buku", lokasi: "Perpustakaan", kondisi: "Baik", status: "Tersedia" },
];

const badgeKondisi = (kondisi) => {
  if (kondisi === "Baik") return "bg-[#DCFCE7] text-[#16A34A]";
  if (kondisi === "Rusak Ringan") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const badgeStatus = (status) => {
  if (status === "Tersedia") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Dipinjam") return "bg-[#DCEEFF] text-[#2878B5]";
  return "bg-amber-100 text-amber-700";
};

const Inventaris = () => {
  return (
    <MainWrapper
      title="Data Inventaris"
      description="Daftar seluruh barang inventaris SMPIT At-Taufiq beserta kondisi dan statusnya."
    >
      <div className="flex justify-end">
        <button className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          + Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#163A5F]">
                <th className="px-5 py-3 font-semibold">Nama Barang</th>
                <th className="px-5 py-3 font-semibold">Kategori</th>
                <th className="px-5 py-3 font-semibold">Lokasi</th>
                <th className="px-5 py-3 font-semibold">Kondisi</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barangContoh.map((barang) => (
                <tr key={barang.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{barang.nama}</td>
                  <td className="px-5 py-3 text-gray-600">{barang.kategori}</td>
                  <td className="px-5 py-3 text-gray-600">{barang.lokasi}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeKondisi(barang.kondisi)}`}>
                      {barang.kondisi}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStatus(barang.status)}`}>
                      {barang.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button className="text-[#2878B5] hover:underline text-xs font-semibold">Ubah</button>
                      <button className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
                    </div>
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

export default Inventaris;
