"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Demo, Master, Magang } from '@/types';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { AnggotaService } from '@/services/service/AnggotaService';
import { LogbookService } from '@/services/service/LogbookService';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { AuthService } from '@/services/service/AuthService';

type UserActive = {
    user?: {
        id?: string;
        id_mahasiswa?: string;
        id_dosen?: string;
        role?: string;
    }
};

const Monitoring = () => {
    // Default Property Value State
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
    // -> END

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rows, setRows] = useState(10);
    const menu = useRef<Menu>(null);

    const [userActive, setUserActive] = useState<UserActive>({});

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});

    // setState for Any Data
    const [logbook, setLogbook] = useState<Magang.Logbook>(emptyLogbook);
    const [logbooks, setLogbooks] = useState<Magang.Logbook[]>([]);
    const [anggotas, setAnggotas] = useState<Magang.Anggota[]>([]);

    // setState for Dropdown onChange
    const [dropdownMahasiswa, setDropdownMahasiswa] = useState<Magang.Anggota | null>(null);
    const [selectedAnggota, setSelectedAnggota] = useState<Magang.Anggota>(emptySelected);

    // Dialog Create Logbook State
    const [logbookDialog, setLogbookDialog] = useState(false);

    // Card Logbook State
    const [cardLogbookView, setCardLogbookView] = useState(false);

    // Breadcrumb State
    const [breadcrumbItemName, setBreadcrumbItemName] = useState('');

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Monitoring', command: () => router.push('/monitoring') },
    ];
    if (breadcrumbItemName) {
        breadcrumbItems.push({
            label: breadcrumbItemName
        });
    }
    // -> END

    // Dropdown set customize Value Label
    const dropdownOptions = anggotas.map((data) => ({
        label: data.mahasiswa?.nama,
        value: data.id_mahasiswa
    }));

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setLogbook({ ...logbook, [field]: value });
    };

    // Handle Select Dropdown onChange Event
    const handleDropdownChange = (e: any) => {
        const selectedId = e.value;
        const selectedData = anggotas.find((data) => data.id_mahasiswa === selectedId);
        
        setDropdownMahasiswa(selectedId); // Update the selected mahasiswa
        setSelectedAnggota({ 
            id_mahasiswa: selectedId,
        });
        setBreadcrumbItemName(selectedData?.mahasiswa?.nama || '');
    };

    // on Click Dialog Logbook
    const openNew = (data: Magang.Logbook) => {
        setLogbook({ ...data })
        setLogbookDialog(true);
    };
    // on Hide Dialog Logbook when Submitted
    const hideDialog = () => {
        setLogbookDialog(false);
    };

    // Fetching Data Mahasiswa ref Anggota
    const loadAnggota = async (userActive: any) => {
        let result;
        try {
            if (userActive.user?.role === 'mahasiswa') {
                const mahasiswaId = userActive.user?.id_mahasiswa;
                const query = `?id_mahasiswa=${mahasiswaId}`;
                // Endpoint : api/magang/anggota
                result = await AnggotaService.getAllAnggota(query);
            } else if (userActive.user?.role === 'admin') {
                const query = '';
                result = await AnggotaService.getAllAnggota(query);
            } else {
                const dosenId = userActive.user.id_dosen;
                const query = `?id_dosen=${dosenId}`;
                // Endpoint : api/magang/anggota
                result = await AnggotaService.getAllAnggota(query);
            }

            setAnggotas(result);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    // Mapping Array Value for DataTable
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
            setCardLogbookView(true);
            setLoading(false);

            if (!submitted) {
                toast.current?.show({ severity: result.status, summary: 'Created', detail: result.message, life: 3000 });
            }
        } catch (error: any) {
            setCardLogbookView(false);
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } finally {
            setLoading(false);
        }
    }, [selectedAnggota]); // Dependency array for selectedAnggota

    // Create or Update Monitoring 
    const saveMonitoring = async () => {
        setSubmitted(true);
        if (logbook.catatan_pembimbing?.trim()) {
            try {
                if (logbook.id) {
                    // Endpoint : api/logbook/monitoring/{id}
                    const result = await LogbookService.createLogbookMonitoring(logbook.id, logbook);
                    toast.current?.show({ severity: result.status, summary: 'Updated', detail: result.message, life: 3000 });
                }
                loadLogbookMahasiswa();
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            } finally {
                setLogbookDialog(false);
            }
        }
    };

    useEffect(() => {
        const userActive = AuthService.getCurrentUser();
        setUserActive({ ...userActive });

        if (userActive.user.role === 'admin') {
            loadAnggota(userActive);
            if (selectedAnggota.id_mahasiswa) {
                loadLogbookMahasiswa();
            }
        } else if (userActive.user.role === 'dosen') {
            loadAnggota(userActive);
            if (selectedAnggota.id_mahasiswa) {
                loadLogbookMahasiswa();
            }
        }

    }, [selectedAnggota, loadLogbookMahasiswa]);

    const reloadTable = () => {
        loadLogbookMahasiswa();
    };

    // Action Buttons for Logbook Dialog -> START
    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hideDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={saveMonitoring} />
        </div>
    );
    // -> END

    // Action Buttons DataTable -> START
    const actionBodyTemplate = (rowData: Magang.Logbook) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" label='Catatan' outlined size="small" onClick={() => openNew(rowData)} />
            </React.Fragment>
        );
    };
    // -> END

    const lampiranBodyTemplate = (rowData: Magang.Logbook) => {
        return <Button label='Lihat' size='small' className='p-button-text' />
    };

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Monitoring</h5>
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
                                placeholder='Pilih Mahasiswa' />
                            </div>
                        </div>
                    </div>
                </div>
                { cardLogbookView ? (
                <div className='card p-3'>
                    <DataTable
                        ref={dt}
                        value={logbooks}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey='id'
                        filters={filters}
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="No data found."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        paginatorLeft={
                            <div className="p-d-flex p-ai-center">
                                <Button 
                                    type="button" 
                                    icon="pi pi-refresh" 
                                    className="p-button-text p-ml-2" 
                                    onClick={reloadTable} 
                                    disabled={loading}
                                />
                            </div>
                        }
                        paginatorRight={
                            <div className="p-d-flex p-ai-center">
                                <Dropdown
                                    value={rows}
                                    options={[5, 10, 25]}
                                    onChange={(e) => setRows(e.value)}
                                    style={{ width: '5rem', minWidth: '5rem' }}
                                />
                            </div>
                        } >
                        <Column field='tanggal' header='Tanggal' alignHeader='center' bodyClassName='text-center' style={{ width: '7rem', minWidth: '7rem' }} />
                        <Column field='kegiatan' header='Kegiatan' style={{ width: '50%', minWidth: '50%' }} />
                        <Column field='catatan_pembimbing' header='Catatan Pembimbing' style={{ width: '50%', minWidth: '50%' }} />
                        <Column field='lampiran_laporan' header='File Progres' 
                            alignHeader='center' 
                            bodyClassName='text-center'
                            body={lampiranBodyTemplate}
                            style={{ width: '8rem', minWidth: '8rem' }} />
                        <Column header='Actions' alignHeader='center' bodyClassName='text-center' style={{ width: '10rem', minWidth: '10rem' }}
                            body={actionBodyTemplate} />
                    </DataTable>

                    <Dialog modal visible={logbookDialog} onHide={hideDialog} header='Monitoring' footer={dialogFooter} className='p-fluid' style={{ width: '450px' }}>
                        <div className='field'>
                            <label htmlFor="">Catatan Logbook</label>
                            <InputTextarea 
                                value={logbook.catatan_pembimbing || ''} 
                                id='catatan_pembimbing' 
                                placeholder='Catatan Logbook'
                                onChange={(e) => handleInputChange(e, 'catatan_pembimbing')} />
                        </div>
                    </Dialog>
                </div> ) : null }
            </div>
        </div>
    );
};

export default Monitoring;