/* Types */
declare namespace Magang {

    // MagangService
    type Daftar = {
        id?: string | undefined;
        lama_kp?: string;
        tanggal_kp?: Date;
        tempat_kp?: string;
        alamat?: string;
        provinsi?: string | undefined;
        kota?: string | undefined;
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
    
    // LogbookService
    type Logbook = {
        id?: string | undefined;
        id_anggota?: string;
        id_mahasiswa?: string;
        tanggal?: Date;
        jam_mulai?: string;
        jam_selesai?: string;
        kegiatan?: string;
        kesesuaian_matkul_diajarkan?: number;
        matkul_diajarkan?: string;
        setujui_logbook?: number;
        lampiran_laporan?: string;
        lampiran_foto?: string;
        catatan_pembimbing?: string;
    };
}