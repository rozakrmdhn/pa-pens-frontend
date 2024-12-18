/* Types */
declare namespace Master {

    // AuthService
    type Auth = {
        email?: string;
        password?: string;
    };

    // UserService
    type User = {
        id?: string | undefined;
        email?: string;
        password?: string;
        role?: string;
        id_mahasiswa?: string;
        id_dosen?: string;
    };
    
    // DosenService
    type Dosen = {
        id?: string | undefined;
        nip?: string;
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
    type Sebaran = {
        provinsi?: string;
        kota?: string;
        jumlah_mahasiswa?: string;
    }

    // WilayahService
    type Provinces = {
        id?: string | undefined;
        name?: string;
    };
    type Regencies = {
        id?: string | undefined;
        province_id?: string | undefined;
        name?: string;
    };
}