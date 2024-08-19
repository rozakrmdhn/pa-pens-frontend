"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const PengajuanForm = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang KP' },
        { label: 'Pengajuan', command: () => router.push('/pengajuan') },
        { label: 'Form', command: () => router.push('/form') }
    ];

    useEffect(() => {

    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className='flex justify-content-between my-1'>
                    <h5 className='pt-2'>Pengaturan</h5>
                </div>
                <div className="card p-3">
                    Pengaturan Keamanan
                </div>
            </div>
        </div>
    );
};

export default PengajuanForm;