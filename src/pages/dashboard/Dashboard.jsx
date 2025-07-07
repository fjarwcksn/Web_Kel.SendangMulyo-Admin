import { useState, useEffect } from "react";
import { getAllData } from "../../utils/data/dataNewsAPI";
import { HashLoader } from "react-spinners";
import {
  createBidang,
  getAllBidang,
  deleteBidang,
} from "../../utils/data/bidangAPI";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { getAllUsers } from "../../utils/data/authAPI";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidangData, setBidangData] = useState([]);
  const [newBidang, setNewBidang] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllData();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBidangData = async () => {
      try {
        const response = await getAllBidang();
        if (response.bidang && Array.isArray(response.bidang)) {
          setBidangData(response.bidang);
        } else {
          console.error("Data bidang tidak valid:", response);
          setError("Data bidang tidak valid");
        }
      } catch (error) {
        console.error("Gagal mengambil data bidang:", error);
        setError(error.message);
      }
    };
    fetchBidangData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setError(error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateBidang = async () => {
    if (newBidang.trim() === "") {
      toast.error("Nama bidang tidak boleh kosong");
      return;
    }
    try {
      const data = { name: newBidang };
      const response = await createBidang(data);
      setBidangData([...bidangData, { name: newBidang }]);
      setNewBidang("");
      toast.success(response.message);
    } catch (error) {
      console.error("Gagal membuat bidang:", error);
      toast.error("Gagal membuat bidang: " + error.message);
    }
  };

  const handleDeleteBidang = async (bidangId) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteBidang(bidangId);
        setBidangData(bidangData.filter((bidang) => bidang._id !== bidangId));
        toast.success(response.message);
      } catch (error) {
        console.error("Gagal menghapus bidang:", error);
        toast.error("Gagal menghapus bidang: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 bg-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <Toaster />
      <h1 className="text-xl sm:text-2xl font-medium mb-4">Dashboard</h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-300 bg-white p-4 sm:p-5 rounded">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Data</h2>
          <p className="text-sm sm:text-base">
            Jumlah Data: <span className="font-bold">{data.length}</span>
          </p>
        </div>
        <div className="border border-gray-300 bg-white p-4 sm:p-5 rounded">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Bidang</h2>
          <p className="text-sm sm:text-base">
            Jumlah Bidang:{" "}
            <span className="font-bold">{bidangData.length}</span>
          </p>
        </div>
        <div className="border border-gray-300 bg-white p-4 sm:p-5 rounded">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Pengguna</h2>
          <p className="text-sm sm:text-base">
            Jumlah Pengguna: <span className="font-bold">{users.length}</span>
          </p>
        </div>
      </div>

      {/* Bidang Management Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Manajemen Bidang
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
          <input
            type="text"
            value={newBidang}
            onChange={(e) => setNewBidang(e.target.value)}
            placeholder="Masukkan nama bidang baru"
            className="border border-gray-300 p-2 rounded text-sm w-full sm:w-64"
          />
          <button
            onClick={handleCreateBidang}
            className="bg-primary text-white p-2 text-sm rounded hover:bg-secondary transition-colors"
          >
            Tambah Bidang
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="border border-gray-300 p-2 text-left">No</th>
                <th className="border border-gray-300 p-2 text-left">
                  Nama Bidang
                </th>
                <th className="border border-gray-300 p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bidangData && bidangData.length > 0 ? (
                bidangData.map((bidang, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-sm">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {bidang.name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => handleDeleteBidang(bidang._id)}
                        className="bg-red-600 text-white p-2 text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-sm">
                    Tidak ada data bidang
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
