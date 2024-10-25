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
import { Laporan } from '@/types';
import { MahasiswaService } from '@/services/service/MahasiswaService';

const ReportPage = () => {
    useEffect(() => {
        loadLaporan();
        initFilters();
    }, []);

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rows, setRows] = useState(25);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [laporans, setLaporans] = useState<Laporan.Sebaran[]>([]);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Laporan' },
        { label: 'Sebaran Mahasiswa', command: () => router.push('/sebaran-mahasiswa') }
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

    const getData = (data: Laporan.Sebaran[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

    const loadLaporan = async () => {
        try {
            await MahasiswaService.getSebaranMahasiswa().then((data) => {
                setLaporans(getData(data));
                setLoading(false);
            });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const reloadTable = () => {
        loadLaporan();
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
                    <h5>Sebaran Mahasiswa</h5>
                </div>
                <div className="card p-3">
                <Toast ref={toast} />
                <ConfirmDialog />
                <DataTable
                    ref={dt}
                    value={laporans}
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
                            field="provinsi" 
                            header="Provinsi"
                            style={{ width: '12rem' }} 
                            sortable />
                        <Column 
                            field="kota" 
                            header="Kabupaten/Kota" 
                            sortable
                            style={{ minWidth: '12rem' }} />
                        <Column 
                            field="jumlah_mahasiswa" 
                            header="Jumlah Mahasiswa"
                            alignHeader='center'
                            bodyClassName="text-center" 
                            style={{ width: '12rem' }} 
                            sortable />
                    </DataTable>

                </div>
            </div>
        </div>
    );
};

export default ReportPage;