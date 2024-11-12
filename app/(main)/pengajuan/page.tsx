"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Demo, Master, Magang } from '@/types';
import { DosenService } from '@/services/service/DosenService';
import { MagangService } from '@/services/service/MagangService';
import { AuthService } from '@/services/service/AuthService';

type DropdownOption = { label: string; value: string };

type UserActive = {
    user?: {
        id?: string;
        id_mahasiswa?: string;
        id_dosen?: string;
        role?: string;
    }
};

const Pengajuan = () => {
    useEffect(() => {
        if (!isLoaded.current) {
            const user = AuthService.getCurrentUser();
            setUserActive({ ...user });
            loadPengajuan();
            loadDosen();
            isLoaded.current = true;
        }
        initFilters();
    }, []);


    let emptyDaftar: Magang.Daftar = {
        id: '',
        lama_kp: '',
        tanggal_kp: undefined,
        tempat_kp: '',
        alamat: '',
        kota: '',
        status_persetujuan: 0,
        catatan_koordinator_kp: '',
        id_dosen: ''
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const isLoaded = useRef(false);
    const menu = useRef<Menu>(null);

    const [userActive, setUserActive] = useState<UserActive>({});

    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [pengajuans, setPengajuans] = useState<Magang.Daftar[]>([]);
    const [pengajuan, setPengajuan] = useState<Magang.Daftar>(emptyDaftar);

    const [dropdownDosenValue, setDropdownDosenValue] = useState<DropdownOption[]>([]);

    const [dropdownSelectedTA, setDropdownSelectedTA] = useState(null);

    const [selectedRowData, setSelectedRowData] = useState(null); // State to track the selected row data

    // Verifikasi Dialog
    const [verifikasiDialog, setVerifikasiDialog] = useState(false);
    // Ploting Dosbing Dialog
    const [plotingDialog, setPlotingDialog] = useState(false);

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') }
    ];

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
    };
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters };
        (_filters1['global'] as any).value = value;

        setFilters(_filters1);
        setGlobalFilterValue(value);
    };

    const getData = (data: Magang.Daftar[]) => {
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

    // Open Verifikasi Dialog
    const openVerifikasi = (pengajuan: Magang.Daftar) => {
        setPengajuan({ ...pengajuan});
        setVerifikasiDialog(true);
    };
    // Hide Verifikasi Dialog
    const hideDialog = () => {
        setSubmitted(false);
        setVerifikasiDialog(false);
    };

    // Open Ploting Dosbing
    const openPlotingDosbing = (pengajuan: Magang.Daftar) => {
        setPengajuan({ ...pengajuan });
        setPlotingDialog(true);
    };
    // Hide Ploting Dosbing
    const hidePlotingDialog = () => {
        setSubmitted(false);
        setPlotingDialog(false);
    };

    const dateBodyTemplate = (rowData: Magang.Daftar) => {
        return rowData.tanggal_kp ? formatDate(rowData.tanggal_kp) : '';
    };
    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    const statusBodyTemplate = (rowData: Magang.Daftar) => {
        const statusText = rowData.status_persetujuan === 1 ? 'Disetujui' : 'Belum Disetujui';
        const statusSeverity = rowData.status_persetujuan === 1 ? 'success' : 'warning';

        return <Badge value={statusText} severity={statusSeverity} />;
    };
    const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>, rowData: any) => {
        setSelectedRowData(rowData); // Set the selected row data to be used in the menu
        menu.current?.toggle(event); // Open the menu at the button's position
    };
    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        // Jika field adalah 'status_persetujuan' dan nilainya adalah 1, set catatan_koordinator_kp ke null
        if (field === 'status_persetujuan' && value == 1) {
            setPengajuan({
                ...pengajuan,
                [field]: value,
                catatan_koordinator_kp: '' // Reset catatan jika disetujui
            });
        } else {
            setPengajuan({ 
                ...pengajuan, 
                [field]: value
            });
        }
    };

    // Default Value Option
    const dropdownTAValues = [
        { label: '2024/2025', value: '2024' },
    ];
    const overlayMenuItems = (rowData: any) => [
        ...(rowData?.status_persetujuan === 0 && userActive.user?.role === 'mahasiswa' ? [
            {
                label: 'Ubah Usulan',
                icon: 'pi pi-pencil',
                command: () => router.push(`/pengajuan/pendaftaran/${rowData?.id}`)
            },
        ] : []),
        ...(userActive.user?.role === 'admin' ? [
            {
                label: 'Ubah Usulan',
                icon: 'pi pi-pencil',
                command: () => router.push(`/pengajuan/pendaftaran/${rowData?.id}`)
            },
            {
                label: 'Verifikasi',
                icon: 'pi pi-pencil',
                command: () => openVerifikasi(rowData)
            },
            {
                label: 'Ploting Dosbing',
                icon: 'pi pi-user-plus',
                command: () => openPlotingDosbing(rowData)
            },
        ] : [
            {
                label: 'Detail Usulan',
                icon: 'pi pi-eye',
                command: () => router.push(`/pengajuan/detail/${rowData?.id}`)
            },
        ]),
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
    ];

    const loadPengajuan = async () => {
        const userActive = AuthService.getCurrentUser();
        try {
            // Fetch data based on role
            if (userActive.user.role === 'admin') {
                // Endpoint : api/magang
                await MagangService.getPengajuan().then((data) => {
                    setPengajuans(getData(data));
                    setLoading(false);
                });
            } else if (userActive.user.role === 'mahasiswa') {
                // Endpoint : api/magang/pengajuan/mahasiswa/{id_mahasiswa}
                await MagangService.getPengajuanByMahasiswa(userActive.user.id_mahasiswa).then((data) => {
                    setPengajuans(getData(data));
                    setLoading(false);
                });
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const getDataDosen = (data: Master.Dosen[]) => {
        return (data || []).map((d) => ({
            label: d.nama || '',  // Handle undefined values
            value: d.id || '',    // Handle undefined values
        }));
    };
    const loadDosen = async () => { 
        try {
            // Endpoint : api/magang/dosen
            const data = await DosenService.getDosen();
            setDropdownDosenValue(getDataDosen(data));  // Store transformed data for the dropdown
        } catch (error: any) {
            console.error("Error loading Dosen data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Proses Verifikasi
    const simpanVerifikasi = async () => {
        const userActive = AuthService.getCurrentUser();
        setSubmitted(true);
        try {
            // Ensure that pengajuan.id is defined
            if (!pengajuan?.id) {
                throw new Error('Pengajuan ID is missing');
            }
            // Endpoint : api/magang/pengajuan/{id}/verifikasi
            const result = await MagangService.verifikasiPengajuan(pengajuan.id, pengajuan);
            toast.current?.show({ severity: result.status, summary: 'Updated', detail: result.message, life: 3000 });
            loadPengajuan();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } finally {
            setVerifikasiDialog(false);
        }
    };

    // Proses Ploting Dosen Pembimbing
    const simpanPlotingDosbing = async () => {
        const userActive = AuthService.getCurrentUser();
        setSubmitted(true);
        try {
            // Ensure that pengajuan.id is defined
            if (!pengajuan?.id) {
                throw new Error('Pengajuan ID is missing');
            }
            // Endpoint : api/magang/pengajuan/{id}/ploting
            const result = await MagangService.plotingDosbim(pengajuan.id, pengajuan);
            toast.current?.show({ severity: result.status, summary: 'Updated', detail: result.message, life: 3000 });
            loadPengajuan();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } finally {
            setPlotingDialog(false);
        }
    };
    
    // Action Button
    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Menu ref={menu} model={overlayMenuItems(selectedRowData)} popup />
                <Button 
                    type="button" 
                    label="Opsi" 
                    icon="pi pi-angle-down" 
                    size="small" 
                    outlined 
                    onClick={(e) => toggleMenu(e, rowData)}
                    style={{ width: 'auto' }} />
            </React.Fragment>
        );
    };

    // Footer Button for Verifikasi
    const dialogFooterVerifikasi = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hideDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={simpanVerifikasi} />
        </div>
    );
    //
    const dialogFooterPlotingDosbing = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hidePlotingDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={simpanPlotingDosbing} />
        </div>
    );

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pencarian" style={{ width: '92%' }} />
                    </span>
                </div>
                <Button icon="pi pi-plus" rounded onClick={() => router.push('/pengajuan/pendaftaran')} />
            </div>
        );
    };
    const header = renderHeader();

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
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={pengajuans}
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
                        header={header} >
                        <Column
                            field="mahasiswa.nrp"
                            sortable
                            header="NRP" />
                        <Column 
                            field="mahasiswa.nama"
                            sortable
                            header="Nama"
                            style={{ minWidth: '12rem' }} />
                        <Column
                            field="tempat_kp"
                            sortable
                            header="Tempat KP" />
                        <Column
                            field="lama_kp"
                            sortable
                            header="Lama KP" />
                        <Column 
                            header="Tanggal KP"
                            field='tanggal_kp'
                            style={{ minWidth: '7rem', width: '7rem' }} />
                        <Column 
                            header="Status" 
                            sortable
                            alignHeader="center"
                            bodyClassName="text-center"
                            style={{ minWidth: '10rem', width: '10rem' }}
                            body={statusBodyTemplate} />
                        <Column
                            header="Actions"
                            style={{ minWidth: '7rem', width: '7rem' }}
                            alignHeader="center"
                            bodyClassName="text-center"
                            body={actionBodyTemplate}
                            />
                    </DataTable>

                    <Dialog 
                        visible={verifikasiDialog} 
                        onHide={hideDialog} 
                        header="Verifikasi" 
                        style={{ width: '350px' }} 
                        modal 
                        footer={dialogFooterVerifikasi}
                        >
                        <div className='flex flex-wrap gap-3'>
                            <div className="flex align-items-center">
                                <RadioButton 
                                    inputId="setujui" 
                                    name="status_persetujuan" 
                                    value={1} // Set value to 1 for 'Setujui'
                                    onChange={(e) => handleInputChange(e, 'status_persetujuan')} 
                                    checked={pengajuan?.status_persetujuan === 1 || false} // Check if value is 1
                                />
                                <label htmlFor="setujui" className="ml-2">Setujui</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton 
                                    inputId="tolak" 
                                    name="status_persetujuan" 
                                    value={0} // Set value to 0 for 'Tolak'
                                    onChange={(e) => handleInputChange(e, 'status_persetujuan')} 
                                    checked={pengajuan?.status_persetujuan === 0 || false} // Check if value is 0
                                />
                                <label htmlFor="tolak" className="ml-2">Tolak</label>
                            </div>
                        </div>
                        <div className='p-fluid mt-3'>
                            {pengajuan.status_persetujuan === 1 ? (
                            <div className="field">
                                <label htmlFor="tanggal_kp">Tanggal Mulai KP</label>
                                <InputText 
                                    id='tanggal_kp' 
                                    type='date' 
                                    value={pengajuan?.tanggal_kp ? new Date(pengajuan.tanggal_kp).toISOString().slice(0, 10) : ''} 
                                    onChange={(e) => handleInputChange(e, 'tanggal_kp')} />
                            </div>
                            ) : (
                            <div className="field">
                                <label htmlFor="catatan_koordinator_kp">Catatan</label>
                                <InputText 
                                    id='catatan_koordinator_kp' 
                                    placeholder='Catatan'
                                    value={pengajuan?.catatan_koordinator_kp || ''} 
                                    onChange={(e) => handleInputChange(e, 'catatan_koordinator_kp')} 
                                />
                            </div>
                            )}
                        </div>
                    </Dialog>

                    <Dialog 
                        visible={plotingDialog} 
                        onHide={hidePlotingDialog} 
                        header="Ploting Dosbing" 
                        style={{ width: '350px' }} 
                        modal 
                        footer={dialogFooterPlotingDosbing} >
                        <div className='p-fluid'>
                            <div className="field">
                                <Dropdown
                                    id='id_dosen'
                                    value={pengajuan.id_dosen}
                                    options={dropdownDosenValue}
                                    onChange={(e) => handleInputChange(e, 'id_dosen')}
                                    placeholder='Pilih Dosen'
                                    filter />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Pengajuan;