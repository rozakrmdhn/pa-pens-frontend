"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Demo, Master, Magang } from '@/types';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { LogbookService } from '@/services/service/LogbookService';
import { AnggotaService } from '@/services/service/AnggotaService';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Badge } from 'primereact/badge';

const Logbook = () => {
    // Default Property Value State
    let emptyLogbook: Magang.Logbook = {
        id: '',
        id_anggota: '',
        id_mahasiswa: '',
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
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});

    // setState for Any Data
    const [logbook, setLogbook] = useState<Magang.Logbook>(emptyLogbook);
    const [logbooks, setLogbooks] = useState<Magang.Logbook[]>([]);
    const [anggotas, setAnggotas] = useState<Magang.Anggota[]>([]);
    const [monitorings, setMonitorings] = useState<Magang.Logbook[]>([]);
    const [fileGambar, setFileGambar] = useState();

    // setState for Dropdown onChange
    const [dropdownMahasiswa, setDropdownMahasiswa] = useState<Magang.Anggota | null>(null);
    const [selectedAnggota, setSelectedAnggota] = useState<Magang.Anggota>(emptySelected);

    // Dialog Create Logbook State
    const [logbookDialog, setLogbookDialog] = useState(false);
    const [deleteLogbookDialog, setDeleteLogbookDialog] = useState(false);

    // Card Logbook State
    const [cardLogbookView, setCardLogbookView] = useState(false);

    // Breadcrumb State
    const [breadcrumbItemName, setBreadcrumbItemName] = useState('');

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Logbook', command: () => router.push('/logbook') }
    ];
    if (breadcrumbItemName) {
        breadcrumbItems.push({
            label: breadcrumbItemName
        });
    }
    // -> END

    // Dropdown Matakuliah -> static data
    const dropdownMatakuliah = [
        { label: 'Praktikum Basis Data', value: 'TI032105' },
        { label: 'Workshop Administrasi Basis Data', value: 'TI034104'}
    ];

    // Dropdown set customize Value Label
    const dropdownOptions = anggotas.map((data) => ({
        label: data.mahasiswa?.nama,
        value: data.id_mahasiswa
    }));

    // Handle Select Dropdown onChange Event
    const handleDropdownChange = (e: any) => {
        const selectedId = e.value;
        const selectedData = anggotas.find((data) => data.id_mahasiswa === selectedId);

        setDropdownMahasiswa(selectedId); // Update the selected mahasiswa
        setSelectedAnggota({ 
            id: selectedData?.id,
            id_mahasiswa: selectedId,
        });
        setBreadcrumbItemName(selectedData?.mahasiswa?.nama || '');
    };

    // on Click Dialog Logbook
    const openNew = () => {
        setLogbookDialog(true);
        setSubmitted(false);
    };
    // on Hide Dialog Logbook when Submitted
    const hideDialog = () => {
        setLogbookDialog(false);
        setSubmitted(false);
    };
    // on Click Delete Logbook Dialog
    const openDeleteLogbookDialog = (rowData: Magang.Logbook) => {
        setDeleteLogbookDialog(true);
        setLogbook({ ...rowData });
    };
    // on Hide Dialog Delete Logbook when Submitted
    const hideDeleteLogbookDialog = () => {
        setDeleteLogbookDialog(false);
        setSubmitted(false);
    };

    // Handle Input Change
    const handleInputChange = (e: any, field: string) => {
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

        setLogbook({ 
            ...logbook, 
            [field]: value,
            id_mahasiswa: selectedAnggota.id_mahasiswa,
            id_anggota:  selectedAnggota.id
        });
    };

    // Fetching Data Mahasiswa ref Anggota
    const loadAnggota = async () => {
        try {
            // Endpoint : api/magang/anggota
            const result = await AnggotaService.getAllAnggota();
            setAnggotas(result);
        } catch (error) {
            console.log('Failed to load data', error);
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
            // Endpoint : api/logbook/monitoring
            const monitoring = await LogbookService.getLogbookMonitoring(selectedAnggota);
            
            setLogbooks(getData(result.data));
            setMonitorings(getData(monitoring.data));
            setCardLogbookView(true);
            setLoading(false);
            
        } catch (error: any) {
            setCardLogbookView(false);
            const errorMessage = error?.response?.data?.message || 'Failed to fetching data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } finally {
            setLoading(false);
        }
    }, [selectedAnggota]); // Dependency array for selectedAnggota

    const saveLogbook = async () => {
        if (logbook.kegiatan?.trim()) {
            try {
                console.log(logbook);
                // Endpoint : api/logbook
                const result = await LogbookService.createLogbook(logbook);
                toast.current?.show({ severity: result.status, summary: 'Updated', detail: result.message, life: 3000 });
                loadLogbookMahasiswa();
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || 'Failed to save data';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            } finally {
                setLogbookDialog(false)
            }
        }
    };

    const deleteLogbook = async () => {        
        try {
            if (logbook.id) {
                const result = await LogbookService.deleteLogbook(logbook.id);
                setLogbooks(logbooks.filter(d => d.id !== logbook.id));
                toast.current?.show({ severity: result.status, summary: 'Success', detail: result.message, life: 3000 });
            }
            setDeleteLogbookDialog(false);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to delete data';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    };

    useEffect(() => {
        loadAnggota();
        if (selectedAnggota.id_mahasiswa) {
            loadLogbookMahasiswa();
        }
    }, [selectedAnggota, loadLogbookMahasiswa]);

    const reloadTable = () => {
        loadLogbookMahasiswa();
    };

    const statusBodyTemplate = (rowData: Magang.Logbook) => {
        const statusText = rowData.kesesuaian_matkul_diajarkan === 1 ? 'Ya' : 'Tidak';
        const statusSeverity = rowData.kesesuaian_matkul_diajarkan === 1 ? 'success' : 'warning';

        return <Badge value={statusText} severity={statusSeverity} />;
    };

    const lampiranBodyTemplate = (rowData: Magang.Logbook) => {
        return <Button label='Lihat' size='small' className='p-button-text' />
    };

    // Action Buttons for Logbook Dialog -> START
    const dialogFooter = (
        <div>
            <Button label="Batal" icon="pi pi-times" size="small" onClick={hideDialog} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" size="small" onClick={saveLogbook} />
        </div>
    );
    // -> END
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" size="small" text onClick={hideDeleteLogbookDialog} />
            <Button label="Yes" icon="pi pi-check" size="small" text onClick={deleteLogbook} />
        </>
    );

    // Header Toolbar DataTable -> START
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Dropdown
                    value={rows}
                    options={[5, 10, 25]}
                    onChange={(e) => setRows(e.value)}
                    style={{ width: '5.5rem', minWidth: '5.5rem' }} />
                <Button label='Logbook' icon="pi pi-pencil" onClick={openNew} />
            </div>
        );
    };
    const header = renderHeader();
    // -> END

    // Action Buttons DataTable -> START
    const actionBodyTemplate = (rowData: Magang.Logbook) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-print" outlined className="mr-2" size="small" />
                <Button icon="pi pi-trash" outlined severity="danger" size="small" onClick={() => openDeleteLogbookDialog(rowData)} />
            </React.Fragment>
        );
    };
    // -> END

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Logbook</h5>
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
                                placeholder='Ref Mhs' />
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
                                    style={{ width: '5rem', minWidth: '5rem' }}
                                />
                            </div>
                        } >
                        <Column field='tanggal' header='Tanggal' alignHeader='center' bodyClassName='text-center' style={{ width: '7rem', minWidth: '7rem' }} />
                        <Column field='jam_mulai' header='Jam Mulai' alignHeader='center' bodyClassName='text-center' style={{ width: '7.5rem', minWidth: '7.5rem' }} />
                        <Column field='jam_selesai' header='Jam Selesai' alignHeader='center' bodyClassName='text-center' style={{ width: '7.5rem', minWidth: '7.5rem' }} />
                        <Column field='kegiatan' header='Kegiatan' />
                        <Column field='kesesuaian_matkul_diajarkan' header='Kesesuaian Matkul' 
                            alignHeader='center' 
                            bodyClassName='text-center'
                            body={statusBodyTemplate} 
                            style={{ width: '11rem', minWidth: '11rem' }} />
                        <Column field='lampiran_laporan' header='File Progres' 
                            alignHeader='center' 
                            bodyClassName='text-center'
                            body={lampiranBodyTemplate}
                            style={{ width: '8rem', minWidth: '8rem' }} />
                        <Column header='Actions' alignHeader='center' bodyClassName='text-center' style={{ width: '9rem', minWidth: '9rem' }}
                            body={actionBodyTemplate} />
                    </DataTable>

                    <DataTable
                        value={monitorings}
                        className="p-datatable-gridlines"
                        emptyMessage="No data found.">
                        <Column
                            field='catatan_pembimbing'
                            header="Catatan Pembimbing PENS" />
                    </DataTable>

                    <Dialog modal visible={logbookDialog} onHide={hideDialog} header='Logbook' footer={dialogFooter} className='p-fluid' style={{ width: '650px' }}>
                        <div className='field grid'>
                            <label htmlFor="" className='col-12'>Tanggal</label>
                            <div className='col-12'>
                                <InputText id='' type='date' value={new Date().toISOString().split('T')[0]} onChange={(e) => handleInputChange(e, 'tanggal')} placeholder='Tanggal' />
                            </div>
                        </div>
                        <div className='field grid mb-1'>
                            <div className='col-12 md:col-6 mb-3'>
                                <label htmlFor="" className='col-12 p-0'>Jam Mulai</label>
                                <div className='col-12 p-0 mt-2'>
                                    <InputText id='' type='time' onChange={(e) => handleInputChange(e, 'jam_mulai')} />
                                </div>
                            </div>
                            <div className='col-12 md:col-6 mb-3'>
                                <label htmlFor="" className='col-12 p-0'>Jam Selesai</label>
                                <div className='col-12 p-0 mt-2'>
                                    <InputText id='' type='time' onChange={(e) => handleInputChange(e, 'jam_selesai')} />
                                </div>
                            </div>
                        </div>
                        <div className='field'>
                            <label htmlFor="">Kegiatan</label>
                            <InputTextarea id='' onChange={(e) => handleInputChange(e, 'kegiatan')} placeholder='Kegiatan KP'/>
                        </div>
                        <div className='field'>
                            <label htmlFor="">Kesesuaian Matakuliah</label>
                            <div className='flex justify-content-start p-2'>
                                <div className='field-radiobutton mb-0 mr-4'>
                                    <RadioButton 
                                        name='option' 
                                        value={1} 
                                        onChange={(e) => handleInputChange(e, 'kesesuaian_matkul_diajarkan')} 
                                        checked={logbook?.kesesuaian_matkul_diajarkan === 1 || false} />
                                    <label htmlFor="">Ya</label>
                                </div>
                                <div className='field-radiobutton mb-0'>
                                    <RadioButton 
                                        name='option' 
                                        value={2} 
                                        onChange={(e) => handleInputChange(e, 'kesesuaian_matkul_diajarkan')} 
                                        checked={logbook?.kesesuaian_matkul_diajarkan === 2 || false} />
                                    <label htmlFor="">Tidak</label>
                                </div>
                            </div>
                        </div>
                        <div className='field'>
                            <label htmlFor="">Jika Ya, Pilih Matakuliah</label>
                            <Dropdown
                                value={logbook?.matkul_diajarkan}
                                options={dropdownMatakuliah}
                                placeholder='Pilih Matakuliah'
                                onChange={(e) => handleInputChange(e, 'matkul_diajarkan')} />
                        </div>
                        <div className='field'>
                            <label htmlFor="">Foto</label>
                            <InputText 
                                id='lampiran_foto' 
                                type='file' 
                                accept="image/*"
                                onChange={(e) => handleInputChange(e, 'foto')} />
                        </div>
                        <div className='field'>
                            <label htmlFor="">File Progres</label>
                            <InputText 
                                id='lampiran_laporan' 
                                type='file' 
                                accept=".pdf"
                                onChange={(e) => handleInputChange(e, 'lampiran_laporan')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLogbookDialog} style={{ width: '350px' }} header='Confirm' footer={deleteDialogFooter} modal onHide={hideDeleteLogbookDialog}>
                        <div className='flex align-items-center justify-content-center'>
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            { logbook && (
                                <span>Are you sure you want to delete <b>Logbook</b> ?</span>
                            )}
                        </div>
                    </Dialog>
                </div> ) : null }
            </div>
        </div>
    );
};

export default Logbook;