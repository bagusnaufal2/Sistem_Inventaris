import { useCallback, useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { pesanError } from "../../utils/format";

const formAwal = { nama: "", deskripsi: "" };

const Kategori = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatKategori = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/kategori", { params: { limit: 100, q: q || undefined } });
      setKategori(res.data.data || []);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat data kategori."));
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    muatKategori();
  }, [muatKategori]);

  const bukaTambah = () => {
    setEditId(null);
    setForm(formAwal);
    setModalTerbuka(true);
  };

  const bukaUbah = (item) => {
    setEditId(item.id);
    setForm({ nama: item.nama, deskripsi: item.deskripsi || "" });
    setModalTerbuka(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    try {
      if (editId) {
        await api.put(`/kategori/${editId}`, form);
        setPesan("Kategori berhasil diubah.");
      } else {
        await api.post("/kategori", form);
        setPesan("Kategori berhasil ditambahkan.");
      }
      setModalTerbuka(false);
      muatKategori();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menyimpan kategori."));
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus kategori "${item.nama}"?`)) return;
    try {
      await api.delete(`/kategori/${item.id}`);
      setPesan("Kategori berhasil dihapus.");
      muatKategori();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus kategori."));
    }
  };

  return (
    <MainWrapper
      title="Kategori Barang"
      description="Daftar kategori barang inventaris beserta deskripsi dan jumlah barangnya."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Cari kategori..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#23845B]"
        />
        <div className="flex justify-end">
          <button onClick={bukaTambah} className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Tambah Kategori
          </button>
        </div>
      </div>

      {pesan && (
        <div className="bg-[#DCFCE7] text-[#16A34A] text-sm font-medium px-4 py-3 rounded-lg">
          {pesan}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-lg">
          {error}{" "}
          <button onClick={muatKategori} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Memuat data...</p>
      ) : kategori.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Belum ada kategori.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {kategori.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-[#163A5F]">{item.nama}</h2>
                <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  {item.jumlahBarang} barang
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{item.deskripsi || "-"}</p>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => bukaUbah(item)} className="text-[#2878B5] hover:underline text-xs font-semibold">Ubah</button>
                <button onClick={() => hapus(item)} className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalTerbuka && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-[#163A5F]">{editId ? "Ubah Kategori" : "Tambah Kategori"}</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kategori</label>
                <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" placeholder="Contoh: Elektronik" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModalTerbuka(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">Batal</button>
                <button type="submit" disabled={menyimpan} className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
                  {menyimpan ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainWrapper>
  );
};

export default Kategori;
