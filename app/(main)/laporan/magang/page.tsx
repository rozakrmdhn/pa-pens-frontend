"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';

const Laporan = () => {
    const router = useRouter();

    // Breadcrumb
    const breadcrumbHome = { icon: 'pi pi-home', command: () => router.push('/dashboard') };
    const breadcrumbItems = [
        { label: 'Laporan' },
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
                    <h5 className='mb-0'>Rencana Konten Laporan</h5>
                    <ol className='my-2'>
                        <li>
                            <h6 className='mb-1'><b>[ DONE ] </b>
                                Menampilkan alokasi Dosen menjadi Dosen Pembimbing terhadap Mahasiswa PJJ
                            </h6>
                        </li>
                        <li>
                            <h6 className='mb-1'><b>[ PROGRES ] </b>
                                Menampilkan jumlah Mahasiswa PJJ yang melaksanakan Kerja Praktek berdasarkan Kabupaten
                            </h6>
                        </li>
                        <li>
                            <h6 className='mb-1'>
                                Menampilkan jumlah kehadiran dan persentase dalam melaksanakan Kerja Praktek
                            </h6>
                        </li>
                        <li>
                            <h6 className='mb-1'>
                                Menampilkan progres Mahasiswa PJJ dalam melaksanakan Kerja Praktek
                            </h6>
                        </li>
                        <li>
                            <h6 className='mb-1'>
                                Menampilkan pengajuan Kerja Praktek yang Disetujui dan Ditolak
                            </h6>
                        </li>
                        <li>
                            <h6>dsb.</h6>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default Laporan;