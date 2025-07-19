import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import error404 from "../../assets/error404.png";
import {
  getAllSlider,
  deleteSlider,
  updateSlider,
  createSlider,
} from "../../utils/data/sliderAPI";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await getAllSlider();
        setSliders(response.data);
      } catch (error) {
        console.error("Gagal mengambil data slider:", error);
        toast.error("Gagal mengambil data slider.");
      }
    };

    fetchSliders();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("images", file);

      setLoading(true);
      try {
        const response = await createSlider(formData);
        setSliders((prevSliders) => [...prevSliders, response.data]);
        toast.success(response.message);
      } catch (error) {
        console.error("Gagal mengupload slider:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditSlider = async (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.onchange = async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i]);
        }

        setLoading(true);
        try {
          const sliderId = sliders[index]._id;
          const response = await updateSlider(sliderId, formData);
          setSliders((prevSliders) =>
            prevSliders.map((slider, i) =>
              i === index ? { ...slider, images: response.data.images } : slider
            )
          );
          toast.success(response.message);
        } catch (error) {
          console.error("Gagal memperbarui slider:", error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteSlider = async (index) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Slider yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const sliderId = sliders[index]._id;
        const response = await deleteSlider(sliderId);
        setSliders((prevSliders) => prevSliders.filter((_, i) => i !== index));
        toast.success(response.message);
      } catch (error) {
        console.error("Gagal menghapus slider:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-5 relative">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-medium">Slider</h1>
          <p className="text-sm sm:text-base text-font3">
            Pilih gambar untuk diupload
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="slider-upload"
            disabled={loading}
          />
          <label
            htmlFor="slider-upload"
            className={`flex items-center text-sm sm:text-sm bg-primary text-white hover:bg-secondary hover:text-white py-2 px-4 sm:px-6 rounded-md cursor-pointer w-full sm:w-auto ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Upload slider image"
          >
            {loading ? "Uploading..." : "Upload Slider"}
          </label>
        </div>
      </div>

      <div className="flex overflow-x-auto w-full gap-3 sm:gap-4 pb-4">
        {sliders.length === 0 ? (
          <div className="w-full text-center text-sm sm:text-base text-font3">
            Tidak ada slider tersedia.
          </div>
        ) : (
          sliders.map((slider, index) => {
            const imageUrl = slider.images[0];

            return (
              <div
                key={slider._id}
                className="flex-shrink-0 relative group w-64 h-48 sm:w-80 sm:h-60 lg:w-full lg:h-[70vh]"
              >
                <img
                  src={imageUrl}
                  alt={`Slider ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    console.error("Gagal memuat gambar:", imageUrl);
                    e.target.src = error404;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3 rounded">
                  <button
                    onClick={() => handleEditSlider(index)}
                    className="bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 text-sm sm:text-sm"
                    disabled={loading}
                    aria-label={`Edit slider ${index + 1}`}
                  >
                    {loading ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDeleteSlider(index)}
                    className="bg-primary text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-secondary text-sm sm:text-sm"
                    disabled={loading}
                    aria-label={`Delete slider ${index + 1}`}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Slider;
