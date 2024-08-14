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

import { usePrContext } from '@/context/prContext';
import PrList from '@/components/prLIst';
import { useHirarchyContext } from '@/context/hierarchyContext';
import { getData } from '../../../../../lib/api';
import Swal from 'sweetalert2';

moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [requisitioner, setRequisitionr] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [committeeInfo, setCommitteeInfo] = useState(null)
    const [rfqError, setRfqError] = useState('')
    const [isOpenCommitte, setIsOpenCommittee] = useState(true)
    const [vendors, setVendors] = useState([])
    const [vendorError, setVendorError] = useState('')
    const [vendor_id, setVendor_id] = useState('')
    const [isOpenVendor, setIsOpenVendor] = useState(true)
    const { employees } = useHirarchyContext();


    const { prnumbers, prNumberLoading, prDataLoading, prData: projection, handlePrNumber, pr_number, rfqSetup } = usePrContext();

    const { data: vendor = {} } = useQuery({
        queryKey: ['vendor', vendor_id],
        queryFn: () => getData(`/purchase_requisition/api/vendors?vendor_id=${vendor_id}`),
        enabled: !!vendor_id

    })




    const handleCommitteeSetup = (e) => {
        e.preventDefault();
        const form = e.target;
        const chairman_name = form.chairman_name.value;
        const chairman_section = form.chairman_section.value;
        const member_vu_name = form.member_vu_name.value;
        const member_sec_name = projection.prNotingHierarchy.ad_ds.initiator ? projection.prNotingHierarchy.ad_ds.name_bn : projection.prNotingHierarchy.dd_ds.initiator ? projection.prNotingHierarchy.dd_ds.name_bn : '';
        const member_sec_designation = projection.prNotingHierarchy.ad_ds.initiator ? projection.prNotingHierarchy.ad_ds.designation_bn : projection.prNotingHierarchy.dd_ds.initiator ? projection.prNotingHierarchy.dd_ds.designation_bn : '';
        const committeeInfo = {
            chairman: {
                name: chairman_name,
                section: chairman_section
            },
            member_vu: {
                name: member_vu_name,
                section: "যুগ্মপরিচালক(ভি.ইউ)"
            },
            member_2: {
                name: JSON.parse(form.member_2.value).name_bn,
                section: JSON.parse(form.member_2.value).designation_bn
            },
            secretary: {
                name: member_sec_name,
                section: `${member_sec_designation}(জড়সামগ্রী)`
            }
        }
        setCommitteeInfo(committeeInfo);
        form.reset()
    }

    const handleIsExistOutwordNo = async (outwordNo) => {
        const isExistOutWord = await getData(`/purchase_requisition/api/checkOutword?outwordNo=${outwordNo}`)
        const isEntry = vendors.find(v => v.outword_no === outwordNo)
        if (isExistOutWord || isEntry) {
            setVendorError('This number has already taken for another vendor. Please check the number and try again.')
        }
        else {
            setVendorError(null)
        }

    }
    const handleVendorId = (e) => {
        const vendorId = e.target.value;
        const isExistVendor = vendors.find(v => v.vendor_id == vendorId)
        if (isExistVendor) {
            setVendorError("Vendor Already added !")
            setVendor_id(null)
            return

        }
        else {
            setVendor_id(vendorId)
            setVendorError('')
        }
    }
    const handleAddVendor = (e) => {
        setVendorError('')
        e.preventDefault();
        const form = e.target
        if (vendorError) {
            return
        }
        else {
            const newVendor = { ...vendor }
            newVendor.outword_no = form.outword_no.value
            setVendors((prev) => [...prev, newVendor])
            form.reset()
        }
    }



    const handleRemoveVendor = (vendor_id) => {
        const updatedVendor = vendors.filter(v => v.vendor_id !== vendor_id)
        setVendors(updatedVendor)
    }
    const handleRFQ = (e) => {
        e.preventDefault();
        const form = e.target;
        const rfq_heading = form.rfq_heading.value;
        const product_coll_name = form.product_coll_name.value;
        const outword_date = form.outword_date.value;
        const quotation_deadLine = form.quotation_deadLine.value;
        if (vendors.length < 3) {
            setRfqError(`You must have to add atleast 3 vendors.`)
            setRfqInfo(null)
            return
        }
        else {
            setRfqError(``)
            const rfqInfo = { rfq_heading, product_coll_name, outword_date, quotation_deadLine, vendors }
            const data = { pr_number, committeeInfo, rfqInfo }
            Swal.fire({
                title: "Do you want to update?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update!"
            }).then((result) => {
                if (result.isConfirmed) {
                    rfqSetup.mutate(data)
                }
            });

        }

    }





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
        <div className="grow h-[calc(100vh - 44px)] scroll-auto overflow-y-auto">
            {prDataLoading ?
                <div className="shrink-0  flex flex-col justify-center items-center ">
                    <span className="loading loading-spinner text-info"></span>
                </div> :
                <div className="shrink-0">
                    {projection &&
                        <div>

                            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-[#D9EEE1] sticky top-0 z-20 ">
                                <h2 className="text-2xl font-bold"> পারসেজ রিকুইজিশন নং- {pr_number}</h2>
                                <p className="font-bold text-center "> </p>
                                <div className="flex gap-2 justify-between items-center">
                                    <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                                </div>
                            </div>
                            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-[#D9EEE1] my-2">
                                <h2 className="font-bold text-center pb-3 text-2xl ">Committee setup</h2>
                                <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]" onClick={() => setIsOpenCommittee(!isOpenCommitte)}>{isOpenCommitte ? "Hide" : "Show"}</button>
                            </div>
                            <div className={` card shadow-lg bg-[#E7E9EB] ${!isOpenCommitte && "hidden"}`}>

                                <form className="grid grid-cols-6  items-end  gap-4 m-4" onSubmit={(e) => handleCommitteeSetup(e)}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">পারসেজ রিকুইজিশন অনুমোদনের তারিখঃ</span>
                                        </label>
                                        <input name='pr_approved_date' type="date" placeholder="পারসেজ রিকুইজিশন অনুমোদনের তারিখ লিখুন" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">কমিটির চেয়ারম্যান:</span>
                                        </label>
                                        <select name='chairman_name' className="select select-bordered w-full" required>
                                            <option value="">---Select---</option>
                                            {employees?.filter((e) => e.designation_bn === "অতিরিক্ত পরিচালক").map((e) => <option key={e.sap} value={e.name_bn}>{e.name_bn}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">চেয়ারম্যানের শাখা</span>
                                        </label>
                                        <select name='chairman_section' className="select select-bordered w-full" required>
                                            <option value="">--Select--</option>
                                            <option value="প্রশাসন-১">প্রশাসন-১</option>
                                            <option value="প্রশাসন-২">প্রশাসন-২</option>
                                            <option value="ব্যাংক পরিদশন">ব্যাংক পরিদশন</option>
                                            <option value="এস.এ.মি">এস.এ.মি</option>
                                            <option value="কৃষিঋণ">কৃষিঋণ</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">সদস্য(ভিইউ)</span>
                                        </label>
                                        <select name='member_vu_name' className="select select-bordered w-full" required>
                                            <option value="">---Select---</option>
                                            {employees?.filter((e) => e.designation_bn === "যুগ্মপরিচালক").map((e) => <option key={e.sap} value={e.name_bn}>{e.name_bn}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">সদস্য(প্রকৌঃ/আইসিটি)</span>
                                        </label>
                                        <select name="member_2" className="select select-bordered w-full" required >
                                            <option value="">---Select---</option>
                                            {employees?.filter((e) => e.designation_bn === "যুগ্মপরিচালক(সিভিল)" || e.designation_bn === "উপপরিচালক(সিভিল)" || e.designation_bn === "উপপরিচালক(আইসিটি)" || e.designation_bn === "সহকারী পরিচালক(আইসিটি)" || e.designation_bn === "সহকারী পরিচালক(তড়িৎ)").map((e) => <option key={e.sap} value={JSON.stringify(e)}>{e.name_bn}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">সদস্য সচিব</span>
                                        </label>
                                        <p className="btn">{projection.prNotingHierarchy.ad_ds.initiator ? projection.prNotingHierarchy.ad_ds.name_bn : projection.prNotingHierarchy.dd_ds.initiator ? projection.prNotingHierarchy.dd_ds.name_bn : ''}</p>

                                    </div>
                                    <div className="form-control mt-4 col-span-full ">
                                        <div className="flex justify-end">
                                            <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]">প্রিভিইউ দেখুন</button>
                                        </div>
                                    </div>
                                </form>

                                {committeeInfo &&
                                    <div className={`text-justify font-[SutonnyOMJ]  }`}>
                                        <h2 className="font-bold underline text-center pb-3 text-2xl ">Preview Committee Members</h2>
                                        <table className="table table-zebra max-w-screen-md mx-auto text-2xl font-[sutonnyOMJ]">
                                            <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                                                <tr className="">
                                                    <td >ক্রঃ</td>
                                                    <td>নাম</td>
                                                    <td>পদবী</td>
                                                    <td>কমিটিতে দ্বায়িত্ব</td>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td>০১.</td>
                                                    <td>{committeeInfo.chairman.name}</td>
                                                    <td>অতিরিক্ত পরিচালক({committeeInfo.chairman.section})</td>
                                                    <td>চেয়ারম্যান</td>
                                                </tr>
                                                <tr>
                                                    <td>০২.</td>
                                                    <td>{committeeInfo.member_vu.name}</td>
                                                    <td>যুগ্মপরিচালক(ভি.ইউ)</td>
                                                    <td>সদস্য</td>
                                                </tr>
                                                <tr>
                                                    <td>০৩</td>
                                                    <td>{committeeInfo.member_2.name}</td>
                                                    <td>{committeeInfo.member_2.section}</td>
                                                    <td>সদস্য</td>

                                                </tr>
                                                <tr>
                                                    <td>০৪.</td>
                                                    <td>{committeeInfo.secretary.name}</td>
                                                    <td>{committeeInfo.secretary.section}</td>
                                                    <td>সদস্য সচিব</td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="text-2xl font-bold text-black">
                                                <tr>
                                                    <td >ক্রঃ</td>
                                                    <td>নাম</td>
                                                    <td>পদবী</td>
                                                    <td>কমিটিতে দ্বায়িত্ব</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                }
                            </div>
                            <div>
                                <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-[#D9EEE1] my-2 ">

                                    <h2 className="text-2xl font-bold"> Add vendor</h2>
                                    <div className="flex gap-2 justify-between items-center">
                                        <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]" onClick={() => setIsOpenVendor(!isOpenVendor)}>{isOpenVendor ? 'Hide' : "Show"}</button>
                                    </div>
                                </div>

                                <div className={`card shadow-lg bg-[#E7E9EB] ${!isOpenVendor ? "hidden" : undefined}`}>
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
                                            <input name='outword_no' type="text" placeholder="আউটওয়ার্ড নং" className="input input-bordered" required onBlur={(e) => handleIsExistOutwordNo(e.target.value)} />
                                        </div>

                                        <div className="form-control mt-8">
                                            <button disabled={vendorError} className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]">যোগ করুন</button>
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
                            <div className="my-3">
                                <form className="grid grid-cols-5 gap-4 m-4 items-end" onSubmit={(e) => handleRFQ(e)}>
                                    <div className="form-control col-span-2">
                                        <label className="label">
                                            <span className="label-text">RFQ শিরোনামঃ</span>
                                        </label>
                                        <input name='rfq_heading' type="text" placeholder="RFQ শিরোনাম লিখুন" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">পন্যের সামষ্টিক নাম:</span>
                                        </label>
                                        <input name='product_coll_name' type="text" placeholder="পন্যের সামষ্টিক নাম" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control ">
                                        <label className="label">
                                            <span className="label-text">আউটওয়ার্ড তারিখ:</span>
                                        </label>
                                        <input name='outword_date' type="date" defaultValue={new Date().toISOString().split('T')[0]} placeholder="ভেন্ডরের ঠিকানা" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control ">
                                        <label className="label">
                                            <span className="label-text">কোটেশন ডেডলাইন:</span>
                                        </label>
                                        <input name='quotation_deadLine' type="date" placeholder="ভেন্ডরের ঠিকানা" className="input input-bordered" required />
                                    </div>
                                    <p className="text-red-500 font-bold text-lg col-span-full">{rfqError && rfqError}</p>
                                    <div className="form-control">
                                        <button disabled={vendors.length < 3 || !committeeInfo} className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]">তথ্য আপডেট করুন</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    }


                </div>
            }

        </div>
    );
};

export default Project;