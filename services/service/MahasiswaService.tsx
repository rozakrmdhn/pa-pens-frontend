import axios from 'axios';
import { Master, Laporan } from '@/types';
import getAuthorizationHeader from '../utils/getAuthorizationHeader';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.API_HOST, // Set your base URL here
});

// Add a request interceptor to set the authorization header for each request
apiClient.interceptors.request.use(
    (config) => {
        const headers = getAuthorizationHeader();
        // Set the Authorization header using Axios headers methods
        if (headers.Authorization) {
            config.headers['Authorization'] = headers.Authorization;
        }
        return config;
    },
    (error) => {
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