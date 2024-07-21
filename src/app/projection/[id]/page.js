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
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [requisitioner, setRequisitionr] = useState('')
    const [approvedProject, setApprovedProject] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const id = params.id;
    const projection = data?.find(d => d._id === parseInt(id))
    // console.log(projection);

    useEffect(() => {

        let total = 0;
        let connector = "";
        let requisitioner = "";

        projection.employeeInfo.forEach((e, id) => {
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
            else if (id > 0 && projection.employeeInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === projection.employeeInfo.length - 1) {
                connector = "এবং"
            }
            else {
                connector = ","
            }
            requisitioner += `${connector} এ অফিসের ${e.section}র  ${decimalToBangla(moment(e.notingDate).format('DD/MM/YYYY'))} তারিখের নোটিং এর প্রেক্ষিতে এ অফিসের ${e.designation} জনাব ${e.name} এর দাপ্তরিক কাজে ব্যবহারের জন্য ${items} `

            setRequisitionr(requisitioner);

        });

        setTotalPrice(total);
        setTakaInWord(benWord(total));
        setFormatedPrice(indianNumberFormat(total));
    }, [projection])

    const updateProjection = (e) => {
        e.preventDefault();
        const form = e.target;
        const approver = form.approver.value;
        const approved_date = form.approved_date.value;

        const projectionApproveInfo = {
            approver, approved_date
        }

        projection.projectionApproveInfo = projectionApproveInfo
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
        <div className=" ">
            <div className=" w-full shrink-0 ">
                <form className="grid grid-cols-3 justify-center  gap-4 m-4" onSubmit={(e) => updateProjection(e)}>
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



                    <div className="form-control ">
                        <label className="label">
                            <span className="label-text">Action</span>
                        </label>
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">তথ্য আপডেট করুন</button>
                    </div>
                </form>
                {/* {error?.error === 'notingError' && <p className='text-red-600 px-4 font-bold'>{error.message}</p>} */}

            </div>
            {projection &&


                <>
                    <div className="text-justify  border  max-h-[1344px] p-20" style={{ textAlign: 'justify', fontFamily: 'SutonnyOMJ', maxWidth: "768px", maxHeight: "1344px" }}>

                        <h2 className="font-bold underline text-center pb-3  " style={{ textIndent: '40px' }}>{projection.notingHeading}</h2>
                        <p className="" style={{ fontFamily: 'SutonnyOMJ', textIndent: '40px' }}>{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 1 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 1).toString())}। ${requisitioner} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${projection?.proj_from} ৳${formatedPrice}(${takaInword}) টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`}</p>
                        <p className="" style={{ textIndent: '40px' }}>{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 2 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 2).toString())}।এমতাবস্থায়, ${projection.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `}
                        </p>
                        <ul className="" style={{ marginLeft: "40px", textIndent: '40px', listStyleType: 'none' }}>

                            <li className="" style={{ padding: '0', margin: '0' }}>ক. {projection.proj_from} কর্তৃক প্রদত্ত ৳{formatedPrice}({takaInword}) টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।</li>
                            <li className="" style={{ padding: '0', margin: '0' }}>খ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এম.এম.মডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।</li>
                        </ul>


                        <p className="" style={{ textIndent: '40px' }}>{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 3 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 3).toString())}।সদয় অনুমোদনের জন্য উপস্থাপিত`}</p>

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