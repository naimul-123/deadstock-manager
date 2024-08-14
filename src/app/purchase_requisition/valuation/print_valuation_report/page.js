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


import PrList from '@/components/prLIst';
import { useHirarchyContext } from '@/context/hierarchyContext';
import Image from 'next/image';
import logo from '@/../../public/bb_logo.png'
import { getData } from '../../../../../lib/api';
import { usePrContext } from '@/context/prContext';

moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [items, setItems] = useState('')
    const [totalQuantity, setTotalQty] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [committeeInfo, setCommitteeInfo] = useState(null)
    const [isOpenCommitte, setIsOpenCommittee] = useState(true)
    const [vendorError, setVendorError] = useState('')
    const [vendor_id, setVendor_id] = useState('')
    const [isOpenHeadline, setIsOpenHeadline] = useState(true)
    const { employees } = useHirarchyContext();
    const [rfqPr, setRfqPr] = useState('')
    const { rfqprnumbers, prNumberLoading, prDataLoading, rfqData: projection, handleRfqPrNumber, rfqPrNumber, } = usePrContext();


    const { data: vendor = {} } = useQuery({
        queryKey: ['vendor', vendor_id],
        queryFn: () => getData(`/purchase_requisition/api/rfq?vendor_id=${vendor_id}`),
        enabled: !!vendor_id
    })


    useEffect(() => {
        setCommitteeInfo(null)
        setVendorError('')
        let total = 0;
        let totalQuantity = 0;
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
            totalQuantity += item.quantity;
        })

        setItems(items)
        setTotalQty(totalQuantity)
        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])
    if (prNumberLoading) {
        return <div className="grow h-[calc(100vh - 44px)] scroll-auto overflow-y-auto">
            <span className="loading loading-spinner text-info"></span>
        </div>
    }



    return (projection ?
        <div className="grow h-[calc(100vh - 44px)] scroll-auto overflow-y-auto bg-base-100 ">
            <div className="flex p-2  gap-2 justify-between items-center bg-[#D9EEE1] print:hidden sticky top-0 ">
                <h2 className="text-2xl font-bold"> পারসেজ রিকুইজিশন নং- {rfqPrNumber}</h2>
                <p className="font-bold text-center "> </p>
                <div className="flex gap-2 justify-between items-center">
                    <button className="btn  text-white bg-[#04AA6D]" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                    <button className="btn  text-white bg-[#04AA6D]" onClick={() => setIsOpenHeadline(!isOpenHeadline)}>{isOpenHeadline ? 'Hide' : "Show"} Headline</button>
                    <button className="btn  text-white bg-[#04AA6D]" onClick={() => window.print()}>PrintPreview</button>
                </div>
            </div>
            <div className="font-[sutonnyOMJ] mx-auto p-16 break-after-page border-b print:border-none ">
                <div className={`flex justify-between items-end `}>
                    <div className={`w-20 h-20 ${!isOpenHeadline ? "invisible" : "visible"}`}><Image alt="logo" src={logo} /></div>
                    <div className={`font-bold text-center ${!isOpenHeadline ? "invisible" : "visible"}`} >
                        <h2 className="text-3xl">বাংলাদেশ ব্যাংক</h2>
                        <h3 className="text-2xl">বরিশাল।</h3>
                    </div>
                    <div>
                        <p className="text-lg font-bold underline">জড়সামগ্রী শাখা</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-lg font-bold border-b-2 border-black ">
                        <p>{`সূত্র নং ডিএসঃ ${decimalToBangla(projection.File_Index)}/${decimalToBangla(new Date().getFullYear().toString())}-${projection.rfqInfo?.vendors?.map((vendor) => decimalToBangla(vendor.outword_no))}`}  </p>
                        <p>তারিখঃ {decimalToBangla(moment(projection.rfqInfo.outword_date).format('DD-MM-YYYY'))}</p>
                    </div>
                </div>
                <div className="my-2">
                    {projection.rfqInfo?.vendors?.map((vendor, idx) => <p className="text-lg font-semibold leading-none" key={idx}>{`${decimalToBangla(0 + (idx + 1).toString())}. ${vendor.vendor_name_bn}, ${vendor.vendor_add_bn}।`} </p>)}
                </div>
                <div className="text-lg">
                    <h2 className="font-semibold text-center underline leading-4">{projection.rfqInfo.rfq_heading}</h2>
                    <div className="py-8">
                        <p className="leading-none">জনাব,</p>
                        <p className="indent-6 leading-none text-justify">এ অফিসের জন্য {items} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে। উক্ত {`${projection.rfqInfo.product_coll_name}${totalQuantity > 1 ? "গুলো" : "টি"}`} সরবরাহের নিমিত্তে সংযুক্ত ছকে দর উল্লেখপূর্বক সীলমোহরকৃত খামে নির্বাহী পরিচালক, বাংলাদেশ ব্যাংক, বরিশাল বরাবর আগামী {decimalToBangla(moment(projection.rfqInfo.quotation_deadLine).format('DD-MM-YYYY'))} তারিখের মধ্যে
                            তারিখ সকাল ১১.০০টার মধ্যে দরপ্রস্তাব দাখিল করার জন্য আপনাদেরকে অনুরোধ করা যাচ্ছে। <br></br>
                            দরপ্রস্তাব দাখিলের ক্ষেত্রে নিম্নবর্ণিত শর্তাবলী প্রযোজ্য হবে:-

                        </p>
                        <ol className="ml-6 leading-none text-justify">
                            <li>০১. সকল প্রকার ডিসকাউন্ট বাট্টা বাদ দিয়ে এবং প্রযোজ্য সকল কর অন্তর্ভুক্ত করে দর উল্লেখ করতে হবে।</li>
                            <li>০২. পণ্য সরবরাহের বিল হতে জাতীয় রাজস্ব বোর্ড কর্তৃক জারীকৃত নীতিমালা অনুযায়ী উৎসে ভ্যাট ও উৎসে আয়কর কর্তন করে অবশিষ্ট টাকা বিল দাখিলের তারিখ হতে ১৫(পনের) কর্মদিবসের মধ্যে পরিশোধ করা হবে।</li>
                            <li>০৩. উল্লিখিত পণ্য সরবরাহকারীর নিজস্ব ব্যবস্থাপনায় ব্যাংক চত্বরে নির্ধারিত সময়সীমার মধ্যে পৌঁছাতে হবে।</li>
                            <li>০৪. প্রযোজ্য ক্ষেত্রে ওয়ারেন্টি ও বিক্রয়োত্তর সেবা নিশ্চিত করতে হবে।</li>
                            <li>০৫. উদ্বৃত মূল্য দরপ্রস্তাব জমাদানের শেষ তারিখ হতে পরবর্তী দুই মাস পর্যন্ত বলবৎ থাকবে।</li>
                            <li>০৬. {`${projection.committeeChairmanInfo.name}, অতিরিক্ত পরিচালক, ${projection.committeeChairmanInfo.section} বিভাগ, বাংলাদেশ ব্যাংক, বরিশাল-এই ঠিকানায় নির্ধারিত বাক্সে আগামী ${decimalToBangla(moment(projection.rfqInfo.quotation_deadLine).format('DD-MM-YYYY'))} তারিখ সকাল ১১.০০ টার মধ্যে দরপ্রস্তাব দাখিল করতে হবে।`}</li>
                            <li>০৭. পণ্যের বিবরণ:</li>
                            {projection.items?.map((item, idx) => <li className="font-bold " key={idx}>{`${idx + 1}. ${item.goods_name_en} -  ${item.goods_model} or equivalent is size and design`}</li>)}
                        </ol>

                        <div className="flex justify-between items-center">
                            <div>
                                <p>সংযুক্তি- (০১) দরপ্রস্তাব দাখিলের ফরম।</p>
                            </div>
                            <div className="text-center">
                                <p> আপনাদের বিশ্বস্ত,</p>
                                <div className="leading-none mt-10 font-bold">
                                    <p>({projection.initiator.name_bn})</p>
                                    <p>{projection.initiator.designation_bn}</p>
                                    <p>জড়সামগ্রী শাখা,</p>
                                    <p>বাংলাদেশ ব্যাংক, বরিশাল।</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {
                projection.rfqInfo?.vendors?.map((vendor, idx) => <div key={vendor.vendor_id} className={`font-[sutonnyOMJ] mx-auto p-16 border-b print:border-none ${idx === projection.rfqInfo?.vendors?.length - 1 ? "" : "break-after-page"} `} >
                    <div className={`flex justify-between items-end`}>
                        <div className={`w-20 h-20 ${!isOpenHeadline ? "invisible" : "visible"}`}><Image alt="logo" src={logo} /></div>
                        <div className={`font-bold text-center ${!isOpenHeadline ? "invisible" : "visible"}`} >
                            <h2 className="text-3xl">বাংলাদেশ ব্যাংক</h2>
                            <h3 className="text-2xl">বরিশাল।</h3>
                        </div>
                        <div>
                            <p className="text-lg font-bold underline">জড়সামগ্রী শাখা</p>
                        </div>
                    </div>
                    <div >
                        <div className="flex justify-between text-lg font-bold border-b-2 border-black">
                            <p>{`সূত্র নং ডিএসঃ ${decimalToBangla(projection.File_Index)}/${decimalToBangla(new Date().getFullYear().toString())}-${decimalToBangla(vendor.outword_no)}`}  </p>
                            <p>তারিখঃ {decimalToBangla(moment(projection.rfqInfo.outword_date).format('DD-MM-YYYY'))}</p>
                        </div>
                    </div>
                    <div className="my-2">

                        <p className="text-lg font-semibold leading-none" >প্রপ্রাইটর, </p>
                        <p className="text-lg font-semibold leading-none" >{`${vendor.vendor_name_bn},`}</p>
                        <p className="text-lg font-semibold leading-none" >{`${vendor.vendor_add_bn}।`} </p>
                    </div>
                    <div className="text-lg">

                        <h2 className="font-semibold text-lg text-center underline leading-4 py-8">{projection.rfqInfo.rfq_heading}</h2>
                        <div className="">
                            <p className="leading-none">জনাব,</p>
                            <p className="indent-6 leading-none text-justify">এ অফিসের জন্য {items} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে। উক্ত {`${projection.rfqInfo.product_coll_name}${totalQuantity > 1 ? "গুলো" : "টি"}`} সরবরাহের নিমিত্তে সংযুক্ত ছকে দর উল্লেখপূর্বক সীলমোহরকৃত খামে নির্বাহী পরিচালক, বাংলাদেশ ব্যাংক, বরিশাল বরাবর আগামী {decimalToBangla(moment(projection.rfqInfo.quotation_deadLine).format('DD-MM-YYYY'))} তারিখের মধ্যে
                                তারিখ সকাল ১১.০০টার মধ্যে দরপ্রস্তাব দাখিল করার জন্য আপনাদেরকে অনুরোধ করা যাচ্ছে। <br></br>
                                দরপ্রস্তাব দাখিলের ক্ষেত্রে নিম্নবর্ণিত শর্তাবলী প্রযোজ্য হবে:-

                            </p>
                            <ol className="ml-6 leading-none text-justify">
                                <li>০১. সকল প্রকার ডিসকাউন্ট বাট্টা বাদ দিয়ে এবং প্রযোজ্য সকল কর অন্তর্ভুক্ত করে দর উল্লেখ করতে হবে।</li>
                                <li>০২. পণ্য সরবরাহের বিল হতে জাতীয় রাজস্ব বোর্ড কর্তৃক জারীকৃত নীতিমালা অনুযায়ী উৎসে ভ্যাট ও উৎসে আয়কর কর্তন করে অবশিষ্ট টাকা বিল দাখিলের তারিখ হতে ১৫(পনের) কর্মদিবসের মধ্যে পরিশোধ করা হবে।</li>
                                <li>০৩. উল্লিখিত পণ্য সরবরাহকারীর নিজস্ব ব্যবস্থাপনায় ব্যাংক চত্বরে নির্ধারিত সময়সীমার মধ্যে পৌঁছাতে হবে।</li>
                                <li>০৪. প্রযোজ্য ক্ষেত্রে ওয়ারেন্টি ও বিক্রয়োত্তর সেবা নিশ্চিত করতে হবে।</li>
                                <li>০৫. উদ্বৃত মূল্য দরপ্রস্তাব জমাদানের শেষ তারিখ হতে পরবর্তী দুই মাস পর্যন্ত বলবৎ থাকবে।</li>
                                <li>০৬. {`${projection.committeeChairmanInfo.name}, অতিরিক্ত পরিচালক, ${projection.committeeChairmanInfo.section} বিভাগ, বাংলাদেশ ব্যাংক, বরিশাল-এই ঠিকানায় নির্ধারিত বাক্সে আগামী ${decimalToBangla(moment(projection.rfqInfo.quotation_deadLine).format('DD-MM-YYYY'))} তারিখ সকাল ১১.০০ টার মধ্যে দরপ্রস্তাব দাখিল করতে হবে।`}</li>
                                <li>০৭. পণ্যের বিবরণ:</li>
                                {projection.items?.map((item, idx) => <li className="font-bold " key={idx}>{`${idx + 1}. ${item.goods_name_en} -  ${item.goods_model} or equivalent is size and design`}</li>)}
                            </ol>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p>সংযুক্তি- (০১) দরপ্রস্তাব দাখিলের ফরম।</p>
                                </div>
                                <div className="text-center">
                                    <p> আপনাদের বিশ্বস্ত,</p>
                                    <div className="leading-none mt-10 font-bold">
                                        <p>({projection.initiator.name_bn})</p>
                                        <p>{projection.initiator.designation_bn}</p>
                                        <p>জড়সামগ্রী শাখা,</p>
                                        <p>বাংলাদেশ ব্যাংক, বরিশাল।</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>)
            }
        </div>
        :
        <div className="min-h-[calc(100vh-44px)] grow">
            <h2>Select a pr number to print projection</h2>

        </div>
    )
};

export default Project;