import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const kategoriContoh = [
  { id: 1, nama: "Elektronik", deskripsi: "Perangkat elektronik seperti laptop, proyektor, printer, dan AC.", jumlahBarang: 86 },
  { id: 2, nama: "Furnitur", deskripsi: "Perabot sekolah seperti meja, kursi, lemari, dan rak.", jumlahBarang: 124 },
  { id: 3, nama: "Buku", deskripsi: "Buku paket, buku referensi, dan koleksi perpustakaan.", jumlahBarang: 210 },
  { id: 4, nama: "Alat Tulis", deskripsi: "Papan tulis, spidol, dan perlengkapan tulis kelas.", jumlahBarang: 58 },
  { id: 5, nama: "Olahraga", deskripsi: "Peralatan olahraga seperti bola, raket, dan matras.", jumlahBarang: 34 },
  { id: 6, nama: "Laboratorium", deskripsi: "Alat praktikum IPA seperti mikroskop dan tabung reaksi.", jumlahBarang: 47 },
];

const Kategori = () => {
  return (
    <MainWrapper
      title="Kategori Barang"
      description="Daftar kategori barang inventaris beserta deskripsi dan jumlah barangnya."
    >
      <div className="flex justify-end">
        <button className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          + Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {kategoriContoh.map((kategori) => (
          <div key={kategori.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#163A5F]">{kategori.nama}</h2>
              <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                {kategori.jumlahBarang} barang
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{kategori.deskripsi}</p>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button className="text-[#2878B5] hover:underline text-xs font-semibold">Ubah</button>
              <button className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </MainWrapper>
  );
};

export default Kategori;
