"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { DosenService } from '@/services/service/DosenService';
import { Demo, Master, Magang } from '@/types';

const Dosen = () => {
    let emptyDosen: Master.Dosen = {
        id: '',
        nip: '',
        nama: '',
        jenis_kelamin: '',
        email: '',
        nomor_hp: '',
        alamat: ''
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const isLoaded = useRef(false);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dosens, setDosens] = useState<Master.Dosen[]>([]);
    const [dosen, setDosen] = useState<Master.Dosen>(emptyDosen);

    // Dialog
    const [deleteDosenDialog, setDeleteDosenDialog] = useState(false);
    const [dosenDialog, setDosenDialog] = useState(false);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Master Data' },
        { label: 'Dosen', command: () => router.push('/master/dosen') }
    ];

    // Default Value Option
    const genderOptions = [
        { label: 'Laki-Laki', value: 'Laki-Laki' },
        { label: 'Perempuan', value: 'Perempuan' }
    ];

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setDosen({ ...dosen, [field]: value });
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
        setDosen(emptyDosen);
        setSubmitted(false);
        setDosenDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDosenDialog(false);
    };

    const hideDeleteDosenDialog = () => {
        setDeleteDosenDialog(false);
    };

    const confirmDeleteDosen = (dosen: Master.Dosen) => {
        setDosen({ ...dosen });
        setDeleteDosenDialog(true);
    };

    const editDosen = (dosen: Master.Dosen) => {
        setDosen({ ...dosen });
        setDosenDialog(true);
    };

    const getData = (data: Master.Dosen[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const fetchDosen = async () => {
        if (isLoaded) {
            try {
                await DosenService.getDosen().then((data) => {
                    setDosens(getData(data));
                    setLoading(false);
                });
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Create or Update
    const saveDosen = async () => {
        setSubmitted(true);
        if (dosen.nama?.trim()) {
            try {
                if (dosen.id) {
                    // Endpoint : api/dosen/{id}
                    const result = await DosenService.updateDosen(dosen.id, dosen);  // Update API call
                    toast.current?.show({ severity: result.status, summary: 'Updated', detail: result.message, life: 3000 });
                    if (result.status === 'success') {
                        fetchDosen();
                        setDosenDialog(false);
                    }
                } else {
                    // Endpoint : api/dosen
                    const result = await DosenService.createDosen(dosen);  // Create API call
                    toast.current?.show({ severity: result.status, summary: 'Created', detail: result.message, life: 3000 });
                    if (result.status === 'success') {
                        fetchDosen();
                        setDosenDialog(false);
                    }
                }
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Failed to save data';
                const errorMessages = error?.response?.data?.errors || errorMessage;
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessages, life: 3000 });
                setDosenDialog(true);
            }
        }
    };

    // Delete Data
    const deleteDosen = async () => {
        try {
            if (dosen.id) {
                const result = await DosenService.deleteDosen(dosen.id);
                setDosens(dosens.filter(d => d.id !== dosen.id));
                toast.current?.show({ severity: result.status, summary: 'Success', detail: result.message, life: 3000 });
            }
            setDeleteDosenDialog(false);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    const reloadTable = () => {
        fetchDosen();
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
                <Button icon="pi pi-pencil" outlined className="mr-2" size="small" onClick={() => editDosen(rowData)} />
                <Button icon="pi pi-trash" outlined severity="danger" size="small" onClick={ () => confirmDeleteDosen(rowData) } />
            </React.Fragment>
        );
    };
    // Action Button for Create/Update Dialog
    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hideDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={saveDosen} />
        </div>
    );
    // Action Button for Delete Dialog
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" size="small" text onClick={hideDeleteDosenDialog} />
            <Button label="Yes" icon="pi pi-check" size="small" text onClick={deleteDosen} />
        </>
    );

    useEffect(() => {
        if (!isLoaded.current) {
            fetchDosen();
            isLoaded.current = true;
        }
        initFilters();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Data Dosen</h5>
                </div>
                <div className="card p-3">
                <Toast ref={toast} />
                <ConfirmDialog />
                <DataTable
                    ref={dt}
                    value={dosens}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
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
                            field="nip" 
                            header="NIP" 
                            filterMenuStyle={{ width: '14rem' }} 
                            style={{ minWidth: '12rem' }} 
                            sortable  />
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
                            alignHeader="center" 
                            bodyClassName="text-center" 
                            header="Actions" 
                            body={actionBodyTemplate} 
                            style={{ width: '9rem', minWidth: '9rem' }} />
                    </DataTable>

                    <Dialog visible={dosenDialog} header={dosen.id ? "Edit Dosen" : "New Dosen"} style={{ width: '450px' }} modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                        <div className='field'>
                            <label htmlFor="nip">NIP</label>
                            <InputText id='nip' value={dosen.nip || ''} onChange={(e) => handleInputChange(e, 'nip')} />
                            {submitted && !dosen.nip && <small id="nip-help" className="p-error">NIP is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nama">Nama</label>
                            <InputText id="nama" autoComplete="off" aria-describedby="nama-help" required value={dosen.nama || ''} onChange={(e) => handleInputChange(e, 'nama')} />
                            {submitted && !dosen.nama && <small id="nama-help" className="p-error">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                            <Dropdown id="jenis_kelamin" value={dosen.jenis_kelamin} options={genderOptions} onChange={(e) => handleInputChange(e, 'jenis_kelamin')} placeholder="Select Gender" />
                            {submitted && !dosen.jenis_kelamin && <small id="jenis_kelamin-help" className="p-error">Gender is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" autoComplete="off" value={dosen.email || ''} onChange={(e) => handleInputChange(e, 'email')} />
                            {submitted && !dosen.email && <small id="email-help" className="p-error">Email is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nomor_hp">Nomor HP</label>
                            <InputText id="nomor_hp" autoComplete="off" value={dosen.nomor_hp || ''} onChange={(e) => handleInputChange(e, 'nomor_hp')} />
                            {submitted && !dosen.nomor_hp && <small id="nomor_hp-help" className="p-error">Phone is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="alamat">Alamat</label>
                            <InputText id="alamat" autoComplete="off" value={dosen.alamat || ''} onChange={(e) => handleInputChange(e, 'alamat')} />
                            {submitted && !dosen.alamat && <small id="alamat-help" className="p-error">Address is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDosenDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDosenDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dosen && (
                                <span>
                                    Are you sure you want to delete <b>{dosen.nama}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Dosen;