import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { productApi } from '@/api/productApi';
import type { Product } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import toast from 'react-hot-toast';

const Products = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 1,
    brand: '',
    image_url: '',
    images: [] as string[]
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: adminApi.getProducts
  });

  const { data: categories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: categoryApi.getCategories
  });

  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product created successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to create product')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Omit<Product, 'id'> }) => productApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product updated successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to update product')
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product')
  });

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        brand: product.brand || '',
        image_url: product.image_url || '',
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: categories?.[0]?.id || 1,
        brand: '',
        image_url: '',
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.price <= 0 || formData.stock < 0) {
      toast.error('Please fill out all required fields correctly');
      return;
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manage Products</h1>
        <button 
          onClick={() => openModal()}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
        >
          Add New Product
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                    <img src={product.image_url} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <span className="font-medium text-gray-900">{product.title}</span>
                </td>
                <td className="p-4 text-gray-600">Category {product.category_id}</td>
                <td className="p-4 font-medium text-gray-900">${Number(product.price).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {product.stock <= 0 ? `Out of Stock (0)` : `In Stock (${product.stock})`}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openModal(product)} className="text-orange-600 hover:underline text-sm font-medium mr-3">Edit</button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this product?')) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                    className="text-red-600 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-lg text-gray-800">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                    >
                      {categories?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Main Image URL (e.g. https://example.com/main.jpg)"
                    />
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData({...formData, images: newImages});
                          }}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                          placeholder="Additional Image URL"
                        />
                        <button type="button" onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({...formData, images: newImages});
                        }} className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold">
                          &times;
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, '']})} className="text-orange-600 font-medium text-sm flex items-center gap-1 hover:underline mt-1">
                      + Add Additional Image URL
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">
                Cancel
              </button>
              <button 
                type="submit" 
                form="productForm"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
