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
};