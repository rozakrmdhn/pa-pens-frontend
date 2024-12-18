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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Demo, Master, Magang } from '@/types';
import { MahasiswaService } from '@/services/service/MahasiswaService';
import { AnggotaService } from '@/services/service/AnggotaService';
import { MagangService } from '@/services/service/MagangService';
import { WilayahService } from '@/services/service/WilayahService';

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
        tahun: 0,
        catatan_koordinator_kp: ''
    };
    let emptySelectedProvince: Master.Provinces = {
        name: '',
    };
    let emptySelectedRegency: Master.Regencies = {
        province_id: '',
        name: '',
    };

    const router = useRouter();
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const [daftar, setDaftar] = useState<Magang.Daftar>(emptyDaftar);
    const [isEditMode, setIsEditMode] = useState(false);
    const isPengajuanLoaded = useRef(false);

    const [mahasiswas, setMahasiswas] = useState<Master.Mahasiswa[]>([]);

    const [anggotas, setAnggotas] = useState<Magang.Anggota[]>();
    const [anggota, setAnggota] = useState<Magang.Anggota>();

    const [provinces, setProvinces] = useState<Master.Provinces[]>([]);
    const [regencies, setRegencies] = useState<Master.Regencies[]>([]);

    const [selectedMahasiswas, setSelectedMahasiswas] = useState<Master.Mahasiswa[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<Master.Provinces>(emptySelectedProvince);
    const [selectedRegency, setSelectedRegency] = useState<Master.Regencies>(emptySelectedRegency);

    const [dropdownSelectedTA, setDropdownSelectedTA] = useState(null);

    // Dialog Delete Anggota
    const [deleteMahasiswaDialog, setDeleteMahasiswaDialog] = useState(false);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') },
        { label: 'Detail' }
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

    const dropdownProvinces = provinces.map((data) => ({
        label: data.name,
        value: data.name,
        id: data.id
    }));
    const dropdownRegencies = regencies.map((data) => ({
        label: data.name,
        value: data.name,
        id: data.id,
    }));

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setDaftar({ 
            ...daftar, 
            [field]: value
        });
    };
    const handleDropdownProvinceChange = async (e: any) => {
        const selected = e.value; // Get the selected province name
        const selectedProvince = provinces.find(p => p.name === selected);

        setDaftar({ ...daftar, provinsi: selected, kota: '' }); // Reset regency

        setSelectedProvince({
            ...selectedProvince, id: selectedProvince?.id
        });
    };
    const handleDropdownRegencyChange = (e: any) => {
        const selected = e.value;

        setDaftar({ ...daftar, kota: selected });
    }

    const loadPengajuan = async (id: string) => {
        if (isPengajuanLoaded) {
            try {
                // Endpoint : api/magang/pengajuan/{id}
                const result = await MagangService.getPengajuanById(id);
                setDaftar(result.data);
                setIsEditMode(true);
                toast.current?.show({ severity: result.status, summary: 'Created', detail: result.message, life: 3000 });
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Failed to save data';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            }
        }
    };

    const loadAnggota = async (id: string) => {
        try {
            // Endpoint : api/magang/pengajuan/{id}/anggota
            const anggota = await MagangService.getAnggotaByPengajuan(id);
            setAnggotas(anggota.data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to save data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    const loadMahasiswa = async () => {
        try {
            // Endpoint : api/magang/mahasiswa
            const data = await MahasiswaService.getMahasiswa();
            setMahasiswas(data);
        } catch (error) {
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
            console.log('Failed to load data', error);
        }
    }, [selectedProvince]);

    useEffect(() => {
        loadProvinces();
        if (id && !isPengajuanLoaded.current) {
            // If an ID exists in the URL, load the pengajuan for editing
            loadMahasiswa();
            loadPengajuan(id);
            loadAnggota(id);
            isPengajuanLoaded.current = true;
        }
        
        if (selectedProvince.id) {
            loadRegencies();
        }
    }, [id, selectedProvince, loadRegencies]);

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
                            <label htmlFor="dosbing" className="col-12 mb-2 md:col-2 md:mb-0">Nama</label>
                            <div className="col-12 md:col-10">
                                {daftar?.mahasiswa?.nama}
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
                                    placeholder='Pilih Lama KP' disabled />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="tempat_kp" className="col-12 mb-2 md:col-2 md:mb-0">Tempat/Lokasi/Judul KP</label>
                            <div className="col-12 md:col-6">
                                <InputText id='tempat_kp' value={daftar?.tempat_kp} type='text' onChange={(e) => handleInputChange(e, 'tempat_kp')} disabled />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="alamat" className="col-12 mb-2 md:col-2 md:mb-0">Alamat KP</label>
                            <div className="col-12 md:col-10">
                                <InputTextarea id='alamat' value={daftar?.alamat} rows={3} onChange={(e) => handleInputChange(e, 'alamat')} disabled />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="kota" className="col-12 mb-2 md:col-2 md:mb-0">Kota</label>
                            <div className="col-12 md:col-3">
                                <Dropdown
                                    id='provinsi'
                                    value={daftar?.provinsi} 
                                    options={dropdownProvinces}
                                    optionLabel='label'
                                    onChange={handleDropdownProvinceChange}
                                    placeholder='Pilih Provinsi'
                                    filter
                                    disabled />
                            </div>
                            <div className="col-12 md:col-3">
                                { selectedProvince.name !== '' ? (
                                    <Dropdown
                                    id='kota' 
                                    value={daftar?.kota} 
                                    options={dropdownRegencies}
                                    optionLabel='label'
                                    onChange={handleDropdownRegencyChange}
                                    placeholder='Pilih Kabupaten'
                                    disabled={!daftar.provinsi}
                                    filter
                                    aria-disabled />
                                ) : (
                                    <InputText value={daftar.kota} disabled />
                                )}
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
                                    placeholder='Bulan'
                                    disabled />
                            </div>
                            <div className="col-12 md:col-3">
                                <Dropdown 
                                    id="tahun" 
                                    value={daftar?.tahun} 
                                    options={dropdownTahunValue} 
                                    onChange={(e) => handleInputChange(e, 'tahun')}
                                    placeholder='Tahun'
                                    disabled />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="dosbing" className="col-12 mb-2 md:col-2 md:mb-0">Dosen Pembimbing</label>
                            <div className="col-12 md:col-10">
                                {daftar.id_dosen !== null ? (
                                    daftar?.dosen?.nama
                                ) : ( '-' )}
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="status_persetujuan" className="col-12 mb-2 md:col-2 md:mb-0">Status Persetujuan</label>
                            <div className="col-12 md:col-10">
                                {daftar.status_persetujuan === 1 ? (
                                <Badge value="Disetujui" severity="success" /> ) : (
                                <Badge value="Belum Disetujui" severity="warning" /> )}
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="status_dokumen" className="col-12 mb-2 md:col-2 md:mb-0">Status Dokumen</label>
                            <div className="col-12 md:col-10">
                                -
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="catatan_koordkp" className="col-12 mb-2 md:col-2 md:mb-0">Catatan Koordinator KP</label>
                            <div className="col-12 md:col-10">
                                {daftar.status_persetujuan === 0 ? (
                                    <Badge severity='danger' value={daftar.catatan_koordinator_kp} />
                                ) : ( '-' ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card p-3">
                    <DataTable
                        value={anggotas}
                        showGridlines
                        className="p-datatable-gridlines" >
                        <Column
                            field='mahasiswa.nrp'
                            header='NRP'
                            style={{ width: '8rem' }} />
                        <Column
                            field='mahasiswa.nama'
                            header='Nama Mahasiswa' />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default FormPendaftaran;