'use client'
import { usePathname } from 'next/navigation';
import React from 'react';

import Link from 'next/link';
const PrNav = ({ data, path }) => {
    const pathName = usePathname();
    return (
        <div className="max-w-64 text-lg border-r-2 max-h-screen">
            <ul>
                {data && data.length > 0 ? data.map((project) => {
                    const isActive = pathName === (`/purchase_requisition/${path}/${project._id}`)
                    return (<li key={project._id}><Link className={`py-2 px-4 block   ${isActive ? 'bg-[#04AA6D] text-white hover:bg-[#04AA6D] ' : 'hover:bg-gray-300'}`} href={`/purchase_requisition/${path}/${project._id}`} >{project.notingHeading}</Link></li>)
                }
                ) : ''
                }
            </ul>
        </div>
    );
};

export default PrNav;