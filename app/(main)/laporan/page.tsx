"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';

const Laporan = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Magang' },
        { label: 'Laporan', command: () => router.push('/laporan') }
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
                    <h5>Laporan</h5>
                </div>
                <div className="card p-3">
                    <h5>Rencana Konten Laporan</h5>
                    <ol>
                        <li>Menampilkan progres mahasiswa pjj dalam melaksanakan Kerja Praktek</li>
                        <li>Menampilkan alokasi dosen menjadi dosen pembimbing dari mahasiswa pjj</li>
                        <li>Menampilkan pendaftaran Kerja Praktek yang disetujui dan ditolak</li>
                        <li>Menampilkan jumlah mahasiswa pjj yang melaksanakan Kerja Praktek berdasarkan Kabupaten</li>
                        <li>dsb.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default Laporan;