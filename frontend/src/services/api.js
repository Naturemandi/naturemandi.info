import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const placeOrder = (data) => API.post('/orders', data);
export const verifyOtp = (phone) => API.post('/auth/verify-otp', { phone });

export default API;
