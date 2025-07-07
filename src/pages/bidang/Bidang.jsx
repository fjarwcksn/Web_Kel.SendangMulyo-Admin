import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import exmple from "../../assets/example.jpg";
import exmple2 from "../../assets/example2.jpg";
import exmple3 from "../../assets/example3.png";
import { HashLoader } from "react-spinners"; // Import spinner

const dummyPosts = [
  {
    id: 1,
    image: exmple,
    title: "Pengumuman Pendaftaran Mahasiswa Baru",
    description:
      "Pendaftaran mahasiswa baru untuk tahun ajaran 2025 telah dibuka. Segera daftar!",
  },
  {
    id: 2,
    image: exmple2,
    title: "Pelatihan Digital Marketing",
    description:
      "Pelatihan gratis untuk meningkatkan kemampuan digital marketing di era industri 4.0.",
  },
  {
    id: 3,
    image: exmple3,
    title: "Lomba Karya Ilmiah Nasional",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec",
  },
  {
    id: 4,
    image: exmple,
    title: "Pengumuman Pendaftaran Mahasiswa Baru",
    description:
      "Pendaftaran mahasiswa baru untuk tahun ajaran 2025 telah dibuka. Segera daftar!",
  },
  {
    id: 5,
    image: exmple2,
    title: "Pelatihan Digital Marketing",
    description:
      "Pelatihan gratis untuk meningkatkan kemampuan digital marketing di era industri 4.0.",
  },
  {
    id: 6,
    image: exmple3,
    title: "Lomba Karya Ilmiah Nasional",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec",
  },
];

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPosts(dummyPosts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-5 min-h-screen">
      <div className="space-y-2 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-font1">
              Berita Berdasarkan Bidang
            </h1>
            <p className="text-font3">Informasi terbaru dari instansi</p>
          </div>
          <button
            onClick={() => navigate("/add-bidang")}
            className="flex items-center text-sm bg-primary text-white hover:bg-font2 hover:text-white py-2 px-4 rounded-md"
          >
            <Plus size={18} className="cursor-pointer mr-2" />
            Tambah Berita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
            <HashLoader color="#C0392B" size={50} />
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border border-borderPrimary h-full p-6 rounded-md shadow-sm"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-50 object-cover "
              />
              <h1 className="text-lg font-semibold mt-10">
                {truncateText(post.title, 20)}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {truncateText(post.description, 70)}
              </p>
              <div className="mt-5">
                <button
                  onClick={() => navigate(`/edit-bidang`)}
                  className="text-sm bg-primary text-white py-2 px-4 rounded-md"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
