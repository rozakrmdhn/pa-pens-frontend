"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Badge } from 'primereact/badge';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Demo, Master, Magang } from '@/types';
import { MahasiswaService } from '@/services/service/MahasiswaService';
import { AnggotaService } from '@/services/service/AnggotaService';
import { MagangService } from '@/services/service/MagangService';
import { WilayahService } from '@/services/service/WilayahService';
import { AuthService } from '@/services/service/AuthService';

type UserActive = {
    user?: {
        id?: string;
        id_mahasiswa?: string;
        id_dosen?: string;
        role?: string;
    }
};

const FormPendaftaran = () => {
    let emptyDaftar: Magang.Daftar = {
        id: '',
        lama_kp: '',
        tempat_kp: '',
        alamat: '',
        provinsi: '',
        kota: '',
        id_mahasiswa: '',
        bulan: 0,
        tahun: 0
    };
    let emptySelectedProvince: Master.Provinces = {
        name: '',
    };
    let emptySelectedRegency: Master.Regencies = {
        province_id: '',
        name: '',
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [daftar, setDaftar] = useState<Magang.Daftar>(emptyDaftar);
    const [isEditMode, setIsEditMode] = useState(false);

    const [userActive, setUserActive] = useState<UserActive>({});

    const [mahasiswas, setMahasiswas] = useState<Master.Mahasiswa[]>([]);
    const [provinces, setProvinces] = useState<Master.Provinces[]>([]);
    const [regencies, setRegencies] = useState<Master.Regencies[]>([]);

    const [dropdownMahasiswa, setDropdownMahasiswa] = useState<Master.Mahasiswa | null>(null);
    
    const [selectedProvince, setSelectedProvince] = useState<Master.Provinces>(emptySelectedProvince);
    const [selectedRegency, setSelectedRegency] = useState<Master.Regencies>(emptySelectedRegency);

    const [dropdownSelectedTA, setDropdownSelectedTA] = useState(null);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') },
        { 
            label: isEditMode ? 'Edit Pendaftaran' : 'Pendaftaran', 
            command: () => router.push('/pengajuan/pendaftaran')
        }
    ];

    // Default Value Option
    const dropdownTAValues = [
        { label: '2024/2025', value: '2024' },
    ];

    // Default Value Option
    const dropdownKPValues = [
        { label: 'KP 3 Bulan Pertama', value: 'KP3Pertama' },
        { label: 'KP 3 Bulan Kedua', value: 'KP3Kedua'},
        { label: 'KP 6 Bulan', value: 'KP6'}
    ];
    // Bulan Value Option
    const dropdownBulanValue = [
        { label: 'Januari', value: 1 },
        { label: 'Februari', value: 2 },
        { label: 'Maret', value: 3 },
        { label: 'April', value: 4 },
        { label: 'Mei', value: 5 },
        { label: 'Juni', value: 6 },
        { label: 'Juli', value: 7 },
        { label: 'Agustus', value: 8 },
        { label: 'September', value: 9 },
        { label: 'Oktober', value: 10 },
        { label: 'November', value: 11 },
        { label: 'Desember', value: 12 },
    ];
    // Tahun Value Option
    const dropdownTahunValue = [
        { label: '2024', value: 2024 },
    ];
    const dropdownOptions = mahasiswas.map((data) => ({
        label: data.nama,
        value: data.id
    }));

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setDaftar({ 
            ...daftar, 
            [field]: value,
            id_mahasiswa: dropdownMahasiswa ? dropdownMahasiswa.toString() : undefined,
            provinsi: selectedProvince.name,
            kota: selectedRegency.name
        });
    };

    const handleDropdownChange = (e: any) => {
        const selectedMahasiswa = e.value;
        setDropdownMahasiswa(selectedMahasiswa); // Update the selected mahasiswa
    };
    const handleDropdownProvinceChange = (e: any) => {
        const selected = e.value;
        setSelectedProvince(selected);
    };
    const handleDropdownRegencyChange = (e: any) => {
        const selected = e.value;
        setSelectedRegency(selected);
    }

    const savePendaftaran = async () => {
        try {
            console.log(daftar);
            // Endpoint : api/magang/pengajuan
            const result = await MagangService.createPengajuan(daftar);
            toast.current?.show({ severity: result.status, summary: 'Created', detail: result.message, life: 3000 });
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to save data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    const loadMahasiswa = async (userActive: any) => {
        let result;
        try {
            if (userActive.user?.role === 'mahasiswa') {
                const mahasiswaId = userActive.user?.id_mahasiswa;
                const query = `?id_mahasiswa=${mahasiswaId}`;
                // Endpoint : api/magang/mahasiswa
                result = await MahasiswaService.getMahasiswa(query);   
            } else {
                const query = '';
                result = await MahasiswaService.getMahasiswa(query);
            }
            setMahasiswas(result);
        } catch (error: any) {
            console.log('Failed to load data', error);
        }
    };
    const loadProvinces = async () => {
        try {
            // Endpoint : api/wilayah/provinces
            const result = await WilayahService.getProvinces();
            setProvinces(result);
        } catch (error) {
            console.log('Failed to load data', error);
        }
    };
    const loadRegencies = useCallback(async () => {
        try {
            // Endpoint : api/wilayah/regencies
            const result = await WilayahService.getRegencies(selectedProvince)
            setRegencies(result);
        } catch (error) {
            
        }
    }, [selectedProvince]);

    useEffect(() => {
        const userActive = AuthService.getCurrentUser();
        setUserActive({ ...userActive });

        loadMahasiswa(userActive);

        loadProvinces();
        if (selectedProvince.id) {
            loadRegencies();
        }
    }, [selectedProvince, loadRegencies]);

    return (
        <div className="grid">
            <div className="col-12 pb-1">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className='flex justify-content-between align-items-center mb-2'>
                    <h5 className='mb-0'>Pendaftaran KP</h5>
                    <Dropdown 
                        id="jenis_kelamin" 
                        value={dropdownSelectedTA} 
                        options={dropdownTAValues} 
                        onChange={(e) => setDropdownSelectedTA(e.value)}
                        placeholder='Tahun Ajaran' />
                </div>
                <Toast ref={toast} />
                <div className="card p-3">
                    <div className='p-fluid'>
                        <div className="field grid">
                            <label htmlFor="lama_kp" className="col-12 mb-2 md:col-2 md:mb-0">Nama</label>
                            <div className="col-12 md:col-5">
                                <Dropdown
                                    id="id_mahasiswa"
                                    value={dropdownMahasiswa}
                                    options={dropdownOptions}
                                    optionLabel="label"
                                    onChange={handleDropdownChange}
                                    placeholder='Pilih Mahasiswa' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="lama_kp" className="col-12 mb-2 md:col-2 md:mb-0">Lama KP</label>
                            <div className="col-12 md:col-5">
                                <Dropdown
                                    id="lama_kp"
                                    value={daftar?.lama_kp}
                                    options={dropdownKPValues}
                                    onChange={(e) => handleInputChange(e, 'lama_kp')}
                                    placeholder='Pilih Lama KP' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="tempat_kp" className="col-12 mb-2 md:col-2 md:mb-0">Tempat/Lokasi/Judul KP</label>
                            <div className="col-12 md:col-6">
                                <InputText id='tempat_kp' value={daftar?.tempat_kp} type='text' onChange={(e) => handleInputChange(e, 'tempat_kp')} />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="alamat" className="col-12 mb-2 md:col-2 md:mb-0">Alamat KP</label>
                            <div className="col-12 md:col-10">
                                <InputTextarea id='alamat' value={daftar?.alamat} rows={3} onChange={(e) => handleInputChange(e, 'alamat')} />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="kota" className="col-12 mb-2 md:col-2 md:mb-0">Kota</label>
                            <div className="col-12 md:col-3">
                                <Dropdown
                                    id='provinsi' 
                                    value={selectedProvince} 
                                    options={provinces}
                                    optionLabel='name'
                                    onChange={handleDropdownProvinceChange}
                                    placeholder='Pilih Provinsi'
                                    filter />
                            </div>
                            <div className="col-12 md:col-3">
                                <Dropdown
                                    id='kota' 
                                    value={selectedRegency} 
                                    options={regencies}
                                    optionLabel='name'
                                    onChange={handleDropdownRegencyChange}
                                    placeholder='Pilih Kabupaten'
                                    filter />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="waktu" className="col-12 mb-2 md:col-2 md:mb-0">Waktu</label>
                            <div className="col-12 md:col-3">
                                <Dropdown 
                                    id="bulan" 
                                    value={daftar?.bulan} 
                                    options={dropdownBulanValue}
                                    optionLabel='label'
                                    onChange={(e) => handleInputChange(e, 'bulan')}
                                    placeholder='Bulan' />
                            </div>
                            <div className="col-12 md:col-3">
                                <Dropdown 
                                    id="tahun" 
                                    value={daftar?.tahun} 
                                    options={dropdownTahunValue} 
                                    onChange={(e) => handleInputChange(e, 'tahun')}
                                    placeholder='Tahun' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="dosbing" className="col-12 mb-2 md:col-2 md:mb-0">Dosen Pembimbing</label>
                            <div className="col-12 md:col-10">
                                -
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="sts_persetujuan" className="col-12 mb-2 md:col-2 md:mb-0">Status Persetujuan</label>
                            <div className="col-12 md:col-10">
                                -
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="sts_dokumen" className="col-12 mb-2 md:col-2 md:mb-0">Status Dokumen</label>
                            <div className="col-12 md:col-10">
                                -
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="catatan_koordkp" className="col-12 mb-2 md:col-2 md:mb-0">Catatan Koordinator KP</label>
                            <div className="col-12 md:col-10">
                                -
                            </div>
                        </div>
                    </div>
                    <div className='field grid'>
                        <div className='md:col-2'></div>
                        <div className='md:col-6'>
                            <Button label="Batal" severity='secondary' icon="pi pi-times" size="small" className="mr-2" outlined />
                            <Button label="Simpan" icon="pi pi-check" size="small" onClick={savePendaftaran} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPendaftaran;