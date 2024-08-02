"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const PageNav = ({ root, paths }) => {
    const pathName = usePathname()
    return (
        <div className="flex flex-col bg-[#E7E9EB] w-64 shrink-0 print:hidden">
            <h2 className={`py-2 px-4  text-black`}>অনুমোদনের জন্য অপেক্ষমান প্রাক্কলন</h2>
            <ul>

                {paths && paths.length > 0 ? paths.map((path) => {
                    const displayName = path.split("_").join(" ").toUpperCase();
                    const isActive = pathName.startsWith(`/${root}/${path}`)

                    return (<li key={path}><Link className={`py-2  px-4 block   ${isActive ? 'bg-[#04aa6d] hover:bg-[#04aa6d] text-white' : ' text-black hover:bg-[#cccccc]'}`} href={`/${root}/${path}`} >{displayName}</Link></li>)
                }
                ) : ''
                }
            </ul>
        </div>




    );
};
export default PageNav;