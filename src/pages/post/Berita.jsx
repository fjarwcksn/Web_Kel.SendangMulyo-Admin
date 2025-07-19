import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllData } from "../../utils/data/dataNewsAPI";
import HashLoader from "react-spinners/HashLoader";

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getAllData();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("Expected an array but got:", response);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchPosts();
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-medium text-font1">
              Berita & Pengumuman
            </h1>
            <p className="text-sm sm:text-base text-font3">
              Informasi terbaru dari instansi
            </p>
          </div>
          <button
            onClick={() => navigate("/add-post")}
            className="flex items-center text-sm bg-primary text-white hover:bg-secondary hover:text-white py-2 px-4 rounded-md w-fit"
          >
            <Plus size={18} className="cursor-pointer mr-2" />
            Tambah Berita
          </button>
        </div>
      </div>

      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white p-4 sm:p-5 rounded flex flex-col"
              >
                {/* Image Section */}
                {post.images && post.images.length > 0 && (
                  <div className="relative h-48 sm:h-72 rounded overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Metadata Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start space-y-2 sm:space-y-0 text-xs mt-4 mb-4">
                  <p className="bg-red-100 text-primary py-1 px-2">
                    {post.bidang.name}
                  </p>
                  <p>
                    {post.date} - {post.time} WIB
                  </p>
                </div>
                {/* Title and Description */}
                <h1
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  className="text-base sm:text-lg font-semibold hover:underline cursor-pointer"
                >
                  {truncateText(post.title, 30)}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {truncateText(post.description, 50)}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-sm sm:text-base">
              Tidak ada berita atau pengumuman tersedia.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
