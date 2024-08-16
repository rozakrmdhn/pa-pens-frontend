"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';

const Logbook = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang KP' },
        { label: 'Logbook', command: () => router.push('/logbook') }
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
                    <h5 className='pt-2'>Logbook</h5>
                </div>
                <div className="card p-3">
                    Blank Page
                </div>
            </div>
        </div>
    );
};

export default Logbook;