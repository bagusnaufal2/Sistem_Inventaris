import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { pesanError } from "../../utils/format";

const formAwal = { nama: "", gedung: "", penanggungJawab: "" };

const Lokasi = () => {
  const navigate = useNavigate();
  const [ruangan, setRuangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatLokasi = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/lokasi", { params: { limit: 100, q: q || undefined } });
      setRuangan(res.data.data || []);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat data ruangan."));
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    muatLokasi();
  }, [muatLokasi]);

  const bukaTambah = () => {
    setEditId(null);
    setForm(formAwal);
    setModalTerbuka(true);
  };

  const bukaUbah = (item) => {
    setEditId(item.id);
    setForm({ nama: item.nama, gedung: item.gedung || "", penanggungJawab: item.penanggungJawab || "" });
    setModalTerbuka(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    try {
      if (editId) {
        await api.put(`/lokasi/${editId}`, form);
        setPesan("Ruangan berhasil diubah.");
      } else {
        await api.post("/lokasi", form);
        setPesan("Ruangan berhasil ditambahkan.");
      }
      setModalTerbuka(false);
      muatLokasi();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menyimpan ruangan."));
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus ruangan "${item.nama}"?`)) return;
    try {
      await api.delete(`/lokasi/${item.id}`);
      setPesan("Ruangan berhasil dihapus.");
      muatLokasi();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus ruangan."));
    }
  };

  return (
    <MainWrapper
      title="Lokasi & Ruangan"
      description="Daftar ruangan di SMPIT At-Taufiq beserta jumlah barang dan penanggung jawabnya."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Cari ruangan..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
        />
        <div className="flex justify-end">
          <button onClick={bukaTambah} className="bg-[#2975B2] hover:bg-[#1F598A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Tambah Ruangan
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
          <button onClick={muatLokasi} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Memuat data...</p>
      ) : ruangan.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Belum ada ruangan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {ruangan.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] p-5">
              <h2 className="text-lg font-semibold text-[#133354]">{item.nama}</h2>
              <p className="text-sm text-gray-500 mt-1">{item.gedung || "-"}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EAEEF4]">
                <div>
                  <p className="text-xs text-gray-400">Jumlah Barang</p>
                  <p className="text-2xl font-bold text-[#133354] mt-1">{item.jumlahBarang}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Penanggung Jawab</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{item.penanggungJawab || "-"}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate(`/admin/inventaris?lokasiId=${item.id}`)} className="text-[#2975B2] hover:underline text-xs font-semibold">Lihat Barang</button>
                <button onClick={() => bukaUbah(item)} className="text-[#2975B2] hover:underline text-xs font-semibold">Ubah</button>
                <button onClick={() => hapus(item)} className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalTerbuka && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-[#133354]">{editId ? "Ubah Ruangan" : "Tambah Ruangan"}</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Ruangan</label>
                <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Ruang Kelas 7A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gedung</label>
                <input value={form.gedung} onChange={(e) => setForm({ ...form, gedung: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Gedung A — Lantai 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Penanggung Jawab</label>
                <input value={form.penanggungJawab} onChange={(e) => setForm({ ...form, penanggungJawab: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Bu Siti Aminah" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModalTerbuka(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">Batal</button>
                <button type="submit" disabled={menyimpan} className="bg-[#2975B2] hover:bg-[#1F598A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
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

export default Lokasi;
