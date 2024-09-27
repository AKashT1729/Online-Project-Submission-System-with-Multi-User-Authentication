// import axios from 'axios';

// // Create an Axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1', // Base URL for the backend API
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to include tokens (if available) in every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Attach token to the request headers
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle 401 (Unauthorized) responses
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Optionally, implement token refresh logic here if needed
//       // Redirect to login or handle unauthorized access
//       console.error('Unauthorized access. Please log in again.');
//     }
//     return Promise.reject(error);
//   }
// );

// // User Authentication API
// export const login = async (credentials) => {
//   const response = await api.post('/login', credentials);
//   if (response.data) {
//     localStorage.setItem('accessToken', response.data.accessToken); // Store access token
//     localStorage.setItem('refreshToken', response.data.refreshToken); // Store refresh token
//   }
//   return response.data;
// };

// export const register = async (userData) => {
//   const response = await api.post('/register', userData);
//   return response.data;
// };

// export const logout = async () => {
//   await api.post('/logout');
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
// };

// // Projects API
// export const getProjects = async () => {
//   const response = await api.get('/projects');
//   return response.data;
// };

// export const getProject = async (projectId) => {
//   const response = await api.get(`/projects/${projectId}`);
//   return response.data;
// };

// export const submitProject = async (projectData) => {
//   const response = await api.post('/projects/submit', projectData, {
//     headers: {
//       'Content-Type': 'multipart/form-data', // For handling file uploads
//     },
//   });
//   return response.data;
// };

// export const updateProject = async (projectId, updatedData) => {
//   const response = await api.put(`/projects/${projectId}`, updatedData);
//   return response.data;
// };

// export const deleteProject = async (projectId) => {
//   const response = await api.delete(`/projects/${projectId}`);
//   return response.data;
// };

// // Guide/HOD API
// export const getPendingProjects = async () => {
//   const response = await api.get('/projects/pending');
//   return response.data;
// };

// export const approveProject = async (projectId) => {
//   const response = await api.post(`/projects/${projectId}/approve`);
//   return response.data;
// };

// export const rejectProject = async (projectId) => {
//   const response = await api.post(`/projects/${projectId}/reject`);
//   return response.data;
// };

// export default api;
