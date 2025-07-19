import { useEffect, useState } from "react";
import { getAllUsers } from "../../utils/data/authAPI";
import HashLoader from "react-spinners/HashLoader";
// import userImg from "../../assets/user.png";
import { getInitialsAndColor } from "../../utils/helper.js";

const User = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data service complaints
  const fetchUser = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUser(response.data); // Simpan data ke state
      } else {
        setError("Gagal mengambil data");
      }
    } catch (err) {
      setError(err.message); // Tangani error
    } finally {
      setLoading(false); // Set loading ke false setelah selesai
    }
  };

  // Gunakan useEffect untuk memanggil fungsi fetch saat komponen dimuat
  useEffect(() => {
    fetchUser();
  }, []);

  // Tampilkan loading jika data masih diambil
  if (loading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return <div>Error: {error}</div>;
  }

  const createDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen p-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Admin</h1>
        <p className="text-font3">Informasi admin yang telah terdaftar</p>
      </div>

      {/* Tabel untuk menampilkan data */}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Email</th>

              <th className="py-2 px-4 border">Gambar</th>
              <th className="py-2 px-4 border">Waktu</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 text-sm ">
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">
                  {user.username}
                </td>
                <td className="py-2 px-4 border text-center">{user.email}</td>

                <td className="py-2 px-4 border ">
                  <div className="flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white"
                        style={{
                          backgroundColor: getInitialsAndColor(user.username)
                            .color,
                        }}
                      >
                        {getInitialsAndColor(user.username).initials}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 border text-center">
                  {createDate(user.createdAt)}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex items-center justify-center">
                    <button className="bg-primary hover:bg-secondary text-white py-1 px-4 rounded">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
