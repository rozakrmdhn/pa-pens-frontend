import axios from "axios";

type Anggota = {
    mahasiswaList?: {
        id?: string | undefined;
        id_mahasiswa?: string;
        id_daftar?: string;
    }[];
};

export const AnggotaService = {
    createBulkAnggota(daftarData: Anggota) {
        return axios.post(`${process.env.API_HOST}/magang/anggota/bulk`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    getAllAnggota() {
        return axios.get(`${process.env.API_HOST}/magang/anggota`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
    deleteAnggota(id: string) {
        return axios.delete(`${process.env.API_HOST}/magang/anggota/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error deleting the data!", error);
                throw error;
            });
    },
    getAnggotaById(id: string) {
        return axios.get(`${process.env.API_HOST}/magang/anggota/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
    getAnggotaByMahasiswa(id: string, id_mahasiswa: string) {
        return axios.get(`${process.env.API_HOST}/magang/anggota/pengajuan/${id}/mahasiswa/${id_mahasiswa}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error fetching the data!", error);
                throw error;
            });
    },
};