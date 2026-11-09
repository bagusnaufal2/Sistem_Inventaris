import { useCallback, useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { formatTanggal, pesanError } from "../../utils/format";

const badgeStatus = (status) => {
  if (status === "Selesai") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Diproses") return "bg-[#DCEEFF] text-[#2878B5]";
  return "bg-amber-100 text-amber-700";
};

const formAwal = { barang: "", pelapor: "", deskripsi: "", tanggalLaporan: "" };

const Kerusakan = () => {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatLaporan = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/kerusakan", {
        params: { page, limit: 10, q: q || undefined, status: filterStatus || undefined },
      });
      setLaporan(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat laporan kerusakan."));
    } finally {
      setLoading(false);
    }
  }, [page, q, filterStatus]);

  useEffect(() => {
    muatLaporan();
  }, [muatLaporan]);

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    try {
      await api.post("/kerusakan", form);
      setPesan("Laporan kerusakan berhasil dibuat.");
      setModalTerbuka(false);
      setForm(formAwal);
      muatLaporan();
    } catch (err) {
      setPesan(pesanError(err, "Gagal membuat laporan."));
    } finally {
      setMenyimpan(false);
    }
  };

  const ubahStatus = async (item, statusBaru) => {
    try {
      await api.patch(`/kerusakan/${item.id}/status`, { status: statusBaru });
      setPesan(`Status laporan ${item.kode} diubah menjadi ${statusBaru}.`);
      muatLaporan();
    } catch (err) {
      setPesan(pesanError(err, "Gagal mengubah status laporan."));
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus laporan ${item.kode} (${item.barang})?`)) return;
    try {
      await api.delete(`/kerusakan/${item.id}`);
      setPesan("Laporan berhasil dihapus.");
      muatLaporan();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus laporan."));
    }
  };

  return (
    <MainWrapper
      title="Laporan Kerusakan"
      description="Daftar laporan kerusakan barang yang dilaporkan oleh guru dan staf sekolah."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari barang / pelapor / kode..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#23845B]"
          />
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#23845B]">
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={() => { setForm(formAwal); setModalTerbuka(true); }} className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Lapor Kerusakan
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
          <button onClick={muatLaporan} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

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
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : laporan.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Belum ada laporan kerusakan.</td></tr>
              ) : (
                laporan.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-[#2878B5]">{item.kode}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{item.barang}</td>
                    <td className="px-5 py-3 text-gray-600">{item.pelapor}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(item.tanggalLaporan)}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs">{item.deskripsi}</td>
                    <td className="px-5 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => ubahStatus(item, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-[#23845B] ${badgeStatus(item.status)}`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => hapus(item)} className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
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
            <h2 className="text-lg font-semibold text-[#163A5F]">Lapor Kerusakan</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Barang</label>
                <input required value={form.barang} onChange={(e) => setForm({ ...form, barang: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" placeholder="Contoh: Printer Canon PIXMA G2010" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pelapor</label>
                  <input required value={form.pelapor} onChange={(e) => setForm({ ...form, pelapor: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" placeholder="Contoh: Bu Rina Wulandari" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Laporan</label>
                  <input type="date" value={form.tanggalLaporan} onChange={(e) => setForm({ ...form, tanggalLaporan: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Kerusakan</label>
                <textarea required value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#23845B]" placeholder="Jelaskan kerusakannya..." />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModalTerbuka(false)} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">Batal</button>
                <button type="submit" disabled={menyimpan} className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
                  {menyimpan ? "Menyimpan..." : "Kirim Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainWrapper>
  );
};

export default Kerusakan;
