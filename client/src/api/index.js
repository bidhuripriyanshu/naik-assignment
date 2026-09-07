import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('naikUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  autocomplete: (q) => api.get('/products/autocomplete', { params: { q } }),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getById: (id) => api.get(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
};

export const orderAPI = {
  checkPincode: (pincode) => api.get('/products/check-pincode', { params: { pincode } }),
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getAll: () => api.get('/orders'),
};

export default api;
