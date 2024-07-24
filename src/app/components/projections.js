"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';

const Projections = () => {
    const [data, setData] = useState([])
    const pathName = usePathname();
    useEffect(() => {
        const getData = async () => {
            const res = await fetch('projections.json')
            const data = await res.json()
            const projections = data.filter((item) => !(item.pr_number))
            setData(projections)
        }

        getData()

    }, [])


    return (
        <div className="flex bg-slate-400 flex-col w-64  shrink-0">
            <h2 className={`py-2 px-4 bg-slate-700 text-white`}>অনুমোদনের জন্য অপেক্ষমান প্রাক্কলন</h2>
            <ul>

                {data && data.length > 0 ? data.map((project) => {
                    const isActive = pathName.startsWith(`/projection/${project._id}`)
                    return (<li key={project._id}><Link className={`py-2 px-4 block  ${isActive ? 'bg-slate-600 text-white hover:bg-slate-600 ' : 'hover:bg-slate-500'}`} href={`/projection/${project._id}`} >{project.notingHeading}</Link></li>)
                }
                ) : ''
                }


            </ul>
        </div>
    );
};

export default Projections;