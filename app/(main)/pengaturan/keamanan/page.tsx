"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const PengaturanKeamanan = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Pengaturan' },
        { label: 'Keamanan', command: () => router.push('/pengaturan/keamanan') }
    ];

    useEffect(() => {

    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className='flex justify-content-between mb-3'>
                    <h5 className='pt-2'>Pengaturan</h5>
                </div>
                <div className="card p-3">
                    Pengaturan Keamanan
                </div>
            </div>
        </div>
    );
};

export default PengaturanKeamanan;