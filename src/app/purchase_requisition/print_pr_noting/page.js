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
import { FaPrint } from "react-icons/fa6";
import { GrDownload } from "react-icons/gr";
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [requisitioner, setRequisitionr] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)

    const { prnumbers, prNumberLoading, prDataLoading, prData: projection, handlePrNumber, pr_number } = usePrContext();




    useEffect(() => {

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



    const handleSaveToWord = async () => {
        const paragraphs = [
            parseInt(projection?.previousPageNo) > 0 && new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: `পূর্ববতী পৃষ্ঠা হতে,                                 `,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,
                    }),
                    new TextRun({
                        text: `=${decimalToBangla(projection?.previousPageNo)}=                 `,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,
                    }),
                    new TextRun({
                        text: `                    জড়সামগ্রী শাখা`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,
                    }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: projection?.notingHeading,
                        bold: true,
                        underline: true,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,


                    })
                ]
            }),

            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: `\t  ${parseInt(banglaToDecimal(projection?.previousParaNo)) + 4 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 4).toString())}${requisitioner} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে এবং এ  লক্ষ্যে ${projection?.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলন ও অনুমোদিত হয়েছে।`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: `\t ${parseInt(banglaToDecimal(projection?.previousParaNo)) + 5 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 5).toString())}। এমতাবস্থায়, বর্ণিত ক্রয়কার্যক্রমটি সম্পাদন করার জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে:- `,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,
                    })
                ]
            }),

            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: `\t\tক. ক্রয়কার্যক্রমটি সম্পন্ন করার লক্ষ্যে সরবরাহকারী প্রতিষ্ঠান হতে কোটেশন সংগ্রহের উদ্দেশ্যে  এম.এম মডিউল সিস্টেমে পারসেজ রিকুইজিশন নং #${projection?.pr_number} রিলিজ করা যেতে পারে।`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,

                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                    new TextRun({
                        text: `\t\tখ. কোটেশন সংগ্রহের পর পিপিআর ২০০৮ এর ৭২(২) ও ৭৩(১)-এ বর্ণিত বিধান অনুসারে দরপত্রসমূহ উন্মুক্তকরণ, যাচাই-বাছাই ও পর্যারোচনান্তে প্রতিবেদন দাখিলের জন্য একটি দরপত্র মূল্যায়ন কমিটি গঠন করা যেতে পারে এবং উক্ত কমিটি কর্তৃক প্রদত্ত সুপারিশের ভিত্তিতে পরবর্তী কার্যক্রম গ্রহণ করা যেতে পারে।`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,

                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: `\t\tগ. বাংলাদেশ ব্যাংক, প্রধান কার্যালয়ের হিউম্যান রিসোর্সেস ডিপার্টমেন্ট-১ এর ০৬/০৪/২০১৭ ইং তারিখের প্রশাসনিক পরিপত্র নং ১১ ও পিপিআর-এর ৮(১৫) ধারা মোতাবেক দরপত্র মূল্যায়ন কমিটির সদস্যগণ সম্মানী  পেতে পারেন।`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28,

                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 500 },
                children: [
                    new TextRun({
                        text: `\t ${parseInt(banglaToDecimal(projection?.previousParaNo)) + 6 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 6).toString())}।সদয় অনুমোদনের জন্য উপস্থাপিত।`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        color: '#000000',
                        size: 28

                    })
                ]
            }),

            new Paragraph({
                alignment: AlignmentType.CENTER,

                children: [
                    new TextRun({
                        text: `(${projection.prNotingHierarchy?.ad_ds?.name_bn})`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28

                    }),

                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `${projection.prNotingHierarchy?.ad_ds?.designation_bn}(জড়সামগ্রী)`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `আইপি-৪৫০২১`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28

                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 500 },
                children: [
                    new TextRun({
                        text: `(${projection.prNotingHierarchy?.dd_ds?.name_bn})`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text: `${projection.prNotingHierarchy?.dd_ds?.designation_bn}(জড়সামগ্রী)`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28

                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 500 },
                children: [
                    new TextRun({
                        text: `(${projection.prNotingHierarchy?.jd_admin_2?.name_bn})`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28

                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [

                    new TextRun({
                        text: `${projection.prNotingHierarchy?.jd_admin_2?.designation_bn}(প্রশাসন-২)`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28

                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 500 },
                children: [
                    new TextRun({
                        text: `(${projection.prNotingHierarchy?.ad_dir_admin_2?.name_bn})`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),

                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text: `${projection.prNotingHierarchy?.ad_dir_admin_2?.designation_bn}(প্রশাসন-২)`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),

                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 500 },
                children: [
                    new TextRun({
                        text: `${projection.prNotingHierarchy?.director_admin?.name_bn}`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),

                ],
            }),
            new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text: `${projection.prNotingHierarchy?.director_admin?.designation_bn}(প্রশাসন)`,
                        font: {
                            name: 'sutonnyOMJ'
                        },
                        size: 28
                    }),

                ],
            }),

        ]


        const doc = new Document({
            compatibility: {
                doNotExpandShiftReturn: true,

            },
            sections: [
                {
                    properties: {
                        page: {
                            size: {
                                width: 12240,
                                height: 20160,
                            },
                            margin: {
                                top: 1440,
                                right: 1440,
                                bottom: 1440,
                                left: 1440

                            },
                            orientation: PageOrientation.PORTRAIT,

                        }
                    },
                    children: paragraphs
                }
            ]
        })

        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        saveAs(blob, projection.notingHeading)

    }

    const handlePrint = () => {
        window.print()
    }

    console.log(projection)
    if (prNumberLoading) {
        return <div className="shrink-0 max-w-screen-md w-full flex flex-col justify-center items-center mx-auto card">
            <span className="loading loading-spinner text-info"></span>
        </div>
    }
    return (
        <div className="bg-base-200 min-h-[calc(100vh-44px)] flex justify-between">
            {prDataLoading ? <div className="shrink-0 max-w-screen-md w-full flex flex-col justify-center items-center mx-auto card">
                <span className="loading loading-spinner text-info"></span>
            </div> :


                <div className="shrink-0 max-w-screen-md w-full   mx-auto card">
                    {projection &&
                        <>
                            <div className="p-8 flex justify-end items-center  gap-4 print:hidden">
                                <button className="btn btn-square bg-[#003366] text-white hover:text-[#003366]" onClick={handleSaveToWord}><GrDownload /></button>
                                <button className="btn btn-square bg-[#003366] text-white hover:text-[#003366]" onClick={handlePrint}><FaPrint /></button>
                            </div>

                            <div className="text-justify font-[SutonnyOMJ] p-10" >

                                <h2 className="font-bold underline text-center pb-3  " style={{ textIndent: '40px' }}>{projection.notingHeading}</h2>
                                <p className="indent-10">{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 4 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 4).toString())}। ${requisitioner} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে এবং এ  লক্ষ্যে ${projection?.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলন ও অনুমোদিত হয়েছে।`}</p>
                                <p className="indent-10">{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 5 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 5).toString())}। এমতাবস্থায়, বর্ণিত ক্রয়কার্যক্রমটি সম্পাদন করার জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে:-`}
                                </p>
                                <ul className="ml-10  indent-10 list-none">
                                    <li className="" >ক. ক্রয়কার্যক্রমটি সম্পন্ন করার লক্ষ্যে সরবরাহকারী প্রতিষ্ঠান হতে কোটেশন সংগ্রহের উদ্দেশ্যে  এম.এম মডিউল সিস্টেমে পারসেজ রিকুইজিশন নং #{projection?.pr_number} রিলিজ করা যেতে পারে। </li>
                                    <li className="" >খ. কোটেশন সংগ্রহের পর পিপিআর ২০০৮ এর ৭২(২) ও ৭৩(১)-এ বর্ণিত বিধান অনুসারে দরপত্রসমূহ উন্মুক্তকরণ, যাচাই-বাছাই ও পর্যারোচনান্তে প্রতিবেদন দাখিলের জন্য একটি দরপত্র মূল্যায়ন কমিটি গঠন করা যেতে পারে এবং উক্ত কমিটি কর্তৃক প্রদত্ত সুপারিশের ভিত্তিতে পরবর্তী কার্যক্রম গ্রহণ করা যেতে পারে।</li>
                                    <li className="" >গ. বাংলাদেশ ব্যাংক, প্রধান কার্যালয়ের হিউম্যান রিসোর্সেস ডিপার্টমেন্ট-১ এর ০৬/০৪/২০১৭ ইং তারিখের প্রশাসনিক পরিপত্র নং ১১ ও পিপিআর-এর ৮(১৫) ধারা মোতাবেক দরপত্র মূল্যায়ন কমিটির সদস্যগণ সম্মানী  পেতে পারেন।</li>
                                </ul>
                                <p className="" style={{ textIndent: '40px' }}>{`${parseInt(banglaToDecimal(projection?.previousParaNo)) + 6 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(projection?.previousParaNo)) + 6).toString())}। সদয় অনুমোদনের জন্য উপস্থাপিত`}</p>
                                <div className="space-y-10 text-lg">
                                    {
                                        projection.prNotingHierarchy?.ad_ds?.initiator ? <>

                                            <div className="text-center mt-5 font-medium font-[sutonnyOMJ] leading-none">
                                                <h3 className="m-0">{`(${projection.prNotingHierarchy?.ad_ds?.name_bn})`}</h3>
                                                <p className="m-0">{`${projection.prNotingHierarchy?.ad_ds?.designation_bn}(জড়সামগ্রী)`}</p>
                                                <p className="m-0">আইপি-৩৩-৪৫০২১</p>
                                            </div>
                                            <div className="mt-10 font-medium font-[sutonnyOMJ] leading-none">
                                                <h3 className="m-0">{`(${projection.prNotingHierarchy?.dd_ds?.name_bn})`}</h3>
                                                <p className="m-0">{`${projection.prNotingHierarchy?.dd_ds?.designation_bn}(জড়সামগ্রী)`}</p>
                                            </div></> : <div className="text-center mt-5 font-medium font-[sutonnyOMJ] leading-none">
                                            <h3 className="m-0">{`(${projection.prNotingHierarchy?.dd_ds?.name_bn})`}</h3>
                                            <p className="m-0">{`${projection.prNotingHierarchy?.dd_ds?.designation_bn}(জড়সামগ্রী)`}</p>
                                            <p className="m-0">আইপি-৩৩-৪৫০৯৫</p>
                                        </div>

                                    }

                                    <div className="font-medium font-[sutonnyOMJ] leading-none">
                                        <h3 className="m-0">{`(${projection.prNotingHierarchy?.jd_admin_2?.name_bn})`}</h3>
                                        <p className="m-0">{`${projection.prNotingHierarchy?.jd_admin_2?.designation_bn}(প্রশাসন-২)`}</p>
                                    </div>

                                    <div className="font-medium font-[sutonnyOMJ] leading-none">
                                        <h3 className="m-0">{`(${projection.prNotingHierarchy?.ad_dir_admin_2?.name_bn})`}</h3>
                                        <p className="m-0">{`${projection.prNotingHierarchy?.ad_dir_admin_2?.designation_bn}(প্রশাসন-২)`}</p>
                                    </div>

                                    <div className={`font-medium font-[sutonnyOMJ] absolute ${projection.prNotingHierarchy?.ad_ds?.initiator ? "bottom-0" : "print:bottom-32"}  leading-none`}>
                                        <h3 className="m-0">{`(${projection.prNotingHierarchy?.director_admin?.name_bn})`}</h3>
                                        <p className="m-0">{`${projection.prNotingHierarchy?.director_admin?.designation_bn}(প্রশাসন)`}</p>
                                    </div>




                                </div>
                            </div>
                        </>
                    }


                </div>
            }
            <PrList pr_number={pr_number} prdata={prnumbers} heading=" একটি পিআর নাম্বার সিলেক্ট করুন " handlePrNumber={handlePrNumber}></PrList>

        </div>
    );
};

export default Project;