import { useCallback, useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { formatRupiah, formatTanggal, parseRupiah, pesanError } from "../../utils/format";

const badgeStatus = (status) => {
  if (status === "Selesai") return "bg-[#DCFCE7] text-[#16A34A]";
  // Berlangsung / Menunggu Suku Cadang — oranye Figma
  return "bg-[#FFF2DE] text-[#B45309]";
};

const formAwal = {
  barang: "",
  teknisi: "",
  tanggalMulai: "",
  estimasiSelesai: "",
  status: "Berlangsung",
  biaya: "",
};

const Perbaikan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/perbaikan", {
        params: { page, limit: 10, q: q || undefined, status: filterStatus || undefined },
      });
      setData(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat data perbaikan."));
    } finally {
      setLoading(false);
    }
  }, [page, q, filterStatus]);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const bukaTambah = () => {
    setEditId(null);
    setForm(formAwal);
    setModalTerbuka(true);
  };

  const bukaUbah = (item) => {
    setEditId(item.id);
    setForm({
      barang: item.barang,
      teknisi: item.teknisi,
      tanggalMulai: item.tanggalMulai || "",
      estimasiSelesai: item.estimasiSelesai || "",
      status: item.status,
      biaya: String(item.biaya ?? 0),
    });
    setModalTerbuka(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    const payload = { ...form, biaya: parseRupiah(form.biaya) };
    try {
      if (editId) {
        await api.put(`/perbaikan/${editId}`, payload);
        setPesan("Data perbaikan berhasil diubah.");
      } else {
        await api.post("/perbaikan", payload);
        setPesan("Data perbaikan berhasil ditambahkan.");
      }
      setModalTerbuka(false);
      muatData();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menyimpan data perbaikan."));
    } finally {
      setMenyimpan(false);
    }
  };

  const ubahStatus = async (item, statusBaru) => {
    try {
      await api.patch(`/perbaikan/${item.id}/status`, { status: statusBaru });
      setPesan(`Status perbaikan ${item.barang} diubah menjadi ${statusBaru}.`);
      muatData();
    } catch (err) {
      setPesan(pesanError(err, "Gagal mengubah status perbaikan."));
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus data perbaikan "${item.barang}"?`)) return;
    try {
      await api.delete(`/perbaikan/${item.id}`);
      setPesan("Data perbaikan berhasil dihapus.");
      muatData();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus data perbaikan."));
    }
  };

  return (
    <MainWrapper
      title="Manajemen Perbaikan"
      description="Daftar perbaikan barang yang sedang dan sudah dikerjakan beserta teknisi dan biayanya."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari barang / teknisi..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
          />
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
            <option value="">Semua Status</option>
            <option value="Berlangsung">Berlangsung</option>
            <option value="Selesai">Selesai</option>
            <option value="Menunggu Suku Cadang">Menunggu Suku Cadang</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={bukaTambah} className="bg-[#2975B2] hover:bg-[#1F598A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Tambah Perbaikan
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
          <button onClick={muatData} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F8FB] text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Barang</th>
                <th className="px-5 py-3 font-semibold">Teknisi / Petugas</th>
                <th className="px-5 py-3 font-semibold">Tanggal Mulai</th>
                <th className="px-5 py-3 font-semibold">Estimasi Selesai</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Biaya</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Belum ada data perbaikan.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-t border-[#EAEEF4] hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{item.barang}</td>
                    <td className="px-5 py-3 text-gray-600">{item.teknisi}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(item.tanggalMulai)}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(item.estimasiSelesai)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => ubahStatus(item, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-[#2975B2] ${badgeStatus(item.status)}`}
                      >
                        <option value="Berlangsung">Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Menunggu Suku Cadang">Menunggu Suku Cadang</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium whitespace-nowrap">{formatRupiah(item.biaya)}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => bukaUbah(item)} className="text-[#2975B2] hover:underline text-xs font-semibold">Ubah</button>
                        <button onClick={() => hapus(item)} className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#EAEEF4] text-sm text-gray-500">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40">Sebelumnya</button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40">Berikutnya</button>
          </div>
        </div>
      </div>

      {modalTerbuka && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-[#133354]">{editId ? "Ubah Perbaikan" : "Tambah Perbaikan"}</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Barang</label>
                <input required value={form.barang} onChange={(e) => setForm({ ...form, barang: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Printer Canon PIXMA G2010" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Teknisi / Petugas</label>
                <input required value={form.teknisi} onChange={(e) => setForm({ ...form, teknisi: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Pak Dedi Kurniawan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input required type="date" value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimasi Selesai</label>
                  <input type="date" value={form.estimasiSelesai} onChange={(e) => setForm({ ...form, estimasiSelesai: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Menunggu Suku Cadang">Menunggu Suku Cadang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Biaya (Rp)</label>
                  <input required type="number" min="0" value={form.biaya} onChange={(e) => setForm({ ...form, biaya: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="150000" />
                </div>
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

export default Perbaikan;
