import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CloudUpload } from "lucide-react";
import {
  getDataById,
  updateData,
  deleteData,
} from "../../utils/data/dataNewsAPI";
import { getAllBidang } from "../../utils/data/bidangAPI";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import Swal from "sweetalert2";

// Utility function to convert dd/mm/yyyy to yyyy-mm-dd
const formatToInputDate = (dateStr) => {
  if (!dateStr) return "";
  // Check if date is in dd/mm/yyyy format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  // If already in yyyy-mm-dd or another format, try parsing
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate)) {
    return parsedDate.toISOString().split("T")[0];
  }
  return "";
};

// Utility function to convert yyyy-mm-dd to dd/mm/yyyy
const formatToBackendDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postTime, setPostTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bidangList, setBidangList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataById(id);
        setTitle(data.title);
        setDescription(data.description);
        setSelectedField(data.bidang._id);
        // Convert fetched date to yyyy-mm-dd for input
        setPostDate(formatToInputDate(data.date));
        setPostTime(data.time);
        setExistingImages(data.images || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Gagal memuat data postingan");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchBidang = async () => {
      try {
        const response = await getAllBidang();
        setBidangList(response.bidang);
      } catch (error) {
        console.error("Error fetching bidang:", error);
        toast.error("Gagal memuat daftar bidang");
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

    if (!title || !description || !selectedField || !postDate || !postTime) {
      toast.error("Semua kolom wajib diisi");
      return;
    }

    setIsUpdating(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("bidang", selectedField);
    // Convert date to dd/mm/yyyy for backend
    formData.append("date", formatToBackendDate(postDate));
    formData.append("time", postTime);

    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image);
    });

    newImages.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      const response = await updateData(id, formData);
      toast.success(response.message);
      navigate("/post");
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteData(id);
        toast.success(response.message);
        navigate("/post");
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        toast.error(error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-5">
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-medium text-font1">
          Edit Postingan
        </h1>
        <p className="text-sm sm:text-base text-font3 mt-1">
          Edit informasi terbaru dari instansi
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
                  <label className="text-sm text-font2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
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
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    required
                  >
                    <option value="">Pilih Bidang</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang._id} value={bidang._id}>
                        {bidang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

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
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
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
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>

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
                  {existingImages.map((file, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={file}
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

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/post")}
                className="text-sm bg-font3 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm bg-primary text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Hapus Berita
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white py-2 px-4 rounded-md w-full sm:w-auto"
                disabled={isUpdating}
              >
                Update Berita
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
