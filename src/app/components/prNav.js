'use client'
import { usePathname } from 'next/navigation';
import React from 'react';

import Link from 'next/link';
const PrNav = ({ data }) => {

    const pathName = usePathname();
    return (
        <div className="flex bg-slate-400 flex-col w-64  shrink-0">
            <ul>
                {data && data.length > 0 ? data.map((name) => {
                    const displayName = name.split("_").join(' ');
                    const isActive = pathName === (`/purchase_requisition/${name}`)
                    return (<li key={name}><Link className={`py-2 px-4 block uppercase  ${isActive ? 'bg-slate-600 text-white hover:bg-slate-600 ' : 'hover:bg-slate-500'}`} href={`/purchase_requisition/${name}`} >{displayName}</Link></li>)
                }
                ) : ''
                }
            </ul>
        </div>
    );
};

export default PrNav;