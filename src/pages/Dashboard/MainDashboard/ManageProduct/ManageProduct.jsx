import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxios from "../../../../hooks/useAxios";

const ManageProduct = () => {
  const axiosInstance = useAxios();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

  // 🔹 EDIT STATE
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // 🔹 GET PRODUCTS
  const fetchProducts = () => {
    setLoading(true);
    axiosInstance
      .get("/products", { params: { managerEmail: searchEmail || undefined } })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load products");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔴 DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure to delete this product?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔴 SEARCH PRODUCT
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // 🔴 EDIT PRODUCT SUBMIT
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    setEditLoading(true);
    try {
      const { _id, name, category, price, managerEmail } = editProduct;
      await axiosInstance.put(`/products/${_id}`, {
        name,
        category,
        price,
        managerEmail,
      });
      toast.success("Product updated successfully");
      setEditProduct(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white mt-20 text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-blue-950 to-purple-900 pt-24 px-4">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="w-full bg-black/70 backdrop-blur-xl border border-blue-900/40 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">
            Manage Products
          </h2>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by Manager Email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold hover:from-orange-400 hover:to-orange-500 transition-all">
              Search
            </button>
          </form>

          {/* TABLE */}
          <div className="overflow-x-auto w-full min-h-[70vh]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gray-300">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Manager Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-blue-900/30 hover:bg-slate-900/50 transition">
                    <td className="p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-blue-900/40"
                      />
                    </td>
                    <td className="p-3 text-white font-medium">
                      {product.name}
                    </td>
                    <td className="p-3 text-gray-300">{product.category}</td>
                    <td className="p-3 text-orange-400 font-semibold">
                      ${product.price}
                    </td>
                    <td className="p-3 text-blue-400">
                      {product.managerEmail || "-"}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                          title="Edit">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                          title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p className="text-center text-gray-400 py-10">
                No products found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-2xl text-white font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                placeholder="Product Name"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-900/40"
              />
              <input
                type="text"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                placeholder="Category"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-900/40"
              />
              <input
                type="number"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                placeholder="Price"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-900/40"
              />
              <input
                type="text"
                value={editProduct.managerEmail || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    managerEmail: e.target.value,
                  })
                }
                placeholder="Manager Email"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-900/40"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold">
                  {editLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
