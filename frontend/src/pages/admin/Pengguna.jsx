import MainWrapper from "../../components/layout/MainWrapper";

// DATA CONTOH — belum ada API backend untuk modul ini
const penggunaContoh = [
  { id: 1, nama: "Ahmad Fauzi", email: "ahmad.fauzi@at-taufiq.sch.id", role: "Admin", status: "Aktif" },
  { id: 2, nama: "Siti Aminah", email: "siti.aminah@at-taufiq.sch.id", role: "Guru", status: "Aktif" },
  { id: 3, nama: "Budi Santoso", email: "budi.santoso@at-taufiq.sch.id", role: "Guru", status: "Aktif" },
  { id: 4, nama: "Rina Wulandari", email: "rina.wulandari@at-taufiq.sch.id", role: "Staff TU", status: "Aktif" },
  { id: 5, nama: "Dedi Kurniawan", email: "dedi.kurniawan@at-taufiq.sch.id", role: "Teknisi", status: "Aktif" },
  { id: 6, nama: "Ratna Dewi", email: "ratna.dewi@at-taufiq.sch.id", role: "Guru", status: "Nonaktif" },
  { id: 7, nama: "Rizky Pratama", email: "rizky.pratama@at-taufiq.sch.id", role: "Teknisi", status: "Aktif" },
  { id: 8, nama: "Maya Lestari", email: "maya.lestari@at-taufiq.sch.id", role: "Guru", status: "Aktif" },
];

const badgeRole = (role) => {
  if (role === "Admin") return "bg-[#DCFCE7] text-[#16A34A]";
  if (role === "Teknisi") return "bg-[#DCEEFF] text-[#2878B5]";
  return "bg-gray-100 text-gray-600";
};

const Pengguna = () => {
  return (
    <MainWrapper
      title="Manajemen Pengguna"
      description="Daftar akun pengguna sistem: admin, guru, staf TU, dan teknisi."
    >
      <div className="flex justify-end">
        <button className="bg-[#23845B] hover:bg-[#1B6B49] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          + Tambah Pengguna
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#163A5F]">
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {penggunaContoh.map((pengguna) => (
                <tr key={pengguna.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{pengguna.nama}</td>
                  <td className="px-5 py-3 text-gray-600">{pengguna.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeRole(pengguna.role)}`}>
                      {pengguna.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${pengguna.status === "Aktif" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-red-100 text-red-700"}`}>
                      {pengguna.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button className="text-[#2878B5] hover:underline text-xs font-semibold">Ubah</button>
                      <button className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Pengguna;
