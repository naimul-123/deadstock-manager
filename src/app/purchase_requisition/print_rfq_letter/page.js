"use client"
import { banglaToDecimal, benWord, decimalToBangla, indianNumberFormat } from '@/utils/benword';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AlignmentType, Document, FrameAnchorType, HorizontalPositionAlign, Packer, PageOrientation, Paragraph, TextRun, VerticalPositionAlign } from 'docx';
import { useRef } from 'react';
import saveAs from 'file-saver'
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getData } from '../../../../../lib/api';
import { usePrContext } from '@/context/prContext';
import PrList from '@/components/prLIst';
import { useHirarchyContext } from '@/context/hierarchyContext';
import Image from 'next/image';
import logo from '@/../../public/bb_logo.png'
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [items, setItems] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [committeeInfo, setCommitteeInfo] = useState(null)
    const [isOpenCommitte, setIsOpenCommittee] = useState(true)
    const [vendorError, setVendorError] = useState('')
    const [vendor_id, setVendor_id] = useState('')
    const [isOpenVendor, setIsOpenVendor] = useState(true)
    const { employees } = useHirarchyContext();
    const [rfqPr, setRfqPr] = useState('')

    const { rfqprnumbers, prNumberLoading, prDataLoading, rfqData: projection, handleRfqPrNumber, rfqPrNumber, } = usePrContext();

    console.log(projection);

    const { data: vendor = {} } = useQuery({
        queryKey: ['vendor', vendor_id],
        queryFn: () => getData(`/purchase_requisition/api/rfq?vendor_id=${vendor_id}`),
        enabled: !!vendor_id
    })


    useEffect(() => {
        setCommitteeInfo(null)
        setVendorError('')
        let total = 0;

        let con = "";
        let items = '';
        projection?.items.forEach((item, id) => {
            if (id === 0) {
                con = ""
            }
            else if (id > 0 && projection.items.length === 2) {
                con = "এবং"
            }
            else if (id > 0 && id === projection.items.length - 1) {
                con = "এবং"
            }
            else {
                con = ","
            }

            items += `${con} ${item.quantity < 10 ? '০' : ''}${decimalToBangla((item.quantity).toString())}টি ${item.goods_name_bn} `
            total += item.unit_price * item.quantity;
        })

        setItems(items)

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])

    console.log(items);
    if (prNumberLoading) {
        return <div className="shrink-0 max-w-screen-md w-full flex flex-col justify-center items-center mx-auto card">
            <span className="loading loading-spinner text-info"></span>
        </div>
    }
    return (
        <div className="bg-base-200 min-h-[calc(100vh-44px)] flex justify-between">
            {prDataLoading ?
                <div className="shrink-0 max-w-screen-lg w-full flex flex-col justify-center items-center mx-auto card">
                    <span className="loading loading-spinner text-info"></span>
                </div> :
                <div className="shrink-0 max-w-screen-lg w-full   mx-auto card">
                    {projection &&
                        <div>
                            <div className="font-[SutonnyOMJ] my-4" >
                                <h2 className="font-bold underline text-center" style={{ textIndent: '40px' }}>{projection.notingHeading}</h2>
                            </div>
                            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-slate-400  ">
                                <h2 className="text-2xl font-bold"> পারসেজ রিকুইজিশন নং- {rfqPrNumber}</h2>
                                <p className="font-bold text-center "> </p>
                                <div className="flex gap-2 justify-between items-center">
                                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={() => setIsOpenVendor(!isOpenVendor)}>{isOpenVendor ? 'Hide' : "Show"}</button>
                                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={() => setIsOpenVendor(!isOpenVendor)}>PrintPreview</button>

                                </div>
                            </div>

                            <div className={`card shadow-lg ${!isOpenVendor ? "hidden" : undefined}`}>
                                <div className="w-[595px] h-[842px] border font-[sutonnyOMJ] px-10">
                                    <div className="flex justify-between items-end">
                                        <div className="w-20 h-20"><Image alt="logo" src={logo} /></div>
                                        <div className="font-bold text-center ">
                                            <h2 className="text-3xl">বাংলাদেশ ব্যাংক</h2>
                                            <h3 className="text-2xl">বরিশাল।</h3>
                                        </div>
                                        <div>
                                            <p className="text-2xl underline">জড়সামগ্রী শাখা</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-lg font-bold border-b-2 border-black">
                                            <p>{`সূত্র নং ডিএসঃ ${decimalToBangla(projection.File_Index)}/${decimalToBangla(new Date().getFullYear().toString())}-${projection.vendors?.map((vendor) => decimalToBangla(vendor.outword_no))}`}  </p>
                                            <p>তারিখঃ {decimalToBangla("05/08/2024")}</p>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        {projection.vendors?.map((vendor, idx) => <p className="text-lg font-semibold leading-none" key={idx}>{`${decimalToBangla(0 + (idx + 1).toString())}. ${vendor.vendor_name_bn}, ${vendor.vendor_add_bn}।`} </p>)}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-lg text-center underline leading-4">{projection.notingHeading}</h2>
                                        <p>জনাব,</p>
                                        <p>এ অফিসের জন্য {items} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে। উক্ত মালামালগুলো সরবরাহের নিমিত্তে সংযুক্ত ছকে দর উল্লেখপূর্বক সীলমোহরকৃত খামে নির্বাহী পরিচালক, বাংলাদেশ ব্যাংক, বরিশাল বরাবর আগামী </p>
                                    </div>






                                </div>

                            </div>
                        </div>



                    }



                </div>
            }

        </div>
    );
};

export default Project;