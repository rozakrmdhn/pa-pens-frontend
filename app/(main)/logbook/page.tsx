"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Demo, Master, Magang } from '@/types';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { LogbookService } from '@/services/service/LogbookService';
import { AnggotaService } from '@/services/service/AnggotaService';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Logbook = () => {
    let emptyLogbook: Magang.Logbook = {
        id: '',
        id_anggota: '',
        tanggal: new Date(),
        jam_mulai: '',
        jam_selesai: '',
        kegiatan: '',
        kesesuaian_matkul_diajarkan: 0,
        matkul_diajarkan: '',
        setujui_logbook: 0,
        lampiran_laporan: '',
        lampiran_foto: '',
        catatan_pembimbing: ''
    };

    let emptySelected: Magang.Anggota = {
        id_mahasiswa: '',
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const menu = useRef<Menu>(null);

    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});

    // const [logbook, setLogbook] = useState<Magang.Logbook>(emptyLogbook);
    const [logbooks, setLogbooks] = useState<Magang.Logbook[]>([]);
    const [anggotas, setAnggotas] = useState<Magang.Anggota[]>([]);
    const [dropdownMahasiswa, setDropdownMahasiswa] = useState<Magang.Anggota | null>(null);
    const [selectedAnggota, setSelectedAnggota] = useState<Magang.Anggota>(emptySelected);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Logbook', command: () => router.push('/logbook') }
    ];
    // Dropdown
    const dropdownOptions = anggotas.map((data) => ({
        label: data.mahasiswa?.nama,
        value: data.id_mahasiswa
    }));

    const handleDropdownChange = (e: any) => {
        const selected = e.value;
        setDropdownMahasiswa(selected); // Update the selected mahasiswa
        setSelectedAnggota({ 
            id_mahasiswa: selected,
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button label='Logbook' icon="pi pi-pencil" />
            </div>
        );
    };
    const header = renderHeader();

    const loadAnggota = async () => {
        try {
            // Endpoint : api/magang/anggota
            const result = await AnggotaService.getAllAnggota();
            setAnggotas(result);
        } catch (error) {
            console.log('Failed to load data', error);
        }
    };

    const getData = (data: Magang.Logbook[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };
    const loadLogbookMahasiswa = useCallback(async () => {
        try {
            // Endpoint : api/logbook/mahasiswa
            const result = await LogbookService.getLogbookMahasiswa(selectedAnggota);
            setLogbooks(getData(result.data));
            toast.current?.show({ severity: result.status, summary: 'Created', detail: result.message, life: 3000 });
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    }, [selectedAnggota]); // Dependency array for selectedAnggota

    useEffect(() => {
        loadAnggota();
        if (selectedAnggota.id_mahasiswa) {
            loadLogbookMahasiswa();
        }
    }, [selectedAnggota, loadLogbookMahasiswa]);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Logbook</h5>
                </div>
                <Toast ref={toast} />
                <div className="card p-3 mb-3">
                    <div className='p-fluid'>
                        <div className='field grid mb-0'>
                        <div className="col-12 md:col-4">
                            <Dropdown
                                id="id_mahasiswa"
                                value={dropdownMahasiswa}
                                options={dropdownOptions}
                                optionLabel="label"
                                onChange={handleDropdownChange}
                                placeholder='Ref Mhs' />
                            </div>
                        </div>
                    </div>
                </div>
                { logbooks.length !== 0 ? (
                <div className='card p-3'>
                    <DataTable
                        ref={dt}
                        value={logbooks}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        filters={filters}
                        responsiveLayout="scroll"
                        emptyMessage="No data found."
                        header={header} >
                        <Column field='tanggal' header='Tanggal' />
                        <Column field='jam_mulai' header='Jam Mulai' />
                        <Column field='jam_selesai' header='Jam Selesai' />
                        <Column field='kegiatan' header='Kegiatan' />
                        <Column field='kesesuaian_matkul_diajarkan' header='Kesesuain Matakuliah' />
                        <Column field='lampiran_laporan' header='File Progres' />
                        <Column header='Actions' />
                    </DataTable>
                </div>
                ) : null }
            </div>
        </div>
    );
};

export default Logbook;