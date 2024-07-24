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
import data from '../../../../public/projections.json'
import { usePathname } from 'next/navigation';
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [naration, setNaration] = useState('')
    const [projection, setProjection] = useState(null)
    const [approvedProject, setApprovedProject] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [isShow, setIsShow] = useState(false)
    const [projectionError, setProjectionError] = useState('')

    const projections = data?.filter((item) => item.pr_number && item.committeeInfo)

    const handleIsShow = () => {
        setIsShow(!isShow)
    }
    useEffect(() => {

        let total = 0;
        projection?.employeeInfo?.forEach((e, id) => {

            e.itemInfo.forEach((item, id) => {

                total += item.unit_price * item.quantity;
            })

        }



        );

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])
    useEffect(() => {

        let total = 0;
        let connector = "";
        let naration = `${approvedProject?.projectionApproveInfo.approver} মহোদয়ের ${decimalToBangla(moment(approvedProject?.projectionApproveInfo.approved_date).format('DD/MM/YYYY'))} তারিখের অনুমোদনক্রমে`;

        approvedProject?.employeeInfo.forEach((e, id) => {
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

                items += `${con} ${item.quantity < 10 ? '০' : ''}${decimalToBangla(item.quantity)}টি ${item.goods_name} `
                total += item.unit_price * item.quantity;
            })

            if (id === 0) {
                connector = ""
            }
            else if (id > 0 && approvedProject?.employeeInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === approvedProject?.employeeInfo.length - 1) {
                connector = "এবং"
            }
            else {
                connector = ","
            }
            naration += `${connector}  এ অফিসের ${e.designation} জনাব ${e.name} এর দাপ্তরিক কাজে ব্যবহারের জন্য ${items} `

            setNaration(naration);

        }



        );

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [approvedProject])

    const handlePr = (e) => {
        e.preventDefault()
        const pr_number = e.target.pr_number.value;
        console.log(pr_number);
        const projection = projections.find(item => item.committeeInfo)
        if (projection) {
            setProjection(projection)
            setProjectionError('')
        }
        else {
            setProjection(null)
            setProjectionError(`No data found`)
            setApprovedProject(null)
        }

    }
    console.log(projection);

    const updateProjection = (e) => {
        e.preventDefault();
        const form = e.target;


        const approver = form.approver.value;
        const approved_date = form.approved_date.value;
        const chairman_name = form.chairman_name.value;
        const chairman_section = form.chairman_section.value;
        const member_vu_name = form.member_vu_name.value;
        const member_2_name = form.member_2_name.value;
        const member_2_designation = form.member_2_designation.value;
        const member_sec_name = form.member_sec_name.value;
        const member_sec_designation = form.member_sec_designation.value;

        const prApproveInfo = {
            approver, approved_date
        }
        const committeeInfo = {
            chairman_name, chairman_section, member_vu_name, member_2_name, member_2_designation, member_sec_name, member_sec_designation
        }

        projection.prApproveInfo = prApproveInfo;
        projection.committeeInfo = committeeInfo;

        setApprovedProject(projection)
        form.reset();

    }

    console.log(approvedProject);
    // console.log(requisitioner);


    // const handleSaveToWord = async () => {

    //     const doc = new Document({
    //         compatibility: {
    //             doNotExpandShiftReturn: true,

    //         },
    //         sections: [
    //             {
    //                 properties: {
    //                     page: {
    //                         size: {
    //                             width: 12240,
    //                             height: 20160,
    //                         },
    //                         margin: {
    //                             top: 1440,
    //                             right: 1440,
    //                             bottom: 1440,
    //                             left: 1440

    //                         },
    //                         orientation: PageOrientation.PORTRAIT,

    //                     }
    //                 },
    //                 children: [
    //                     parseInt(project?.previousPageNo) > 0 && new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `পূর্ববতী পৃষ্ঠা হতে,                                 `,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,
    //                             }),
    //                             new TextRun({
    //                                 text: `=${decimalToBangla(project?.previousPageNo)}=                 `,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,
    //                             }),
    //                             new TextRun({
    //                                 text: `                    জড়সামগ্রী শাখা`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,
    //                             }),
    //                         ]
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: project?.notingHeading,
    //                                 bold: true,
    //                                 underline: true,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,


    //                             })
    //                         ]
    //                     }),

    //                     new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `\t ${parseInt(project?.previousParaNo) + 1 < 10 && "০"}${decimalToBangla((parseInt(project?.previousParaNo) + 1).toString())}। ${project?.requisitioner} তারিখের  নোটিং এর প্রেক্ষিতে এ অফিসের ${project?.proj_for} ব্যবহারের জন্য ${project?.goods_name} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    // ${project?.proj_from} ৳${formatedPrice}(${takaInword}) টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,


    //                             })
    //                         ]
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `\t ${parseInt(project?.previousParaNo) + 2 < 10 && "০"}${decimalToBangla((parseInt(project?.previousParaNo) + 2).toString())}।  এমতাবস্থায়, ${project.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,


    //                             })
    //                         ]
    //                     }),

    //                     new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `\t\tক. ${project?.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,

    //                             })
    //                         ]
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 50 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `\t\tখ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এম.এম.মডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28,

    //                             })
    //                         ]
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.JUSTIFIED,
    //                         spacing: { after: 500 },
    //                         children: [
    //                             new TextRun({
    //                                 text: `\t ${parseInt(project?.previousParaNo) + 3 < 10 && "০"}${decimalToBangla((parseInt(project?.previousParaNo) + 3).toString())}। সদয় অনুমোদনের জন্য উপস্থাপিত।`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 color: '#000000',
    //                                 size: 28

    //                             })
    //                         ]
    //                     }),

    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,

    //                         children: [
    //                             new TextRun({
    //                                 text: `(নাইমুল ইসলাম)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),

    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,

    //                         children: [

    //                             new TextRun({
    //                                 text: `সহকারী পরিচালক(জড়সামগ্রী)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),

    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,

    //                         children: [

    //                             new TextRun({
    //                                 text: `আইপি-৪৫০২১`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,

    //                         children: [

    //                             new TextRun({
    //                                 text: `(রেজাউল করিম)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,
    //                         spacing: { after: 500 },
    //                         children: [

    //                             new TextRun({
    //                                 text: `উপপরিচালক(জড়সামগ্রী)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,

    //                         children: [

    //                             new TextRun({
    //                                 text: `(আবদুর রাজ্জাক)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,
    //                         spacing: { after: 500 },
    //                         children: [

    //                             new TextRun({
    //                                 text: `যুগ্মপরিচালক(প্রশাসন-২)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,

    //                         children: [

    //                             new TextRun({
    //                                 text: `(মোঃ শহিদুল ইসলাম পাড়)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,
    //                         spacing: { after: 500 },
    //                         children: [

    //                             new TextRun({
    //                                 text: `অতিরিক্ত পরিচালক(প্রশাসন-২)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,

    //                         children: [

    //                             new TextRun({
    //                                 text: `(বিষ্ণুপদ কর)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,
    //                         spacing: { after: 500 },
    //                         children: [

    //                             new TextRun({
    //                                 text: `পরিচালক(প্রশাসন)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,

    //                         children: [

    //                             new TextRun({
    //                                 text: `(আবদুল মান্নান)`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),
    //                     new Paragraph({
    //                         alignment: AlignmentType.LEFT,
    //                         children: [

    //                             new TextRun({
    //                                 text: `নির্বাহী পরিচালক`,
    //                                 font: {
    //                                     name: 'sutonnyOMJ'
    //                                 },
    //                                 size: 28

    //                             }),
    //                         ],
    //                     }),

    //                 ]
    //             }
    //         ]
    //     })

    //     const buffer = await Packer.toBuffer(doc);
    //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    //     saveAs(blob, project.notingHeading)

    // }

    // const handlePrint = () => {
    //     window.print()
    // }

    return (
        <div className="p-8 bg-base-200  space-y-2  shrink-0">
            <div>
                <form onSubmit={handlePr}>
                    <div className="form-control flex-row max-w-screen-lg mx-auto gap-3">

                        <label className="label shrink-0">
                            <span className="label-text text-2xl">PR number:</span>
                        </label>
                        <input name='pr_number' className="input input-bordered w-full" required />
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">খুজুন</button>
                    </div>
                </form>

            </div>
            <div className="card shadow-lg bg-slate-500 ">

                {projection ? <>
                    <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-slate-400  ">
                        {projection?.notingHeading ? <h2 className="text-2xl font-bold"> {projection.notingHeading}</h2> :
                            ""}
                        <div className="flex gap-2 justify-between items-center">
                            <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</button>
                        </div>
                    </div>
                    <div>
                        <form className="grid grid-cols-5 justify-center  gap-4 m-4" onSubmit={(e) => updateProjection(e)}>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">রিকুইজিশন অনুমোদনকারী</span>
                                </label>
                                <select name='approver' className="select select-bordered w-full" required>
                                    <option value="নির্বাহী পরিচালক">নির্বাহী পরিচালক</option>
                                    <option value="পরিচালক(প্রশাশন)">পরিচালক(প্রশাশন)</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">অনুমোদনের তারিখ</span>
                                </label>
                                <input name='approved_date' type="date" placeholder="নোটিং অনুমোদনকারীর নাম তারিখ  লিখুন" className="input input-bordered" required />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">কমিটির চেয়ারম্যানের নাম</span>
                                </label>
                                <input name='chairman_name' type="text" placeholder="কমিটির চেয়ারম্যানের নাম লিখুন" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">শাখা/বিভাগ</span>
                                </label>
                                <select name='chairman_section' className="select select-bordered w-full" required>
                                    <option value="প্রশাসন-১">প্রশাসন-১</option>
                                    <option value="প্রশাসন-২">প্রশাসন-২</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">সদস্য (ভিইউ) নাম</span>
                                </label>
                                <input name='member_vu_name' type="text" placeholder="সদস্য (ভিইউ) নাম লিখুন" className="input input-bordered" required />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">সদস্য-২ নাম</span>
                                </label>
                                <input name='member_2_name' type="text" placeholder={`সদস্য (প্রকৌশল/আইসিটি) নাম লিখুন`} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">সদস্য-২ পদবী</span>
                                </label>
                                <select name='member_2_designation' className="select select-bordered w-full" required>
                                    <option value="যুগ্মপরিচালক">যুগ্মপরিচালক</option>
                                    <option value="উপপরিচালক">উপপরিচালক</option>
                                    <option value="সহকারী পরিচালক">সহকারী পরিচালক</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">সদস্য সচিবের নাম</span>
                                </label>
                                <input name='member_sec_name' type="text" placeholder={`সদস্য সচিবের নাম লিখুন`} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">সদস্য সচিবের পদবী</span>
                                </label>
                                <select name='member_sec_designation' className="select select-bordered w-full" required>
                                    <option value="যুগ্মপরিচালক">যুগ্মপরিচালক</option>
                                    <option value="উপপরিচালক">উপপরিচালক</option>
                                    <option value="সহকারী পরিচালক">সহকারী পরিচালক</option>
                                </select>
                            </div>


                            <div className="form-control ">
                                <label className="label">
                                    <span className="label-text">Action</span>
                                </label>
                                <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">তথ্য আপডেট করুন</button>
                            </div>
                        </form>
                    </div>
                </> :
                    ""
                }

                {
                    projectionError ? <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-slate-400  ">
                        <h2 className="text-2xl font-bold text-red-600"> No data found</h2>
                    </div> : ""
                }



            </div>

            {approvedProject &&


                <>
                    <div className={`text-justify  border font-[SutonnyOMJ]    p-8 ${approvedProject ? "" : "hidden"}`}>

                        <h2 className="font-bold underline text-center pb-3 text-2xl ">দরপত্র মূল্যায়ন কমিটি</h2>
                        <table className="table table-zebra max-w-screen-md mx-auto text-2xl font-[sutonnyOMJ] bg-slate-300 border">
                            <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                                <tr className="text-center">
                                    <td >ক্রঃ</td>
                                    <td>কমিটির পদ</td>
                                    <td>নাম</td>
                                    <td>পদবী</td>
                                    <td>শাখা</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>০১.</td>
                                    <td>চেয়ারম্যান</td>
                                    <td>{approvedProject.committeeInfo.chairman_name}</td>
                                    <td>অতিরিক্ত পরিচালক</td>
                                    <td>{approvedProject.committeeInfo.chairman_section}</td>
                                </tr>
                                <tr>
                                    <td>০২.</td>
                                    <td>সদস্য(ভি.ইউ)</td>
                                    <td>{approvedProject.committeeInfo.member_vu_name}</td>
                                    <td>যুগ্মপরিচালক</td>
                                    <td>ভেরিফিকেশন ইউনিট</td>
                                </tr>
                                <tr>
                                    <td>০৩.</td>
                                    <td>সদস্য-২</td>
                                    <td>{approvedProject.committeeInfo.member_2_name}</td>
                                    <td>{approvedProject.committeeInfo.member_2_designation}</td>
                                    <td>{approvedProject.proj_from}</td>
                                </tr>
                                <tr>
                                    <td>০৪.</td>
                                    <td>সদস্য সচিব</td>
                                    <td>{approvedProject.committeeInfo.member_sec_name}</td>
                                    <td>{approvedProject.committeeInfo.member_sec_designation}</td>
                                    <td>জড়সামগ্রী শাখা</td>
                                </tr>
                            </tbody>
                            <tfoot className="text-2xl font-bold text-black text-center">
                                <tr >
                                    <td >ক্রঃ</td>
                                    <td>কমিটির পদ</td>
                                    <td>নাম</td>
                                    <td>পদবী</td>
                                    <td>শাখা</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </>

            }

            {/* <div className="flex justify-end">
                <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleSaveToWord}>ডাউনলোড করুন</button>

            </div> */}

        </div>
    );
};

export default Project;