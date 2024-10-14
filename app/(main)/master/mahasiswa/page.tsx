"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { MahasiswaService } from '@/services/service/MahasiswaService';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Demo, Master, Magang } from '@/types';

const Mahasiswa = () => {
    useEffect(() => {
        fetchMahasiswa();
        initFilters();
    }, []);

    let emptyMahasiswa: Master.Mahasiswa = {
        id: '',
        nrp: '',
        nama: '',
        jenis_kelamin: '',
        nomor_hp: '',
        alamat: '',
        jurusan: '',
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [mahasiswas, setMahasiswas] = useState<Master.Dosen[]>([]);
    const [mahasiswa, setMahasiswa] = useState<Master.Mahasiswa>(emptyMahasiswa);

    // Dialog
    const [deleteMahasiswaDialog, setDeleteMahasiswaDialog] = useState(false);
    const [mahasiswaDialog, setMahasiswaDialog] = useState(false);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Master Data' },
        { label: 'Mahasiswa', command: () => router.push('/master/mahasiswa') }
    ];

    // Default Value Option
    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setMahasiswa({ ...mahasiswa, [field]: value });
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
    };
    const clearFilter = () => {
        initFilters();
    };
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters };
        (_filters1['global'] as any).value = value;

        setFilters(_filters1);
        setGlobalFilterValue(value);
    };
    const openNew = () => {
        setMahasiswa(emptyMahasiswa);
        setSubmitted(false);
        setMahasiswaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMahasiswaDialog(false);
    };

    const hideDeleteMahasiswaDialog = () => {
        setDeleteMahasiswaDialog(false);
    };

    const confirmDeleteMahasiswa = (dosen: Master.Dosen) => {
        setMahasiswa({ ...dosen });
        // console.log(dosen);
        setDeleteMahasiswaDialog(true);
    };

    const editMahasiswa = (dosen: Master.Dosen) => {
        setMahasiswa({ ...dosen });
        // console.log(dosen);
        setMahasiswaDialog(true);
    };

    const reloadTable = () => {
        fetchMahasiswa();
    };

    const getData = (data: Master.Mahasiswa[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const fetchMahasiswa = async () => {
        try {
            await MahasiswaService.getMahasiswa().then((data) => {
                setMahasiswas(getData(data));
                setLoading(false);
            });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Delete Data
    const deleteMahasiswa = async () => {
        try {
            if (mahasiswa.id) {
                await MahasiswaService.deleteMahasiswa(mahasiswa.id);
                setMahasiswas(mahasiswas.filter(d => d.id !== mahasiswa.id));
                toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Mahasiswa deleted successfully', life: 3000 });
            }
            setDeleteMahasiswaDialog(false);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete data', life: 3000 });
        }
    };

    // Create or Update
    const saveMahasiswa = async () => {
        setSubmitted(true);
        if (mahasiswa.nama?.trim()) {
            try {
                if (mahasiswa.id) {
                    await MahasiswaService.updateMahasiswa(mahasiswa.id, mahasiswa);  // Update API call
                    toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Mahasiswa updated successfully', life: 3000 });
                } else {
                    await MahasiswaService.createMahasiswa(mahasiswa);  // Create API call
                    toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Mahasiswa created successfully', life: 3000 });
                }
                fetchMahasiswa();  // Re-fetch the updated list
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save Mahasiswa', life: 3000 });
            } finally {
                setMahasiswaDialog(false);
            }
        }
    };

    // Header Search, Refresh, and Add Button
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pencarian" style={{ width: '92%' }} />
                    </span>
                </div>
                <div>
                    <Button icon="pi pi-plus" rounded onClick={openNew} />
                </div>
            </div>
        );
    };
    const header = renderHeader();
    // Action Button
    const actionBodyTemplate = (rowData: Master.Dosen) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" outlined className="mr-2" size="small" onClick={() => editMahasiswa(rowData)} />
                <Button icon="pi pi-trash" outlined severity="danger" size="small" onClick={ () => confirmDeleteMahasiswa(rowData) } />
            </React.Fragment>
        );
    };
    // Action Button for Create/Update Dialog
    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hideDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={saveMahasiswa} />
        </div>
    );
    // Action Button for Delete Dialog
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" size="small" text onClick={hideDeleteMahasiswaDialog} />
            <Button label="Yes" icon="pi pi-check" size="small" text onClick={deleteMahasiswa} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
            <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Data Mahasiswa</h5>
                </div>
                <div className="card p-3">
                    <Toast ref={toast} />
                    <ConfirmDialog />
                    <DataTable
                        ref={dt}
                        value={mahasiswas}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="No data found."
                        header={header}
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
                                />
                            </div>
                        } >
                        <Column
                            field='nrp'
                            header='NRP' />
                        <Column
                            field="nama" 
                            header="Nama" 
                            filter
                            sortable
                            style={{ minWidth: '12rem' }} />
                        <Column 
                            field="jenis_kelamin"
                            header="Jenkel"
                            bodyClassName="text-center" 
                            style={{ minWidth: '8rem' }} 
                            sortable  />
                        <Column 
                            field="nomor_hp" 
                            header="Nomor HP" 
                            showFilterMatchModes={false} 
                            style={{ minWidth: '10rem' }} 
                            sortable  />
                        <Column 
                            field="alamat" 
                            header="Alamat" 
                            style={{ minWidth: '12rem' }} 
                            sortable />
                        <Column 
                            field="jurusan" 
                            header="Jurusan" 
                            style={{ minWidth: '12rem' }} 
                            sortable />
                        <Column 
                            alignHeader="center" 
                            bodyClassName="text-center" 
                            header="Actions"
                            body={actionBodyTemplate} 
                            style={{ width: '9rem', minWidth: '9rem' }} />
                    </DataTable>

                    <Dialog visible={mahasiswaDialog} header={mahasiswa.id ? "Edit Mahasiswa" : "New Mahasiswa"} style={{ width: '450px' }} modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nrp">NRP</label>
                            <InputText id="nrp" autoComplete="off" value={mahasiswa.nrp || ''} onChange={(e) => handleInputChange(e, 'nrp')} />
                        </div>
                        <div className="field">
                            <label htmlFor="nama">Nama</label>
                            <InputText id="nama" autoComplete="off" aria-describedby="nama-help" required value={mahasiswa.nama || ''} onChange={(e) => handleInputChange(e, 'nama')} />
                            {submitted && !mahasiswa.nama && <small id="nama-help" className="p-error">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                            <Dropdown id="jenis_kelamin" value={mahasiswa.jenis_kelamin} options={genderOptions} onChange={(e) => handleInputChange(e, 'jenis_kelamin')} placeholder="Select Gender" />
                        </div>
                        <div className="field">
                            <label htmlFor="nomor_hp">Nomor HP</label>
                            <InputText id="nomor_hp" autoComplete="off" value={mahasiswa.nomor_hp || ''} onChange={(e) => handleInputChange(e, 'nomor_hp')} />
                        </div>
                        <div className="field">
                            <label htmlFor="alamat">Alamat</label>
                            <InputText id="alamat" autoComplete="off" value={mahasiswa.alamat || ''} onChange={(e) => handleInputChange(e, 'alamat')} />
                        </div>
                        <div className="field">
                            <label htmlFor="jurusan">Jurusan</label>
                            <InputText id="jurusan" autoComplete="off" value={mahasiswa.jurusan || ''} onChange={(e) => handleInputChange(e, 'jurusan')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMahasiswaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteMahasiswaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {mahasiswa && (
                                <span>
                                    Are you sure you want to delete <b>{mahasiswa.nama}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Mahasiswa;