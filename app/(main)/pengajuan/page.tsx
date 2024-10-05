"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { MahasiswaService } from '@/services/service/MahasiswaService';
import { Demo } from '@/types';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import Link from 'next/link';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { MagangService } from '@/services/service/MagangService';

type Daftar = {
    id?: string | undefined;
    lama_kp?: string;
    tempat_kp?: string;
    alamat?: string;
    kota?: string;
};

const Pengajuan = () => {
    const router = useRouter();
    const [pengajuan, setPengajuan] = useState<Daftar[]>([]);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dropdownSelectedTA, setDropdownSelectedTA] = useState(null);
    const menu = useRef<Menu>(null);
    
    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') }
    ];

    const getData = (data: Daftar[]) => {
        return [...(data || [])].map((d) => {
            // d.date = new Date('04-10-2024');
            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

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
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pencarian" />
                    </span>
                    <Button type="button" className="ml-2" severity="secondary" icon="pi pi-filter-slash" size="small" outlined onClick={clearFilter} />
                </div>
                <Button icon="pi pi-plus" rounded onClick={() => router.push('/pengajuan/pendaftaran')} />
            </div>
        );
    };

    useEffect(() => {
        MagangService.getPengajuan().then((data) => {
            setPengajuan(getData(data));
            setLoading(false);
        });

        initFilters();
    }, []);

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };
    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };
    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };
    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };
    const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        menu.current?.toggle(event);
    };
    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        
    };

    const overlayMenuItems = (rowData: any) => [
        {
            label: 'Ubah Usulan',
            icon: 'pi pi-pencil',
            command: () => router.push(`/pengajuan/pendaftaran/${rowData.id}`)
        },
        {
            label: 'Verifikasi',
            icon: 'pi pi-pencil'
        },
        {
            label: 'Monitoring',
            icon: 'pi pi-desktop',
            command: () => router.push('/monitoring')
        },
        {
            label: 'Logbook',
            icon: 'pi pi-file-edit',
            command: () => router.push('/logbook')
        },
        {
            label: 'Ploting Dosbing',
            icon: 'pi pi-user-plus'
        }
    ];
    // Default Value Option
    const dropdownTAValues = [
        { label: '2024/2025', value: '2024' },
    ];
    const header = renderHeader();
    // Action Button
    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Menu ref={menu} model={overlayMenuItems(rowData)} popup />
                <Button type="button" label="Opsi" icon="pi pi-angle-down" size="small" outlined onClick={toggleMenu} style={{ width: 'auto' }} />
            </React.Fragment>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 pb-1">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Pengajuan KP</h5>
                    <Dropdown 
                        id="jenis_kelamin" 
                        value={dropdownSelectedTA} 
                        options={dropdownTAValues} 
                        onChange={(e) => setDropdownSelectedTA(e.value)}
                        placeholder='Tahun Ajaran' />
                </div>
                <div className="card p-3">
                <DataTable
                    value={pengajuan}
                    paginator
                    className="p-datatable-gridlines"
                    showGridlines
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    emptyMessage="No customers found."
                    header={header} >
                        <Column
                            field="lama_kp"
                            header="Lama KP" />
                        <Column
                            field="mahasiswa.nrp"
                            header="NRP" />
                        <Column 
                            field="mahasiswa.nama" 
                            header="Nama" 
                            filter 
                            filterPlaceholder="Search by name" 
                            style={{ minWidth: '12rem' }} />
                        <Column
                            field="tempat_kp"
                            header="Tempat KP" />
                        <Column 
                            field="" 
                            header="Status" 
                            filterMenuStyle={{ width: '12rem' }} 
                            style={{ minWidth: '10rem' }} 
                            body={statusBodyTemplate} 
                            filter 
                            filterElement={statusFilterTemplate} />
                        <Column
                            header="Actions"
                            style={{ minWidth: '7rem', width: '7rem' }}
                            alignHeader="center"
                            bodyClassName="text-center"
                            body={actionBodyTemplate}
                            />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Pengajuan;