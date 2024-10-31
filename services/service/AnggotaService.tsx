import axios from "axios";
import { Magang } from '@/types';
import getAuthorizationHeader from "../utils/getAuthorizationHeader";

type BulkDataAnggota = {
    mahasiswaList?: {
        id?: string | undefined;
        id_mahasiswa?: string;
        id_daftar?: string;
    }[];
};

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

export const AnggotaService = {
    createBulkAnggota(daftarData: BulkDataAnggota) {
        return apiClient.post(`${process.env.API_HOST}/magang/anggota/bulk`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    getAllAnggota() {
        return apiClient.get(`${process.env.API_HOST}/magang/anggota`)
            .then((response) => response.data.data as Magang.Anggota[])
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
    deleteAnggota(id: string) {
        return apiClient.delete(`${process.env.API_HOST}/magang/anggota/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the data!", error);
                throw error;
            });
    },
    getAnggotaById(id: string) {
        return apiClient.get(`${process.env.API_HOST}/magang/anggota/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
    getAnggotaByMahasiswa(id: string, id_mahasiswa: string) {
        return apiClient.get(`${process.env.API_HOST}/magang/anggota/pengajuan/${id}/mahasiswa/${id_mahasiswa}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
};