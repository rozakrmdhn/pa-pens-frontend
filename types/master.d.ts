/* Types */
declare namespace Master {
    
    // DosenService
    type Dosen = {
        id?: string | undefined;
        nama?: string;
        jenis_kelamin?: string;
        email?: string;
        nomor_hp?: string;
        alamat?: string;
    };

    // MahasiswaService
    type Mahasiswa = {
        id?: string | undefined;
        nrp?: string;
        nama?: string;
        jenis_kelamin?: string;
        nomor_hp?: string;
        alamat?: string;
        jurusan?: string;
    };
}