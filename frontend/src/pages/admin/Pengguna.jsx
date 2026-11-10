import { useCallback, useEffect, useState } from "react";
import MainWrapper from "../../components/layout/MainWrapper";
import api from "../../services/api";
import { labelRole, pesanError } from "../../utils/format";

const badgeRole = (role) => {
  if (role === "ADMIN") return "bg-[#DCFCE7] text-[#16A34A]";
  if (role === "PETUGAS") return "bg-[#E6F2FF] text-[#2975B2]";
  return "bg-gray-100 text-gray-600";
};

const formAwal = { name: "", email: "", password: "", role: "GURU", isActive: true };

const Pengguna = () => {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(formAwal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muatPengguna = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/pengguna", { params: { page, limit: 10, q: q || undefined } });
      setPengguna(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(pesanError(err, "Gagal memuat data pengguna."));
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    muatPengguna();
  }, [muatPengguna]);

  const bukaTambah = () => {
    setEditId(null);
    setForm(formAwal);
    setModalTerbuka(true);
  };

  const bukaUbah = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, email: item.email, password: "", role: item.role, isActive: !!item.isActive });
    setModalTerbuka(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setMenyimpan(true);
    setPesan("");
    try {
      const payload = { ...form };
      if (editId && !payload.password) delete payload.password;
      if (editId) {
        await api.put(`/pengguna/${editId}`, payload);
        setPesan("Pengguna berhasil diubah.");
      } else {
        await api.post("/pengguna", payload);
        setPesan("Pengguna berhasil ditambahkan.");
      }
      setModalTerbuka(false);
      muatPengguna();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menyimpan pengguna."));
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item) => {
    if (!window.confirm(`Hapus pengguna "${item.name}" (${item.email})?`)) return;
    try {
      await api.delete(`/pengguna/${item.id}`);
      setPesan("Pengguna berhasil dihapus.");
      muatPengguna();
    } catch (err) {
      setPesan(pesanError(err, "Gagal menghapus pengguna."));
    }
  };

  return (
    <MainWrapper
      title="Manajemen Pengguna"
      description="Daftar akun pengguna sistem: admin, guru, staf TU, dan teknisi."
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Cari nama / email..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#2975B2]"
        />
        <div className="flex justify-end">
          <button onClick={bukaTambah} className="bg-[#2975B2] hover:bg-[#1F598A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
            + Tambah Pengguna
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
          <button onClick={muatPengguna} className="underline font-semibold">Coba lagi</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#EAEEF4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F8FB] text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : pengguna.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Belum ada pengguna.</td></tr>
              ) : (
                pengguna.map((item) => (
                  <tr key={item.id} className="border-t border-[#EAEEF4] hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-5 py-3 text-gray-600">{item.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeRole(item.role)}`}>
                        {labelRole(item.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${item.isActive ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-red-100 text-red-700"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
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
            <h2 className="text-lg font-semibold text-[#133354]">{editId ? "Ubah Pengguna" : "Tambah Pengguna"}</h2>
            <form onSubmit={simpan} className="flex flex-col gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="Contoh: Ahmad Fauzi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="nama@at-taufiq.sch.id" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password {editId ? "(kosongkan bila tidak diubah)" : "(minimal 8 karakter)"}
                </label>
                <input type="password" required={!editId} minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2975B2]" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="ADMIN">Admin</option>
                    <option value="PETUGAS">Petugas</option>
                    <option value="GURU">Guru</option>
                    <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={form.isActive ? "aktif" : "nonaktif"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "aktif" })} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2975B2]">
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
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

export default Pengguna;
