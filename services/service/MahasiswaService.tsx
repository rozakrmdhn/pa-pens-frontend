import axios from 'axios';
import { Master, Laporan } from '@/types';

export const MahasiswaService = {
    getMahasiswa() {
        return axios.get(`${process.env.API_HOST}/mahasiswa`)
            .then((response) => response.data.data as Master.Mahasiswa[])
            .catch((error) => {
                throw error;
            });
    },
    deleteMahasiswa(id: string) {
        return axios.delete(`${process.env.API_HOST}/mahasiswa/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the dosen!", error);
                throw error;
            });
    },
    createMahasiswa(dosenData: Master.Mahasiswa) {
        return axios.post(`${process.env.API_HOST}/mahasiswa`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the dosen!", error);
                throw error;
            });
    },
    updateMahasiswa(id: string, dosenData: Master.Mahasiswa) {
        return axios.put(`${process.env.API_HOST}/mahasiswa/${id}`, dosenData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error updating the dosen!", error);
                throw error;
            });
    },
    getDosenById() {
        
    },
    getSebaranMahasiswa() {
        return axios.get(`${process.env.API_HOST}/mahasiswa/sebaran`)
            .then((response) => response.data.data as Laporan.Sebaran[])
            .catch((error) => {
                throw error;
            });
    }
};