"use client"
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { getData } from '../../../lib/api';
import { useProjectionContext } from '@/context/projectionContext';

const PurchaseRequisitions = () => {
    const pathName = usePathname();
    const { projections } = useProjectionContext();
    return (
        <div className="flex bg-slate-300 flex-col w-64  shrink-0 print:hidden">
            <h2 className={`py-2 px-4 bg-slate-600 text-white`}>অনুমোদনের জন্য অপেক্ষমান প্রাক্কলন</h2>
            <ul>

                {projections && projections.length > 0 ? projections.map((project) => {
                    const isActive = pathName.startsWith(`/projection/${project._id}`)
                    return (<li key={project._id}><Link className={`py-2 px-4 block  ${isActive ? 'bg-slate-500 text-white hover:bg-slate-500 ' : 'hover:bg-slate-400'}`} href={`/projection/${project._id}`} >{project.notingHeading}</Link></li>)
                }
                ) : ''
                }


            </ul>
        </div>
    );
};

export default PurchaseRequisitions;