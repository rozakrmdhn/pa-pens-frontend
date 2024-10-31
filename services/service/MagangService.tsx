import axios from "axios";
import { Magang } from '@/types';
import getAuthorizationHeader from "../utils/getAuthorizationHeader";

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

export const MagangService = {
    getPengajuan() {
        return apiClient.get(`${process.env.API_HOST}/magang`)
            .then((response) => response.data.data as Magang.Daftar[])
            .catch((error) => {
                throw error;
            });
    },
    getPengajuanByMahasiswa(id: string) {
        return apiClient.get(`${process.env.API_HOST}/magang/pengajuan/mahasiswa/${id}`)
            .then((response) => response.data.data as Magang.Daftar[])
            .catch((error) => {
                throw error;
            });
    },
    getPengajuanById(id: string) {
        return apiClient.get(`${process.env.API_HOST}/magang/pengajuan/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    createPengajuan(daftarData: Magang.Daftar) {
        return apiClient.post(`${process.env.API_HOST}/magang/pengajuan`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    updatePengajuan(id: string, daftarData: Magang.Daftar) {
        return apiClient.put(`${process.env.API_HOST}/magang/pengajuan/${id}`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the data!", error);
                throw error;
            });
    },
    getAnggotaByPengajuan(id: string) {
        return apiClient.get(`${process.env.API_HOST}/magang/pengajuan/${id}/anggota`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    verifikasiPengajuan(id: string, daftarData: Magang.Daftar) {
        return apiClient.put(`${process.env.API_HOST}/magang/pengajuan/${id}/verifikasi`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    plotingDosbim(id: string, daftarData: Magang.Daftar) {
        return apiClient.put(`${process.env.API_HOST}/magang/pengajuan/${id}/ploting`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
};