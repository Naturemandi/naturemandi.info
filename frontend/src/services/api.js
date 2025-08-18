import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export const fetchProducts = () => API.get('/api/products');
export const fetchProductById = (id) => API.get(`/api/products/${id}`);
export const placeOrder = (data) => API.post('/api/orders', data);
export const verifyOtp = (phone) => API.post('/api/auth/verify-otp', { phone });

export default API;
