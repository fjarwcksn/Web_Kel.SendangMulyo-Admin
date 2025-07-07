import { useEffect, useState } from "react";
import {
  getAllServiceComplain,
  deleteServiceComplain,
  respondServiceComplain,
} from "../../utils/data/serviceComplainAPI";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Layanan = () => {
  const [serviceComplaints, setServiceComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [responderName, setResponderName] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseError, setResponseError] = useState(null);

  // Fungsi untuk mengambil data service complaints
  const fetchServiceComplaints = async () => {
    try {
      const response = await getAllServiceComplain();
      if (response.success) {
        setServiceComplaints(response.data);
      } else {
        setError("Gagal mengambil data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gunakan useEffect untuk memanggil fungsi fetch saat komponen dimuat
  useEffect(() => {
    fetchServiceComplaints();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteServiceComplain(id);
          if (response.success) {
            setServiceComplaints(
              serviceComplaints.filter((complaint) => complaint._id !== id)
            );
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        } catch (err) {
          toast.error(err.message);
        }
      }
    });
  };

  // Open detail modal
  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setResponderName(complaint.adminResponse?.responderName || "");
    setResponseText(complaint.adminResponse?.responseText || "");
    setResponseError(null);
    setIsDetailModalOpen(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedComplaint(null);
    setResponderName("");
    setResponseText("");
    setResponseError(null);
  };

  // Submit response
  const handleSubmitResponse = async () => {
    try {
      if (!responderName || !responseText) {
        setResponseError("Semua field wajib diisi.");
        return;
      }
      const response = await respondServiceComplain(
        selectedComplaint._id,
        responderName,
        responseText
      );
      if (response.success) {
        setServiceComplaints((prev) =>
          prev.map((c) => (c._id === response.data._id ? response.data : c))
        );
        toast.success(response.message);
        setSelectedComplaint(response.data); // Update selected complaint with new response
      } else {
        setResponseError(response.message);
      }
    } catch (err) {
      setResponseError(err.message || "Gagal mengirim tanggapan");
    }
  };

  // Fungsi untuk format tanggal dan jam dalam zona waktu Jakarta
  const createDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    };
    return (
      date.toLocaleString("id-ID", options).replace(" pukul ", " - ") + " WIB"
    );
  };

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

  return (
    <div className="min-h-screen p-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Pengaduan Layanan</h1>
        <p className="text-font3">
          Pengaduan Layanan Kelurahan Tlogosari Wetan
        </p>
      </div>

      {/* Tabel untuk menampilkan data */}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">No. Telepon</th>
              <th className="py-2 px-4 border">Waktu Pengaduan</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {serviceComplaints.map((complaint, index) => (
              <tr key={complaint._id} className="hover:bg-gray-50 text-sm">
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">
                  {complaint.name}
                </td>
                <td className="py-2 px-4 border text-center">
                  {complaint.email}
                </td>
                <td className="py-2 px-4 border text-center">
                  {complaint.phone}
                </td>
                <td className="py-2 px-4 border text-center">
                  {createDate(complaint.createdAt)}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openDetailModal(complaint)}
                      className="text-xs bg-gray-200 hover:bg-gray-300  text-gray-700 py-1 px-4 rounded"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="text-xs bg-primary hover:bg-red-600 text-white py-1 px-4 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-lg w-[90%] rounded max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Detail Pengaduan</h2>
              {/* <button
                onClick={closeDetailModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button> */}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm">{selectedComplaint.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm">{selectedComplaint.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  No. Telepon
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm">{selectedComplaint.phone}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm break-words text-justify">
                    {selectedComplaint.title}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pesan
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm break-words text-justify">
                    {selectedComplaint.msg}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gambar
                </label>
                <div className="border border-gray-300 p-2 rounded gap-3 flex ">
                  {selectedComplaint.images &&
                  selectedComplaint.images.length > 0 ? (
                    selectedComplaint.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Gambar ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) =>
                          (e.target.src = "/placeholder-image.jpg")
                        }
                      />
                    ))
                  ) : (
                    <div className="text-sm text-left flex items-start">
                      <p>Tidak ada gambar</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Waktu Pengaduan
                </label>
                <div className="border border-gray-300 p-2 rounded">
                  <p className="mt-1 text-sm">
                    {createDate(selectedComplaint.createdAt)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="block text-lg font-semibold text-font1">
                  Tanggapan Pengaduan
                </h2>
                {selectedComplaint.adminResponse ? (
                  <div className="mt-1 text-sm space-y-2">
                    <div className="border border-gray-300 p-2 rounded">
                      <p>
                        <strong>Oleh:</strong>{" "}
                        {selectedComplaint.adminResponse.responderName}
                      </p>
                    </div>
                    <div className="border border-gray-300 p-2 rounded">
                      <p>
                        <strong>Tanggal:</strong>{" "}
                        {createDate(
                          selectedComplaint.adminResponse.respondedAt
                        )}
                      </p>
                    </div>
                    <div className="border border-gray-300 p-2 rounded">
                      <p className="text-left">
                        <strong>Tanggapan:</strong>{" "}
                        {selectedComplaint.adminResponse.responseText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm">Belum ditanggapi</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-font1">
                  {selectedComplaint.adminResponse
                    ? "Ubah Tanggapan"
                    : "Beri Tanggapan"}
                </h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Responden
                    </label>
                    <input
                      type="text"
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="mt-1 text-sm block w-full border border-gray-300 rounded p-2"
                      placeholder="Masukkan nama responden"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggapan
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="mt-1 text-sm block w-full border border-gray-300 rounded p-2"
                      rows="5"
                      placeholder="Masukkan tanggapan Anda"
                    ></textarea>
                  </div>
                  {responseError && (
                    <p className="text-red-500 text-sm">{responseError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDetailModal}
                className="text-xs bg-gray-200 hover:bg-gray-300  text-gray-700 py-2 px-4 rounded"
              >
                Tutup
              </button>
              <button
                onClick={handleSubmitResponse}
                className="text-xs bg-primary hover:bg-secondary text-white py-2 px-4 rounded"
              >
                Kirim Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layanan;
