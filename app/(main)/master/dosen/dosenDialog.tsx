import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DosenService } from '@/services/service/DosenService';

interface Dosen {
    id?: number;
    nama?: string;
    jenis_kelamin?: string;
    email?: string;
    nomor_hp?: string;
    alamat?: string;
}

const DosenDialog = ({ visible, onHide, onSave, dosenData }: { visible: boolean, onHide: () => void, onSave: (dosen: Dosen) => void, dosenData?: Dosen }) => {
    const [dosen, setDosen] = useState<Dosen>(dosenData || {});
    const toast = useRef(null);

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    useEffect(() => {
        if (dosenData) {
            setDosen(dosenData);  // populate the form if editing
        } else {
            setDosen({});  // clear form for new dosen
        }
    }, [dosenData]);

    const handleInputChange = (e: any, field: string) => {
        const value = e.target.value;
        setDosen({ ...dosen, [field]: value });
    };

    const saveDosen = async () => {
        try {
            if (dosen.id) {
                await DosenService.updateDosen(dosen.id, dosen)  // Update API call
                toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Dosen updated successfully', life: 3000 });
            } else {
                await DosenService.createDosen(dosen);  // Create API call
                toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Dosen created successfully', life: 3000 });
            }
            onSave(dosen);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save Dosen', life: 3000 });
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={saveDosen} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog header={dosen.id ? "Edit Dosen" : "New Dosen"} visible={visible} style={{ width: '50vw' }} footer={dialogFooter} onHide={onHide}>
                <div className="field">
                    <label htmlFor="nama">Nama</label>
                    <InputText id="nama" value={dosen.nama || ''} onChange={(e) => handleInputChange(e, 'nama')} />
                </div>
                <div className="field">
                    <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                    <Dropdown id="jenis_kelamin" value={dosen.jenis_kelamin} options={genderOptions} onChange={(e) => handleInputChange(e, 'jenis_kelamin')} placeholder="Select Gender" />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={dosen.email || ''} onChange={(e) => handleInputChange(e, 'email')} />
                </div>
                <div className="field">
                    <label htmlFor="nomor_hp">Nomor HP</label>
                    <InputText id="nomor_hp" value={dosen.nomor_hp || ''} onChange={(e) => handleInputChange(e, 'nomor_hp')} />
                </div>
                <div className="field">
                    <label htmlFor="alamat">Alamat</label>
                    <InputText id="alamat" value={dosen.alamat || ''} onChange={(e) => handleInputChange(e, 'alamat')} />
                </div>
            </Dialog>
        </>
    );
};

export default DosenDialog;
