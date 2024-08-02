'use client'
import { usePathname } from 'next/navigation';
import React from 'react';

import Link from 'next/link';
const SideNav = ({ root, data }) => {

    const pathName = usePathname();
    return (

        <ul className="flex bg-slate-300 flex-col w-64   shrink-0 print:hidden">
            {data && data.length > 0 ? data.map((name) => {
                const displayName = name.split("_").join(' ');
                const isActive = pathName === (`/${root}/${name}`)
                return (<li key={name}><Link className={`py-2 px-4 block uppercase  ${isActive ? 'bg-slate-500 text-white hover:bg-slate-500 ' : 'hover:bg-slate-400'}`} href={`/${root}/${name}`} >{displayName}</Link></li>)
            }
            ) : ''
            }
        </ul>

    );
};

export default SideNav;