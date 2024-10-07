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
import { MagangService } from '@/services/service/MagangService';
import { Toast } from 'primereact/toast';

type Daftar = {
    id?: string | undefined;
    lama_kp?: string;
    tempat_kp?: string;
    alamat?: string;
    kota?: string;
    mahasiswa?: {
        nama?: string;
    };
    dosen?: {
        nama?: string;
    };
};

interface InputValue {
    name: string;
    code: string;
};

const FormPendaftaran = () => {
    let emptyDaftar: Daftar = {
        id: '',
        lama_kp: '',
        tempat_kp: '',
        alamat: '',
        kota: ''
    };

    const router = useRouter();
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const [daftar, setDaftar] = useState<Daftar>(emptyDaftar);
    const [isEditMode, setIsEditMode] = useState(false);

    const [multiselectValue, setMultiselectValue] = useState(null);
    const [dropdownSelectedTA, setDropdownSelectedTA] = useState(null);

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setDaftar({ ...daftar, [field]: value });
    };

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

    const multiselectValues: InputValue[] = [
        { name: "M. Arif Nur Rohman", code: "AU" },
        { name: "M. Arif Rahman Hadi", code: "BR" },
        { name: "Ahmad Dwi Alfian", code: "CN" },
        { name: "Aditya Putra Irfandi", code: "EG" }
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

    const itemTemplate = (option: InputValue) => {
        return (
            <div className="flex align-items-center">
                <span className="ml-2">{option.name}</span>
            </div>
        );
    };

    const savePendaftaran = async () => {
        console.log(daftar);
        try {
            if (daftar.id) {
                await MagangService.updatePengajuan(daftar.id, daftar);
                toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Data updated successfully', life: 3000 });
            } else {
                await MagangService.createPengajuan(daftar);
                toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Data created successfully', life: 3000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save data', life: 3000 });
        }
    };

    const loadPengajuan = async (id: string) => {
        try {
            const pengajuan = await MagangService.getPengajuanById(id);
            setDaftar(pengajuan.data);
            setIsEditMode(true);  // We're in edit mode
            console.log(pengajuan.data);
        } catch (error) {
            console.error('Failed to load pengajuan data', error);
        }
    };

    useEffect(() => {
        if (id) {
            // If an ID exists in the URL, load the pengajuan for editing
            loadPengajuan(id);
        }
    }, [id]);

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
                            <div className="col-12 md:col-6">
                                <InputText id='kota' value={daftar?.kota} type='text' onChange={(e) => handleInputChange(e, 'kota')} />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="waktu" className="col-12 mb-2 md:col-2 md:mb-0">Waktu</label>
                            <div className="col-12 md:col-3">
                                <InputText id='waktu' type='text' placeholder='Bulan' />
                            </div>
                            <div className="col-12 md:col-3">
                                <InputText id='waktu' type='text' placeholder='Tahun' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="dosbing" className="col-12 mb-2 md:col-2 md:mb-0">Dosen Pembimbing</label>
                            <div className="col-12 md:col-10">
                                {daftar?.dosen?.nama}
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="sts_persetujuan" className="col-12 mb-2 md:col-2 md:mb-0">Status Persetujuan</label>
                            <div className="col-12 md:col-10">
                                <Badge value="Disetujui" severity='success'></Badge>
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
                        <div className="field grid">
                            <label htmlFor="catatan_koordkp" className="col-12 mb-2 md:col-2 md:mb-0">Anggota Kelompok</label>
                            <div className="col-12 md:col-6">
                                <MultiSelect
                                    value={multiselectValue}
                                    onChange={(e) => setMultiselectValue(e.value)}
                                    options={multiselectValues}
                                    itemTemplate={itemTemplate}
                                    optionLabel="name"
                                    placeholder="Pilih Anggota"
                                    filter
                                    className="multiselect-custom"
                                    display="chip"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='field grid'>
                        <div className='md:col-2'></div>
                        <div className='md:col-6'>
                            <Button label="Batal" icon="pi pi-times" size="small" className="p-button-text mr-2" />
                            <Button label="Simpan" icon="pi pi-check" size="small" onClick={savePendaftaran} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPendaftaran;