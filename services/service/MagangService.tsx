import axios from "axios";
import { Magang } from '@/types';

export const MagangService = {
    getPengajuan() {
        return axios.get(`${process.env.API_HOST}/magang`)
            .then((response) => response.data.data as Magang.Daftar[])
            .catch((error) => {
                throw error;
            });
    },
    getPengajuanById(id: string) {
        return axios.get(`${process.env.API_HOST}/magang/pengajuan/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    createPengajuan(daftarData: Magang.Daftar) {
        return axios.post(`${process.env.API_HOST}/magang/pengajuan`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    updatePengajuan(id: string, daftarData: Magang.Daftar) {
        return axios.put(`${process.env.API_HOST}/magang/pengajuan/${id}`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the data!", error);
                throw error;
            });
    },
    getAnggotaByPengajuan(id: string) {
        return axios.get(`${process.env.API_HOST}/magang/pengajuan/${id}/anggota`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    verifikasiPengajuan(id: string, daftarData: Magang.Daftar) {
        return axios.put(`${process.env.API_HOST}/magang/pengajuan/${id}/verifikasi`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    plotingDosbim(id: string, daftarData: Magang.Daftar) {
        return axios.put(`${process.env.API_HOST}/magang/pengajuan/${id}/ploting`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
};