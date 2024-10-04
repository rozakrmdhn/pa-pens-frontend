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
import { Demo } from '@/types';
import { DosenService } from '@/services/service/DosenService';

const Dosen = () => {
    useEffect(() => {
        fetchDosen();
        initFilters();
    }, []);

    let emptyDosen: Demo.Dosen = {
        id: '',
        nama: '',
        jenis_kelamin: '',
        email: '',
        nomor_hp: '',
        alamat: ''
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dosens, setDosens] = useState<Demo.Dosen[]>([]);
    const [dosen, setDosen] = useState<Demo.Dosen>(emptyDosen);

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
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
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

    const confirmDeleteDosen = (dosen: Demo.Dosen) => {
        setDosen({ ...dosen });
        // console.log(dosen);
        setDeleteDosenDialog(true);
    };

    const editDosen = (dosen: Demo.Dosen) => {
        setDosen({ ...dosen });
        // console.log(dosen);
        setDosenDialog(true);
    };

    const getData = (data: Demo.Dosen[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const fetchDosen = async () => {
        try {
            await DosenService.getDosen().then((data) => {
                setDosens(getData(data));
                setLoading(false);
            });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };
    
    // Create or Update
    const saveDosen = async () => {
        setSubmitted(true);
        if (dosen.nama?.trim()) {
            try {
                if (dosen.id) {
                    await DosenService.updateDosen(dosen.id, dosen);  // Update API call
                    toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Dosen updated successfully', life: 3000 });
                } else {
                    await DosenService.createDosen(dosen);  // Create API call
                    toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Dosen created successfully', life: 3000 });
                }
                fetchDosen();  // Re-fetch the updated list
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save Dosen', life: 3000 });
            } finally {
                setDosenDialog(false);
            }
        }
    };

    // Delete Data
    const deleteDosen = async () => {
        try {
            if (dosen.id) {
                await DosenService.deleteDosen(dosen.id);
                setDosens(dosens.filter(d => d.id !== dosen.id));
                toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Dosen deleted successfully', life: 3000 });
            }
            setDeleteDosenDialog(false);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete data', life: 3000 });
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
    const actionBodyTemplate = (rowData: Demo.Dosen) => {
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
                    }
                >
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
                            field="email" 
                            header="Email" 
                            filterMenuStyle={{ width: '14rem' }} 
                            style={{ minWidth: '12rem' }} 
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
                        <div className="field">
                            <label htmlFor="nama">Nama</label>
                            <InputText id="nama" autoComplete="off" aria-describedby="nama-help" required value={dosen.nama || ''} onChange={(e) => handleInputChange(e, 'nama')} />
                            {submitted && !dosen.nama && <small id="nama-help" className="p-error">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                            <Dropdown id="jenis_kelamin" value={dosen.jenis_kelamin} options={genderOptions} onChange={(e) => handleInputChange(e, 'jenis_kelamin')} placeholder="Select Gender" />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" autoComplete="off" value={dosen.email || ''} onChange={(e) => handleInputChange(e, 'email')} />
                        </div>
                        <div className="field">
                            <label htmlFor="nomor_hp">Nomor HP</label>
                            <InputText id="nomor_hp" autoComplete="off" value={dosen.nomor_hp || ''} onChange={(e) => handleInputChange(e, 'nomor_hp')} />
                        </div>
                        <div className="field">
                            <label htmlFor="alamat">Alamat</label>
                            <InputText id="alamat" autoComplete="off" value={dosen.alamat || ''} onChange={(e) => handleInputChange(e, 'alamat')} />
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