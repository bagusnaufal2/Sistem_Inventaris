import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 rounded-xl bg-[#143F66] p-8 text-white">
          <h1 className="text-3xl font-bold">
            Dashboard Admin
          </h1>

          <p className="mt-2 text-blue-100">
            Sistem Inventaris dan Pelaporan Sarana
            SMPIT At-Taufiq
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Informasi Pengguna
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-medium text-gray-800">
                {user?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">
                {user?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-block rounded-md bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                {user?.role || "-"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
