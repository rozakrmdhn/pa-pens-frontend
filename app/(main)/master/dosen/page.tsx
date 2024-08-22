"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Demo } from '@/types';
import { DosenService } from '@/services/service/DosenService';

interface Dosen {
    id?: number;
    nama?: string;
    kelamin?: string;
    email?: string;
    ho_hp: string;
    alamat?: string;
}

const DosenPembimbing = () => {
    const router = useRouter();
    const [dosens, setDosens] = useState<Demo.Dosen[]>([]);
    const [dosen, setDosen] = useState<Dosen>();
    const [deleteDosenDialog, setDeleteDosenDialog] = useState<boolean>(false);

    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
    const header = renderHeader();

    // Action Button
    const actionBodyTemplate = (rowData: Dosen) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" outlined className="mr-2" onClick={() => editDosen(rowData)} />
                <Button icon="pi pi-trash" outlined severity="danger" onClick={() => confirmDeleteDosen(rowData)} />
            </React.Fragment>
        );
    };

    const editDosen = (dosen: Dosen) => {
        console.log({ ...dosen });
    };

    const confirmDeleteDosen = (dosen: Dosen) => {
        setDosen(dosen);
        setDeleteDosenDialog(true);
        console.log({ ...dosen })
    };

    useEffect(() => {
        // directory : services/service/DosenService
        DosenService.getDosen().then((data) => {
            setDosens(getData(data));
            setLoading(false);
        });

        initFilters();
    }, []);

    const getData = (data: Demo.Dosen[]) => {
        return [...(data || [])].map((d) => {
            return d;
        });
    };

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
                            header="Name" 
                            filter
                            style={{ minWidth: '12rem' }} />
                        <Column 
                            field="kelamin"
                            header="Kelamin"
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
                            field="no_hp" 
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
                </div>
            </div>
        </div>
    );
};

export default DosenPembimbing;