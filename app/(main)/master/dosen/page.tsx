"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Demo } from '@/types';
import { DosenService } from '@/services/service/DosenService';
import DosenDialog from './dosenDialog';

interface Dosen {
    id?: number;
    nama?: string;
    jenis_kelamin?: string;
    email?: string;
    nomor_hp?: string;
    alamat?: string;
}

const Dosen = () => {
    let emptyDosen: Demo.Dosen = {
        id: '',
        nama: '',
        jenis_kelamin: '',
        email: '',
        nomor_hp: '',
        alamat: ''
    };

    const router = useRouter();
    const toast = useRef(null);
    const selectedDosenId = useRef<number | null>(null);

    const [dosens, setDosens] = useState<Demo.Dosen[]>([]);
    const [dosen, setDosen] = useState<Dosen>();
    const [deleteDosenDialog, setDeleteDosenDialog] = useState<boolean>(false);

    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dosenToEdit, setDosenToEdit] = useState<Dosen | null>(null);

    // Dialog
    const [dosenDialog, setDosenDialog] = useState(false);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Master Data' },
        { label: 'Dosen', command: () => router.push('/master/dosen') }
    ];

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
        setDosenToEdit(null);
        setIsDialogVisible(true);
    };

    const openNewDosen = () => {
        setDosen(emptyDosen);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openEdit = (dosen: Dosen) => {
        setDosenToEdit(dosen);
        setIsDialogVisible(true);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pencarian" />
                </span>
                <Button label="Add" icon="pi pi-plus" onClick={openNew} />
            </div>
        );
    };
    const header = renderHeader();

    // Action Button
    const actionBodyTemplate = (rowData: Dosen) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" outlined className="mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" outlined severity="danger" onClick={ () => confirmDeleteDosen(rowData) } />
            </React.Fragment>
        );
    };

    const accept = async () => {
        if (selectedDosenId.current !== null) {
            try {
                await DosenService.deleteDosen(selectedDosenId.current);
                setDosens(dosens.filter(d => d.id !== selectedDosenId.current));
                toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Dosen deleted successfully', life: 3000 });
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete data', life: 3000 });
            }
        }
    }
    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled the deletion', life: 3000 });
    }
    const confirmDeleteDosen = (dosen: Dosen) => {
        selectedDosenId.current = dosen.id ?? null;
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const editDosen = (dosen: Dosen) => {
        console.log({ ...dosen });
    };

    const fetchDosen = async () => {
        try {
            DosenService.getDosen().then((data) => {
                setDosens(getData(data));
                setLoading(false);
            });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const getData = (data: Demo.Dosen[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const onSave = (dosen: Dosen) => {
        if (dosen.id) {
            setDosens(dosens.map(d => (d.id === dosen.id ? dosen : d)));
        } else {
            setDosens([...dosens, dosen]);
        }
        setIsDialogVisible(false);
    };

    useEffect(() => {
        fetchDosen();
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
                        value={dosens}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="No data found."
                        header={header}
                    >
                        <Column 
                            field="nama" 
                            header="Nama" 
                            filter
                            style={{ minWidth: '12rem' }} />
                        <Column 
                            field="jenis_kelamin"
                            header="Jenkel"
                            bodyClassName="text-center" 
                            style={{ minWidth: '8rem' }} 
                            filter  />
                        <Column 
                            field="email" 
                            header="Email" 
                            filterMenuStyle={{ width: '14rem' }} 
                            style={{ minWidth: '12rem' }} 
                            filter  />
                        <Column 
                            field="nomor_hp" 
                            header="Nomor HP" 
                            showFilterMatchModes={false} 
                            style={{ minWidth: '10rem' }} 
                            filter  />
                        <Column 
                            field="alamat" 
                            header="Alamat" 
                            style={{ minWidth: '12rem' }} 
                            filter />
                        <Column bodyClassName="text-center" header="Actions" body={actionBodyTemplate} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                    <DosenDialog visible={isDialogVisible} onHide={() => setIsDialogVisible(false)} onSave={onSave} dosenData={dosenToEdit} />
                </div>
            </div>
        </div>
    );
};

export default Dosen;