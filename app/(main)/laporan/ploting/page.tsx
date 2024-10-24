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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { DosenService } from '@/services/service/DosenService';
import { Demo, Master, Magang } from '@/types';

const Dosen = () => {
    useEffect(() => {
        loadDosenList();
        initFilters();
    }, []);

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [dosens, setDosens] = useState<Master.Dosen[]>([]);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Laporan' },
        { label: 'Ploting Dosen', command: () => router.push('/ploting') }
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

    const getData = (data: Master.Dosen[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const loadDosenList = async () => {
        try {
            await DosenService.plotingDosenList().then((data) => {
                setDosens(getData(data));
                setLoading(false);
            });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const reloadTable = () => {
        loadDosenList();
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
            </div>
        );
    };
    const header = renderHeader();

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
                            style={{ width: '12rem' }} 
                            sortable />
                        <Column 
                            field="nama" 
                            header="Nama" 
                            sortable
                            style={{ minWidth: '12rem' }} />
                        <Column 
                            field="jumlah_mitra"
                            header="Jumlah Mitra"
                            alignHeader='center'
                            bodyClassName="text-center" 
                            style={{ width: '10rem' }} 
                            sortable />
                        <Column 
                            field="jumlah_mahasiswa" 
                            header="Mahasiswa"
                            alignHeader='center'
                            bodyClassName="text-center" 
                            style={{ width: '10rem' }} 
                            sortable />
                    </DataTable>

                </div>
            </div>
        </div>
    );
};

export default Dosen;