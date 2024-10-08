/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`https://reg.mbkm.pens.ac.id/assets/dist/img/logo_pens.png`} alt="Logo" height="20" className="mr-2" />
            Develop by
            <span className="font-medium ml-2">Abdul Rozak R</span>
        </div>
    );
};

export default AppFooter;
