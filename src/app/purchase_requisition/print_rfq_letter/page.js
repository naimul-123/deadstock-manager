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
import { getData } from '../../../../lib/api';
import { usePrContext } from '@/context/prContext';
import PrList from '@/components/prLIst';
import { useHirarchyContext } from '@/context/hierarchyContext';

moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [requisitioner, setRequisitionr] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [committeeInfo, setCommitteeInfo] = useState(null)
    const [isOpenCommitte, setIsOpenCommittee] = useState(true)
    const [vendorError, setVendorError] = useState('')
    const [vendor_id, setVendor_id] = useState('')
    const [isOpenVendor, setIsOpenVendor] = useState(true)
    const { employees } = useHirarchyContext();
    const { prnumbers, prNumberLoading, prDataLoading, prData: projection, handlePrNumber, pr_number, committeeSetup } = usePrContext();

    const { data: vendors = {} } = useQuery({
        queryKey: ['vendor', vendor_id],
        queryFn: () => getData(`/purchase_requisition/api/rfq`),
        enabled: !!vendor_id

    })











    useEffect(() => {
        setCommitteeInfo(null)
        setVendorError('')
        let total = 0;
        let connector = "";
        let requisitioner = "";

        projection?.receiverInfo?.forEach((e, id) => {
            let items = ""
            let con = ""
            e.itemInfo.forEach((item, id) => {
                if (id === 0) {
                    con = ""
                }
                else if (id > 0 && e.itemInfo.length === 2) {
                    con = "এবং"
                }
                else if (id > 0 && id === e.itemInfo.length - 1) {
                    con = "এবং"
                }
                else {
                    con = ","
                }

                items += `${con} ${item.quantity < 10 ? '০' : ''}${decimalToBangla(item.quantity)}টি ${item.goods_name_bn} `
                total += item.unit_price * item.quantity;
            })

            if (id === 0) {
                connector = ""
            }
            else if (id > 0 && projection.receiverInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === projection.receiverInfo.length - 1) {
                connector = "এবং"
            }
            else {
                connector = ","
            }
            requisitioner += `${connector} এ অফিসের ${e.section}র  ${decimalToBangla(moment(e.notingDate).format('DD/MM/YYYY'))} তারিখের নোটিং এর প্রেক্ষিতে এ অফিসের  ${e.designation ? `${e.designation} জনাব ${e.name} এর দাপ্তরিক কাজে` : `${e.name}-এ`}  ব্যবহারের জন্য ${items} `

            setRequisitionr(requisitioner);

        });

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])



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
                                <h2 className="text-2xl font-bold"> পারসেজ রিকুইজিশন নং- {pr_number}</h2>
                                <p className="font-bold text-center "> </p>
                                <div className="flex gap-2 justify-between items-center">
                                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                                </div>
                            </div>

                            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-slate-400 my-2 ">

                                <h2 className="text-2xl font-bold"> Add vendor</h2>
                                <div className="flex gap-2 justify-between items-center">
                                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={() => setIsOpenVendor(!isOpenVendor)}>{isOpenVendor ? 'Hide' : "Show"}</button>
                                </div>
                            </div>

                            <div className={`card shadow-lg bg-slate-500 ${!isOpenVendor ? "hidden" : undefined}`}>
                                <form className="grid grid-cols-8 gap-4 m-4 items-center justify-center" onSubmit={(e) => handleAddVendor(e)}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">ভেন্ডর আইডি</span>
                                        </label>
                                        <input name='vendor_id' type="text" placeholder="ভেন্ডরের আইডি" className="input input-bordered" required onBlur={(e) => handleVendorId(e)} />
                                    </div>
                                    <div className="form-control col-span-2">
                                        <label className="label">
                                            <span className="label-text">ভেন্ডর নাম:</span>
                                        </label>
                                        <input name='vendor_name_bn' disabled type="text" defaultValue={vendor?.vendor_name_bn} placeholder="ভেন্ডরের নাম" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control col-span-3">
                                        <label className="label">
                                            <span className="label-text">ভেন্ডরের ঠিকানা</span>
                                        </label>
                                        <input name='vendor_add_bn' disabled type="text" defaultValue={vendor?.vendor_add_bn} placeholder="ভেন্ডরের ঠিকানা" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">আউটওয়ার্ড নং</span>
                                        </label>
                                        <input name='outword_no' type="text" placeholder="আউটওয়ার্ড নং" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control mt-8">
                                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">যোগ করুন</button>
                                    </div>
                                    {vendorError && <p className="text-red-500 font-bold text-lg col-span-full">{vendorError}</p>}
                                </form>

                                <table className="table table-zebra max-w-screen-md mx-auto text-2xl font-[sutonnyOMJ]">
                                    <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                                        <tr >
                                            <td>ক্রঃ</td>
                                            <td>ভেন্ডরের নামঃ</td>
                                            <td>ভেন্ডরের ঠিকানাঃ</td>
                                            <td>আউটওয়ার্ড নাম্বারঃ</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendors.length > 0 && vendors.map((v, id) => <tr key={v.vendor_id}>
                                            <td>{id + 1}</td>
                                            <td>{v.vendor_name_bn}</td>
                                            <td>{v.vendor_add_bn}</td>
                                            <td>{v.outword_no}</td>
                                            <td onClick={() => handleRemoveVendor(v.vendor_id)}>Remove</td>
                                        </tr>)}

                                    </tbody>

                                </table>
                            </div>
                        </div>



                    }
                    {
                        (vendors.length >= 3 && committeeInfo) &&
                        <div className="flex justify-end my-3">
                            <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" disabled={vendors.length < 3 || !committeeInfo} onClick={handleSaveToDB}>তথ্য আপডেট করুন</button>
                        </div>
                    }


                </div>
            }
            <PrList pr_number={pr_number} prdata={prnumbers} heading=" একটি পিআর নাম্বার সিলেক্ট করুন " handlePrNumber={handlePrNumber}></PrList>
        </div>
    );
};

export default Project;