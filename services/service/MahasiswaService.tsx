import axios from 'axios';
import { Master, Laporan } from '@/types';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.API_HOST, // Set your base URL here
});

const STATIC_TOKEN = process.env.JWT_TOKEN;

// Add an interceptor to attach the token to each request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); // Retrieve the access token from local storage
    // if (token) {
        config.headers.Authorization = `Bearer ${STATIC_TOKEN}`; // Set the Authorization header
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Refresh token if needed
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await axios.post('/auth/refresh', { refresh_token: refreshToken });
                
                localStorage.setItem('access_token', data.access_token);

                // Retry the failed request with a new access token
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const MahasiswaService = {
    getMahasiswa() {
        return apiClient.get(`/mahasiswa`)
            .then((response) => response.data.data as Master.Mahasiswa[])
            .catch((error) => {
                throw error;
            });
    },
    deleteMahasiswa(id: string) {
        return apiClient.delete(`/mahasiswa/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the dosen!", error);
                throw error;
            });
    },
    createMahasiswa(dosenData: Master.Mahasiswa) {
        return apiClient.post(`/mahasiswa`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the dosen!", error);
                throw error;
            });
    },
    updateMahasiswa(id: string, dosenData: Master.Mahasiswa) {
        return apiClient.put(`/mahasiswa/${id}`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the dosen!", error);
                throw error;
            });
    },
    getDosenById() {
        
    },
    getSebaranMahasiswa() {
        return apiClient.get(`/mahasiswa/sebaran`)
            .then((response) => response.data.data as Laporan.Sebaran[])
            .catch((error) => {
                throw error;
            });
    }
};