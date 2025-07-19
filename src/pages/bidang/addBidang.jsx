import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]); // Untuk gambar yang sudah ada
  const [newImages, setNewImages] = useState([]); // Untuk gambar baru yang diupload
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]); // Simpan gambar baru
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      // Hapus gambar yang sudah ada dari tampilan (opsional: tambahkan logika untuk hapus dari server)
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Hapus gambar baru yang belum diupload
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-5 min-h-screen">
      <div className="mb-10">
        <h1 className="text-2xl font-medium text-font1">Edit Postingan</h1>
        <p className="text-font3">Edit informasi terbaru dari instansi</p>
      </div>
      <form>
        <div className="grid grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            {/* Name and Description */}
            <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Nama dan Deskripsi</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="productName">
                    Title
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2 mt-5">
                  <label
                    className="text-sm text-font2"
                    htmlFor="productDescription"
                  >
                    Description
                  </label>
                  <textarea
                    id="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full h-[200px] p-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div className="space-y-4">
              {/* Bidang */}
              <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
                <div className="text-lg font-semibold p-5">
                  <h1>Bidang</h1>
                </div>
                <div className="border-b border-borderPrimary"></div>
                <div className="p-5">
                  <div className="space-y-2">
                    <label className="text-sm text-font2" htmlFor="productName">
                      Title
                    </label>
                    <select
                      className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                      required
                    >
                      <option value="">Pilih Bidang</option>
                      <option value="Bidang 1">Bidang Kamtibnas</option>
                      <option value="Bidang 2">Bidang Kesehata</option>
                      <option value="Bidang 3">Bidang Pawriwisata</option>
                      <option value="Bidang 3">Bidang Pendidikan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Product Image Section */}
            <div className="border w-full border-borderPrimary bg-white rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Gambar Postingan</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5 space-y-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-borderPrimary rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <CloudUpload size={20} color="gray" />
                  <span className="text-font3 text-sm">Click to Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
                <div className="mt-5 flex gap-4 overflow-x-auto">
                  {/* Tampilkan gambar yang sudah ada */}
                  {existingImages.map((images, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={images.url}
                        alt={`Existing ${index}`}
                        className="w-28 h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {/* Tampilkan gambar baru yang diupload */}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="w-28 h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/bidang")}
                className="text-sm bg-font3 text-white  py-2 px-4 rounded-md"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white  py-2 px-4 rounded-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
