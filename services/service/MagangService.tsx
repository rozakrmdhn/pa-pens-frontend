import axios from "axios";

type Daftar = {
    id?: string | undefined;
    lama_kp?: string;
    tempat_kp?: string;
    alamat?: string;
    kota?: string;
    id_mahasiswa?: string;
    bulan?: number;
    tahun?: number;
    // id_dosen?: string;
    status_persetujuan?: number;
    catatan_koordinator_kp?: string;
};

export const MagangService = {
    getPengajuan() {
        return axios.get(`${process.env.API_HOST}/magang`)
            .then((response) => response.data.data as Daftar[])
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
    createPengajuan(daftarData: Daftar) {
        return axios.post(`${process.env.API_HOST}/magang/pengajuan`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error("There was an error creating the data!", error);
                throw error;
            });
    },
    updatePengajuan(id: string, daftarData: Daftar) {
        console.log(daftarData);
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
    verifikasiPengajuan(id: string, daftarData: Daftar) {
        return axios.put(`${process.env.API_HOST}/magang/pengajuan/${id}/verifikasi`, daftarData)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
    plotingDosbim(id: string) {
        return axios.put(`${process.env.API_HOST}/magang/pengajuan/${id}/ploting`)
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    },
};