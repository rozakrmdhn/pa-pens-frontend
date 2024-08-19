"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';

const PengaturanProfil = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Pengaturan' },
        { label: 'Profil', command: () => router.push('/pengaturan/profil') }
    ];

    useEffect(() => {

    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
            </div>
            <div className="col-12">
                <div className="flex justify-content-between my-1">
                    <h5>Pengaturan</h5>
                </div>
                <div className="card p-3">
                    Pengaturan Profil
                </div>
            </div>
        </div>
    );
};

export default PengaturanProfil;