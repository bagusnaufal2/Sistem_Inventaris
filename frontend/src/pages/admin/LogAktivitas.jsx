import { useCallback, useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { formatTanggalWaktu, pesanError } from "../../utils/format";

const LogAktivitas = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const muatLog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/log-aktivitas", { params: { page, limit: 10, q: q || undefined } });
      setLog(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat log aktivitas."));
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    muatLog();
  }, [muatLog]);

  return (
    <MainWrapper
      title="Log Aktivitas"
      description="Riwayat aktivitas seluruh pengguna dalam sistem inventaris."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Cari pengguna / aksi / detail..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-lg">
          {error}{" "}
          <button onClick={muatLog} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F8FB] text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Waktu</th>
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
                <th className="px-5 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : log.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Belum ada aktivitas.</td></tr>
              ) : (
                log.map((item) => (
                  <tr key={item.id} className="border-t border-[#EAEEF4] hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatTanggalWaktu(item.waktu)}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{item.pengguna}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F2FF] text-[#2975B2]">
                        {item.aksi}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.detail}</td>
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
    </MainWrapper>
  );
};

export default LogAktivitas;
