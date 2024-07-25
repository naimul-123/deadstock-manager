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
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [naration, setNaration] = useState('')
    const [projectionApproveInfo, setprojectionApproveInfo] = useState({})
    const [approvedProject, setApprovedProject] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)

    const { data: projections = [], refetch } = useQuery({
        queryKey: ['projections'],
        queryFn: () => getData('/projection/api')

    })

    useEffect(() => {

        let total = 0;
        let connector = "";
        let naration = `${approvedProject?.projectionApproveInfo.approver} মহোদয়ের ${decimalToBangla(moment(approvedProject?.projectionApproveInfo.approved_date).format('DD/MM/YYYY'))} তারিখের অনুমোদনক্রমে`;

        approvedProject?.receiverInfo.forEach((e, id) => {
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
            else if (id > 0 && approvedProject?.receiverInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === approvedProject?.receiverInfo.length - 1) {
                connector = "এবং"
            }
            else {
                connector = ","
            }
            naration += `${connector}  এ অফিসের  ${e.designation ? ` ${e.designation} জনাব ${e.name} এর দাপ্তরিক কাজে  ` : `${e.name}-এ`} ব্যবহারের জন্য ${items} `

            setNaration(naration);

        }



        );

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [approvedProject])

    const updateProjection = (e) => {
        e.preventDefault();
        const form = e.target;
        const notingId = form.notingId.value;
        const projection = projections.find((item) => item._id == notingId)
        const approver = form.approver.value;
        const approved_date = form.approved_date.value;
        const pr_number = form.pr_number.value;

        const projectionApproveInfo = {
            approver, approved_date
        }

        projection.projectionApproveInfo = projectionApproveInfo;
        projection.pr_number = pr_number
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
        <div className="p-8 bg-base-200  space-y-8">

            <div className=" card shadow-lg bg-slate-500">
                <form className="grid grid-cols-5 justify-center  gap-4 m-4" onSubmit={(e) => updateProjection(e)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">নোটিং সিলেক্ট করুন</span>
                        </label>
                        <select name='notingId' className="select select-bordered w-full" required>
                            <option value="">---Select----</option>
                            {projections?.map((item) => <option key={item._id} value={item._id}>{item.notingHeading}</option>)}
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">অনুমোদনকারী</span>
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
                            <span className="label-text">পারসেস রিকুইজিশন নাম্বার</span>
                        </label>
                        <input name='pr_number' type="text" placeholder="পারসেস রিকুইজিশন নাম্বার" className="input input-bordered" required />
                    </div>
                    <div className="form-control ">
                        <label className="label">
                            <span className="label-text">Action</span>
                        </label>
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">নোটিং প্রিভিউ দেখুন</button>
                    </div>
                </form>
            </div>

            {approvedProject &&


                <>
                    <div className={`text-justify  border font-[SutonnyOMJ]    p-20 ${approvedProject ? "" : "hidden"}`}>

                        <h2 className="font-bold underline text-center pb-3 indent-10 ">{approvedProject.notingHeading}</h2>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 1 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 1).toString())}। ${naration} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে এবং এ  লক্ষ্যে ${approvedProject?.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলন ও অনুমোদিত হয়েছে।`}</p>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 2 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 2).toString())}।এমতাবস্থায়, বর্ণিত ক্রয়কার্যক্রমটি সম্পাদন করার জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে:-`}
                        </p>
                        <ul className="ml-10  indent-10 list-none">

                            <li className="" >ক. ক্রয়কার্যক্রমটি সম্পন্ন করার লক্ষ্যে সরবরাহকারী প্রতিষ্ঠান হতে কোটেশন সংগ্রহের উদ্দেশ্যে  এম.এম মডিউল সিস্টেমে পারসেজ রিকুইজিশন নং #{approvedProject?.pr_number} রিলিজ করা যেতে পারে। </li>
                            <li className="" >খ. কোটেশন সংগ্রহের পর পিপিআর ২০০৮ এর ৭২(২) ও ৭৩(১)-এ বর্ণিত বিধান অনুসারে দরপত্রসমূহ উন্মুক্তকরণ, যাচাই-বাছাই ও পর্যারোচনান্তে প্রতিবেদন দাখিলের জন্য একটি দরপত্র মূল্যায়ন কমিটি গঠন করা যেতে পারে এবং উক্ত কমিটি কর্তৃক প্রদত্ত সুপারিশের ভিত্তিতে পরবর্তী কার্যক্রম গ্রহণ করা যেতে পারে।</li>
                            <li className="" >গ. বাংলাদেশ ব্যাংক, প্রধান কার্যালয়ের হিউম্যান রিসোর্সেস ডিপার্টমেন্ট-১ এর ০৬/০৪/২০১৭ ইং তারিখের প্রশাসনিক পরিপত্র নং ১১ ও পিপিআর-এর ৮(১৫) ধারা মোতাবেক দরপত্র মূল্যায়ন কমিটির সদস্যগণ সম্মানী  পেতে পারেন।</li>
                        </ul>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 3 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(approvedProject?.previousParaNo)) + 3).toString())}।সদয় অনুমোদনের জন্য উপস্থাপিত`}</p>

                    </div>
                    <div className="flex justify-end">
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" > আপডেট করুন</button>

                    </div>
                </>

            }



        </div>
    );
};

export default Project;