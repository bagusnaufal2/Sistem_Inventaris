import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const ruanganContoh = [
  { id: 1, nama: "Ruang Kelas 7A", gedung: "Gedung A — Lantai 1", jumlahBarang: 28, penanggungJawab: "Bu Siti Aminah" },
  { id: 2, nama: "Ruang Kelas 7B", gedung: "Gedung A — Lantai 1", jumlahBarang: 26, penanggungJawab: "Pak Budi Santoso" },
  { id: 3, nama: "Ruang Kelas 8A", gedung: "Gedung A — Lantai 2", jumlahBarang: 30, penanggungJawab: "Bu Ratna Dewi" },
  { id: 4, nama: "Ruang Kelas 8B", gedung: "Gedung A — Lantai 2", jumlahBarang: 27, penanggungJawab: "Pak Andi Wijaya" },
  { id: 5, nama: "Ruang Kelas 9A", gedung: "Gedung B — Lantai 1", jumlahBarang: 29, penanggungJawab: "Bu Maya Lestari" },
  { id: 6, nama: "Lab Komputer", gedung: "Gedung B — Lantai 2", jumlahBarang: 42, penanggungJawab: "Pak Dedi Kurniawan" },
  { id: 7, nama: "Perpustakaan", gedung: "Gedung B — Lantai 1", jumlahBarang: 65, penanggungJawab: "Bu Lina Marlina" },
  { id: 8, nama: "Ruang Guru", gedung: "Gedung A — Lantai 1", jumlahBarang: 34, penanggungJawab: "Pak Ahmad Fauzi" },
  { id: 9, nama: "Ruang TU", gedung: "Gedung A — Lantai 1", jumlahBarang: 22, penanggungJawab: "Bu Rina Wulandari" },
  { id: 10, nama: "Aula", gedung: "Gedung C — Lantai 1", jumlahBarang: 18, penanggungJawab: "Pak Rizky Pratama" },
];

const Lokasi = () => {
  return (
    <MainWrapper
      title="Lokasi & Ruangan"
      description="Daftar ruangan di SMPIT At-Taufiq beserta jumlah barang dan penanggung jawabnya."
    >
      <div className="flex justify-end">
        <button className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          + Tambah Ruangan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {ruanganContoh.map((ruangan) => (
          <div key={ruangan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#163A5F]">{ruangan.nama}</h2>
            <p className="text-sm text-gray-500 mt-1">{ruangan.gedung}</p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Jumlah Barang</p>
                <p className="text-2xl font-bold text-[#166143] mt-1">{ruangan.jumlahBarang}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Penanggung Jawab</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{ruangan.penanggungJawab}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="text-[#2878B5] hover:underline text-xs font-semibold">Lihat Barang</button>
              <button className="text-[#2878B5] hover:underline text-xs font-semibold">Ubah</button>
            </div>
          </div>
        ))}
      </div>
    </MainWrapper>
  );
};

export default Lokasi;
