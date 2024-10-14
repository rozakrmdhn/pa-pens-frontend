/* Types */
declare namespace Magang {

    // MagangService
    type Daftar = {
        id?: string | undefined;
        lama_kp?: string;
        tempat_kp?: string;
        alamat?: string;
        kota?: string;
        bulan?: number;
        tahun?: number;
        status_persetujuan?: number;
        catatan_koordinator_kp?: string;
        id_dosen?: string;
        id_mahasiswa?: string;
        mahasiswa?: {
            nama?: string;
        };
        dosen?: {
            nama?: string;
        };
    };

    // AnggotaService
    type Anggota = {
        id?: string | undefined;
        id_mahasiswa?: string;
        id_daftar?: string;
        mahasiswa?: {
            nrp?: string;
            nama?: string;
        };
    };
}