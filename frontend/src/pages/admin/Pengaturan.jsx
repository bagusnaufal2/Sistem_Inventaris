import { useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
// Nilai awal form adalah data contoh; penyimpanan hanya ke state lokal.
const Pengaturan = () => {
  const [form, setForm] = useState({
    namaSekolah: "SMPIT At-Taufiq",
    emailAdmin: "admin@at-taufiq.sch.id",
    tahunAjaran: "2026/2027",
    zonaWaktu: "Asia/Jakarta",
  });
  const [tersimpan, setTersimpan] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTersimpan(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Belum ada API backend untuk pengaturan — simpan hanya ke state lokal.
    setTersimpan(true);
  };

  return (
    <MainWrapper
      title="Pengaturan"
      description="Pengaturan umum Sistem Inventaris SMPIT At-Taufiq."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-[#163A5F]">Pengaturan Umum</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ubah informasi dasar sekolah dan sistem di bawah ini.
        </p>

        {tersimpan && (
          <div className="mt-4 bg-[#DCFCE7] text-[#16A34A] text-sm font-medium px-4 py-3 rounded-lg">
            Pengaturan berhasil disimpan.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <div>
            <label htmlFor="namaSekolah" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nama Sekolah
            </label>
            <input
              id="namaSekolah"
              name="namaSekolah"
              type="text"
              value={form.namaSekolah}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]"
            />
          </div>

          <div>
            <label htmlFor="emailAdmin" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Admin
            </label>
            <input
              id="emailAdmin"
              name="emailAdmin"
              type="email"
              value={form.emailAdmin}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]"
            />
          </div>

          <div>
            <label htmlFor="tahunAjaran" className="block text-sm font-medium text-gray-700 mb-1.5">
              Tahun Ajaran
            </label>
            <input
              id="tahunAjaran"
              name="tahunAjaran"
              type="text"
              value={form.tahunAjaran}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]"
            />
          </div>

          <div>
            <label htmlFor="zonaWaktu" className="block text-sm font-medium text-gray-700 mb-1.5">
              Zona Waktu
            </label>
            <select
              id="zonaWaktu"
              name="zonaWaktu"
              value={form.zonaWaktu}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#23845B]"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </MainWrapper>
  );
};

export default Pengaturan;
