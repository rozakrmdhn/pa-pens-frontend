"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Badge } from 'primereact/badge';
import { MultiSelect } from 'primereact/multiselect';

interface InputValue {
    name: string;
    code: string;
}

const Example = () => {
    const router = useRouter();
    const [multiselectValue, setMultiselectValue] = useState(null);

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        console.log(value);
    };

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-envelope', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') },
        { label: 'Pendaftaran', command: () => router.push('/pengajuan/pendaftaran')}
    ];

    const multiselectValues: InputValue[] = [
        { name: "M. Arif Nur Rohman", code: "AU" },
        { name: "M. Arif Rahman Hadi", code: "BR" },
        { name: "Ahmad Dwi Alfian", code: "CN" },
        { name: "Aditya Putra Irfandi", code: "EG" }
    ];

    // Default Value Option
    const optionsTahunAkademik = [
        { label: '2024/2025', value: '2024' },
    ];

    // Default Value Option
    const optionsLamaKP = [
        { label: 'KP 3 Bulan Pertama', value: 'KP3Pertama' },
        { label: 'KP 3 Bulan Kedua', value: 'KP3Kedua'},
        { label: 'KP 6 Bulan', value: 'KP6'}
    ];

    const itemTemplate = (option: InputValue) => {
        return (
            <div className="flex align-items-center">
                {/* <img
                    alt={option.name}
                    src={`/demo/images/flag/flag_placeholder.png`}
                    onError={(e) =>
                        (e.currentTarget.src =
                            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                    }
                    className={`flag flag-${option.code.toLowerCase()}`}
                    style={{ width: "21px" }}
                /> */}
                <span className="ml-2">{option.name}</span>
            </div>
        );
    };

    useEffect(() => {

    }, []);

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
                        value={null} 
                        options={optionsTahunAkademik} 
                        onChange={(e) => handleInputChange(e, 'tahun')} 
                        placeholder="2024/2025" />
                </div>
                <div className="card p-3">
                    <div className='p-fluid'>
                        <div className="field grid">
                            <label htmlFor="lama_kp" className="col-12 mb-2 md:col-2 md:mb-0">Lama KP</label>
                            <div className="col-12 md:col-2">
                                <Dropdown
                                    id='lama_kp'
                                    value={null}
                                    options={optionsLamaKP}
                                    onChange={(e) => handleInputChange(e, 'lama_kp')} 
                                    placeholder='Pilih Lama KP' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="tempat_kp" className="col-12 mb-2 md:col-2 md:mb-0">Tempat/Lokasi/Judul KP</label>
                            <div className="col-12 md:col-5">
                                <InputText id='tempat_kp' type='text' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="alamat" className="col-12 mb-2 md:col-2 md:mb-0">Alamat KP</label>
                            <div className="col-12 md:col-10">
                                <InputTextarea id='alamat' rows={3} />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="kota" className="col-12 mb-2 md:col-2 md:mb-0">Kota</label>
                            <div className="col-12 md:col-4">
                                <InputText id='kota' type='text' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="waktu" className="col-12 mb-2 md:col-2 md:mb-0">Waktu</label>
                            <div className="col-12 md:col-2">
                                <InputText id='waktu' type='text' placeholder='Bulan' />
                            </div>
                            <div className="col-12 md:col-2">
                                <InputText id='waktu' type='text' placeholder='Tahun' />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="dosbing" className="col-12 mb-2 md:col-2 md:mb-0">Dosen Pembimbing</label>
                            <div className="col-12 md:col-4">
                                <InputText id='dosbing' type='text' disabled />
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="sts_persetujuan" className="col-12 mb-2 md:col-2 md:mb-0">Status Persetujuan</label>
                            <div className="col-12 md:col-4">
                                <Badge value="Disetujui" severity='success'></Badge>
                            </div>
                        </div>
                        <div className="field grid">
                            <label htmlFor="sts_dokumen" className="col-12 mb-2 md:col-2 md:mb-0">Status Dokumen</label>
                            <div className="col-12 md:col-4">
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
                            <div className="col-12 md:col-5">
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
                </div>
            </div>
        </div>
    );
};

export default Example;