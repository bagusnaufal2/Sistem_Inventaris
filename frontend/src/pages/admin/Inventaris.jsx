import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { pesanError } from "../../utils/format";

const badgeKondisi = (kondisi) => {
  if (kondisi === "Baik") return "bg-[#DCFCE7] text-[#16A34A]";
  if (kondisi === "Rusak Ringan") return "bg-[#FFF2DE] text-[#B45309]";
  return "bg-red-100 text-red-700";
};

const badgeStatus = (status) => {
  if (status === "Tersedia") return "bg-[#DCFCE7] text-[#16A34A]";
  if (status === "Dipinjam") return "bg-[#E6F2FF] text-[#2975B2]";
  return "bg-[#FFF2DE] text-[#B45309]";
};

const formAwal = {
  nama: "",
  kategoriId: "",
  lokasiId: "",
  kondisi: "Baik",
  status: "Tersedia",
  deskripsi: "",
};

const Inventaris = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [lokasi, setLokasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [q, setQ] = useState("");
  const [filterKategori, setFilterKategori] = useState(searchParams.get("lokasiId") ? "" : "");
  const [filterLokasi, setFilterLokasi] = useState(searchParams.get("lokasiId") || "");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatBarang = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/inventaris", {
        params: {
          page,
          limit: 10,
          q: q || undefined,
          kategoriId: filterKategori || undefined,
          lokasiId: filterLokasi || undefined,
          kondisi: filterKondisi || undefined,
          status: filterStatus || undefined,
        },
      });
      setBarang(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat data inventaris."));
    } finally {
      setLoading(false);
    }
  }, [page, q, filterKategori, filterLokasi, filterKondisi, filterStatus]);

  useEffect(() => {
    api.get("/kategori", { params: { limit: 100 } }).then((res) => setKategori(res.data.data || [])).catch(() => {});
    api.get("/lokasi", { params: { limit: 100 } }).then((res) => setLokasi(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    muatBarang();
  }, [muatBarang]);

  const bukaTambah = () => {
    setEditId(null);
    setForm(formAwal);
    setModalTerbuka(true);
  };

  const bukaUbah = (item) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      kategoriId: String(item.kategoriId),
      lokasiId: String(item.lokasiId),
      kondisi: item.kondisi,
      status: item.status,
      deskripsi: item.deskripsi || "",
    });
    setModalTerbuka(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    try {
      if (editId) {
        await api.put(`/inventaris/${editId}`, form);
        setPesan("Barang berhasil diubah.");
      } else {
        await api.post("/inventaris", form);
        setPesan("Barang berhasil ditambahkan.");
      }
      setModalTerbuka(false);
      muatBarang();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menyimpan barang."));
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus barang "${item.nama}"?`)) return;
    try {
      await api.delete(`/inventaris/${item.id}`);
      setPesan("Barang berhasil dihapus.");
      muatBarang();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus barang."));
    }
  };

  const terapkanFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <MainWrapper
      title="Data Inventaris"
      description="Daftar seluruh barang inventaris SMPIT At-Taufiq beserta kondisi dan statusnya."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
          />
          <select value={filterKategori} onChange={terapkanFilter(setFilterKategori)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
            <option value="">Semua Kategori</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <select value={filterLokasi} onChange={(e) => { terapkanFilter(setFilterLokasi)(e); setSearchParams(e.target.value ? { lokasiId: e.target.value } : {}); }} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
            <option value="">Semua Lokasi</option>
            {lokasi.map((l) => (
              <option key={l.id} value={l.id}>{l.nama}</option>
            ))}
          </select>
          <select value={filterKondisi} onChange={terapkanFilter(setFilterKondisi)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak">Rusak</option>
          </select>
          <select value={filterStatus} onChange={terapkanFilter(setFilterStatus)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
            <option value="">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={bukaTambah} className="bg-[#2975B2] hover:bg-[#1F598A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Tambah Barang
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
          <button onClick={muatBarang} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F8FB] text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Nama Barang</th>
                <th className="px-5 py-3 font-semibold">Kategori</th>
                <th className="px-5 py-3 font-semibold">Lokasi</th>
                <th className="px-5 py-3 font-semibold">Kondisi</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : barang.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Belum ada barang yang cocok.</td></tr>
              ) : (
                barang.map((item) => (
                  <tr key={item.id} className="border-t border-[#EAEEF4] hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{item.nama}</td>
                    <td className="px-5 py-3 text-gray-600">{item.kategori}</td>
                    <td className="px-5 py-3 text-gray-600">{item.lokasi}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeKondisi(item.kondisi)}`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStatus(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
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
            <h2 className="text-lg font-semibold text-[#133354]">{editId ? "Ubah Barang" : "Tambah Barang"}</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Barang</label>
                <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Laptop ASUS VivoBook 14" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                  <select required value={form.kategoriId} onChange={(e) => setForm({ ...form, kategoriId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="">Pilih kategori</option>
                    {kategori.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
                  <select required value={form.lokasiId} onChange={(e) => setForm({ ...form, lokasiId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="">Pilih lokasi</option>
                    {lokasi.map((l) => (
                      <option key={l.id} value={l.id}>{l.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi</label>
                  <select value={form.kondisi} onChange={(e) => setForm({ ...form, kondisi: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi (opsional)</label>
                <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" />
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

export default Inventaris;
