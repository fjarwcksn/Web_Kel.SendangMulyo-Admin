import { useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createData } from "../../utils/data/dataNewsAPI";
import { getAllBidang } from "../../utils/data/bidangAPI";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";

const AddPost = () => {
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bidang, setBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBidang = async () => {
      try {
        const response = await getAllBidang();
        setBidangList(response.bidang);
      } catch (error) {
        console.error("Error fetching bidang:", error);
      }
    };

    fetchBidang();
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (!title || !description || !date || !time || !bidang) {
      toast.error(
        "All fields (title, description, date, time, bidang) are required."
      );
      setLoading(false);
      return;
    }

    const formattedDate = date.split("-").reverse().join("/");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", formattedDate);
    formData.append("time", time);
    formData.append("bidang", bidang);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await createData(formData);
      if (response.success) {
        toast.success(response.message);
        navigate("/post");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating data:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-5 relative">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-medium text-font1">
          Tambah Postingan
        </h1>
        <p className="text-sm sm:text-base text-font3 mt-1">
          Tambahkan informasi terbaru dari instansi
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-3 sm:space-y-4">
            <div className="border border-borderPrimary bg-white w-full rounded">
              <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
                <h1>Nama dan Deskripsi</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="productName">
                    Title
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm text-font2"
                    htmlFor="productDescription"
                  >
                    Description
                  </label>
                  <textarea
                    id="productDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 sm:h-48 p-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3 sm:space-y-4">
            {/* Bidang Section */}
            <div className="border border-borderPrimary bg-white w-full rounded">
              <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
                <h1>Bidang</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-4 sm:p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="bidang">
                    Bidang
                  </label>
                  <select
                    id="bidang"
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  >
                    <option value="">-- Pilih Bidang --</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang._id} value={bidang._id}>
                        {bidang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div className="border border-borderPrimary bg-white w-full rounded">
              <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
                <h1>Tanggal Posting</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="date">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="time">
                    Waktu
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="border border-borderPrimary bg-white w-full rounded">
              <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
                <h1>Gambar Postingan</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-borderPrimary rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <CloudUpload size={20} color="gray" />
                  <span className="text-font3 text-sm mt-1">
                    Click to Upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto">
                  {existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={image.url}
                        alt={`Existing ${index}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newImages.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/post")}
                className="text-sm bg-font3 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white py-2 px-4 rounded-md w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Loading..." : "Tambah Berita"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
