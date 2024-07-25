"use client"
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { getData } from '../../../lib/api';

const Projections = () => {
    const pathName = usePathname();


    const { data = [], refetch } = useQuery({
        queryKey: ['projections'],
        queryFn: () => getData('/projection/api')

    })



    return (
        <div className="flex bg-slate-300 flex-col w-64  shrink-0">
            <h2 className={`py-2 px-4 bg-slate-600 text-white`}>অনুমোদনের জন্য অপেক্ষমান প্রাক্কলন</h2>
            <ul>

                {data && data.length > 0 ? data.map((project) => {
                    const isActive = pathName.startsWith(`/projection/${project._id}`)
                    return (<li key={project._id}><Link className={`py-2 px-4 block  ${isActive ? 'bg-slate-500 text-white hover:bg-slate-500 ' : 'hover:bg-slate-400'}`} href={`/projection/${project._id}`} >{project.notingHeading}</Link></li>)
                }
                ) : ''
                }


            </ul>
        </div>
    );
};

export default Projections;