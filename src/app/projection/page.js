"use client"
import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { saveAs } from 'file-saver';
import '../../app/globals.css'
import { AlignmentType, Document, FrameAnchorType, HorizontalPositionAlign, Packer, PageOrientation, Paragraph, TextRun, VerticalPositionAlign } from 'docx';
import { benWord, decimalToBangla, indianNumberFormat } from '@/utils/benword';
import AddItems from '../components/AddItems';
// import AddEmployee from '../components/AddReceiver';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AddReceiver from '../components/AddReceiver';
import { getData, postData } from '../../../lib/api';
import { useHirarchyContext } from '@/context/hierarchyContext';
import { useProjectionContext } from '@/context/projectionContext';

moment.locale('bn')


const Projection = () => {
    const [projectionData, setProjectionData] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [receiverInfo, setReceiverInfo] = useState([])
    const [requisitioner, setRequisitionr] = useState('');
    const [error, setError] = useState(null)
    const [isShowReceiver, setIsShowReceiver] = useState(false)
    const [recInfo, setRecInfo] = useState([])
    const [sap, setSap] = useState()
    const { hierarchy } = useHirarchyContext()
    const [isShow, setIsShwo] = useState(false)

    const { mutation } = useProjectionContext()



    const { data: employee = {}, refetch } = useQuery({
        queryKey: [sap],
        queryFn: () => getData(`/employee_data?sap=${sap}`),
        enabled: !!sap
    })

    const getSap = (sap) => {
        setSap(sap)
        refetch()
    }

    const handleSaveToDB = () => {
        mutation.mutate(projectionData)
    }


    useEffect(() => {

        let total = 0;
        let connector = "";
        let requisitioner = "";

        receiverInfo.forEach((e, id) => {
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
            else if (id > 0 && receiverInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === receiverInfo.length - 1) {
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
    }, [receiverInfo])
    const handleProjection = (e) => {
        e.preventDefault();
        const form = e.target
        const notingHeading = form.notingHeading.value
        const previousPageNo = form.previousPageNo.value
        const previousParaNo = form.previousParaNo.value
        const proj_from = form.proj_from.value
        const debit_ac_name = form.debit_ac_name.value

        if (receiverInfo.length === 0) {
            const newerror = {
                error: "notingError",
                message: "You must have to add at least one employee before inititiate note."
            }
            setError(newerror)

            return
        }
        else {
            const hasNoItem = receiverInfo.some(employee => employee.itemInfo.length === 0)
            if (hasNoItem) {
                const newerror = {
                    error: "notingError",
                    message: "You must have to add at least one item for each entry before inititating note."
                }
                setError(newerror)

                return
            }
            else {
                const projection = {
                    notingHeading, previousPageNo, previousParaNo, projectionNotingHierarchy: hierarchy, debit_ac_name, proj_from, receiverInfo
                }
                setProjectionData(projection);

                form.reset();
            }
        }
    }


    const handleItems = (e, sap, name) => {
        e.preventDefault()
        const form = e.target;
        const goods_name_bn = form.goods_name_bn.value;
        const goods_name_en = form.goods_name_en.value;
        const goods_model = form.goods_model.value;
        const quantity = form.quantity.value;
        const unit_price = form.unit_price.value;
        const newGoods = { goods_name_bn, goods_name_en, goods_model, quantity, unit_price }
        const updated = receiverInfo.map((e) => {

            if (e.sap === sap && e.name === name) {
                const isIncludes = e.itemInfo.find(item => item.goods_name_en === goods_name_en && item.goods_model === goods_model && item.unit_price === unit_price);
                if (isIncludes) {
                    const updatedItems = e.itemInfo.map((item) => {
                        if (item.goods_name_en === goods_name_en && item.goods_model === goods_model && item.unit_price === unit_price) {
                            const totalQuantity = parseInt(item.quantity) + parseInt(quantity)
                            item.quantity = totalQuantity.toString();
                        }
                        return item
                    })

                    e.itemInfo = updatedItems;
                }
                else {
                    e.itemInfo.push(newGoods)
                }

            }
            return e
        })
        setReceiverInfo(updated);
        form.reset();
    }


    const handleReceiver = (e) => {
        e.preventDefault()
        const form = e.target;
        const name = form.name.value;
        const sap = form.sap?.value ? form.sap.value : "";
        const designation = form.designation?.value ? form.designation.value : "";
        const section = form.section.value;
        const notingDate = form.notingDate.value;
        const itemInfo = [];
        const formData = {
            name, sap, designation, section, notingDate, itemInfo
        }

        const IsExist = receiverInfo.find(e => e.sap === sap && e.name === name && e.notingDate === notingDate)
        if (IsExist) {
            const newerror = {
                error: "empError",
                message: "Entry already exist!"
            }
            setError(newerror)
            form.reset();

            return
        }
        setReceiverInfo([...receiverInfo, formData])
        form.reset();
        setIsShowReceiver(true)
            ;
    }

    const removeReceiver = (name, sap) => {
        // console.log(sap);
        const reminginRecever = receiverInfo.filter((receiver) => {
            const isRemoved = (receiver.name == name && receiver.sap === sap)
            if (!isRemoved) {
                return receiver
            }
        });
        // console.log(reminginEmp);
        setReceiverInfo(reminginRecever)
    }

    const handleremoveItem = (name, sap, item) => {
        // console.log(`sap: ${sap}, goods name: ${goods_name}`);
        const { goods_name_en, goods_model, unit_price } = item
        // item.goods_name_en === goods_name_en && item.goods_model === goods_model && item.unit_price === unit_price
        const updated = receiverInfo.map((e) => {
            if (e.name === name && e.sap === sap) {
                const remingitems = e.itemInfo.filter(item => {
                    const isExist = (item.goods_name_en === goods_name_en && item.goods_model === goods_model && item.unit_price === unit_price)
                    if (!isExist) {
                        return item
                    }
                }


                )
                e.itemInfo = (remingitems)
            }
            return e
        })
        setReceiverInfo(updated);
    }



    const handleKeyDown = (event) => {
        setError(null)
        const { key, keyCode } = event;
        const allwoedKey = keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105 || keyCode === 8 || keyCode === 9 || keyCode === 46 || keyCode === 110 || keyCode === 190;
        if (!allwoedKey) {
            event.preventDefault();
            const error = event.target.name
            const newerror = {
                error,
                message: "Only number key is allowed"
            }
            setError(newerror)

        }
    }
    const formatedValue = (e) => {
        e.target.value = decimalToBangla(e.target.value)
    }
    const handleSaveToWord = async () => {

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
                    children: [
                        parseInt(formdata.previousPageNo) > 0 && new Paragraph({
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
                                    text: `=${decimalToBangla(formdata.previousPageNo)}=                 `,
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
                                    text: formdata.notingHeading,
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
                                    text: `\t ${parseInt(formdata.previousParaNo) + 1 < 10 && "০"}${decimalToBangla((parseInt(formdata.previousParaNo) + 1).toString())}। ${formdata.requisitioner} তারিখের  নোটিং এর প্রেক্ষিতে এ অফিসের ${formdata.proj_for} ব্যবহারের জন্য ${formdata.goods_name} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${formdata.proj_from} ৳${formatedPrice}(${takaInword}) টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`,
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
                                    text: `\t ${parseInt(formdata.previousParaNo) + 2 < 10 && "০"}${decimalToBangla((parseInt(formdata.previousParaNo) + 2).toString())}।  এমতাবস্থায়, ${formdata.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `,
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
                                    text: `\t\tক. ${formdata.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।`,
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
                                    text: `\t\tখ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এম.এম.মডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।`,
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
                                    text: `\t ${parseInt(formdata.previousParaNo) + 3 < 10 && "০"}${decimalToBangla((parseInt(formdata.previousParaNo) + 3).toString())}। সদয় অনুমোদনের জন্য উপস্থাপিত।`,
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
                                    text: `(নাইমুল ইসলাম)`,
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
                                    text: `সহকারী পরিচালক(জড়সামগ্রী)`,
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

                            children: [

                                new TextRun({
                                    text: `(রেজাউল করিম)`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    size: 28

                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 500 },
                            children: [

                                new TextRun({
                                    text: `উপপরিচালক(জড়সামগ্রী)`,
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
                                    text: `(আবদুর রাজ্জাক)`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    size: 28

                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 500 },
                            children: [

                                new TextRun({
                                    text: `যুগ্মপরিচালক(প্রশাসন-২)`,
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
                                    text: `(মোঃ শহিদুল ইসলাম পাড়)`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    size: 28

                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 500 },
                            children: [

                                new TextRun({
                                    text: `অতিরিক্ত পরিচালক(প্রশাসন-২)`,
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
                                    text: `(বিষ্ণুপদ কর)`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    size: 28

                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 500 },
                            children: [

                                new TextRun({
                                    text: `পরিচালক(প্রশাসন)`,
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
                                    text: `(আবদুল মান্নান)`,
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
                                    text: `নির্বাহী পরিচালক`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    size: 28

                                }),
                            ],
                        }),

                    ]
                }
            ]
        })

        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

        const file = new File([blob], 'document.docx')
        const form = new FormData();
        form.append('file', file)

        try {
            const response = await fetch('/api', {
                method: 'POST',
                body: form
            })

            if (!response.ok) {
                throw new Error('Network response was not ok!')
            }
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfUrl);
            setPdfUrl(pdfUrl)
        } catch (error) {
            console.error('Error converting Docs to pdf:', error)
        }

    }
    const handleIsShow = () => {
        setIsShowReceiver(!isShowReceiver)
    }
    return (
        <div className={` p-8 bg-base-200 grow space-y-8`}>
            <div className={`flex card p-4 bg-base-100   flex-col gap-4 `}>
                <div className="text-center flex justify-center gap-4">
                    <h1 className="text-3xl font-bold">প্রাক্কলনের তথ্য দিন</h1>

                </div>

                <div className="card shadow-lg bg-slate-500">
                    <AddReceiver handleReceiver={handleReceiver} receiverInfo={receiverInfo} getSap={getSap} handleIsShow={handleIsShow} employee={employee} isShowReceiver={isShowReceiver}></AddReceiver>
                    {error?.error === 'empError' && <p className='text-red-600 p-4 font-bold'>{error.message}</p>}
                </div>
                <div className={` space-y-1 card shadow-lg bg-slate-500 ${!isShowReceiver ? 'hidden modal' : ''}`} >
                    {receiverInfo.length > 0 &&
                        receiverInfo.map((receiver) => <AddItems key={receiver.sap} error={error} handleItems={handleItems} receiver={receiver} removeReceiver={removeReceiver} handleremoveItem={handleremoveItem}></AddItems>)
                    }
                </div>


                <div className=" w-full shrink-0 ">
                    <form className="grid grid-cols-6  gap-4 m-4" onSubmit={(e) => handleProjection(e)}>
                        <div className="form-control col-span-full">
                            <label className="label">
                                <span className="label-text">নোটিং এর শিরোনাম</span>
                            </label>
                            <input name='notingHeading' required type="text" placeholder="নোটিং এর শিরোনাম লিখুন" className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">পূর্ববর্তী  নোটিং এর পৃষ্ঠা নং</span>
                            </label>
                            <input name='previousPageNo' required type="text" placeholder=" পূর্ববর্তী নোটিং এর পৃষ্ঠা নং লিখুন" className="input input-bordered" onKeyDown={handleKeyDown} onChange={formatedValue} />

                            {error?.error === 'previousPageNo' && <p className='text-red-600 font-bold'>{error.message}</p>}

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">পূর্ববর্তী  নোটিং এর প্যারা নং</span>
                            </label>
                            <input name='previousParaNo' required type="text" placeholder=" পূর্ববর্তী নোটিং এর প্যারা নং লিখুন" className="input input-bordered" onKeyDown={handleKeyDown} onChange={formatedValue} />
                            {error?.error === 'previousParaNo' && <p className='text-red-600 font-bold'>{error.message}</p>}

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">বিকলন খাত</span>
                            </label>
                            <select name='debit_ac_name' required className="select select-bordered w-full">
                                <option value="">--Select--</option>
                                <option value="Furniture, Fixture & Fittings - Office">Furniture, Fixture & Fittings - Office</option>
                                <option value="Furniture, Fixture & Fittings - Residence">Furniture, Fixture & Fittings - Residence</option>
                                <option value="Computer & Networking">Computer & Networking</option>
                                <option value="Motor Vehicles">Motor Vehicles</option>
                                <option value="Security Equipment">Security Equipment</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">প্রাক্কলনপ্রদানকারী শাখা</span>
                            </label>
                            <select name='proj_from' required className="select select-bordered w-full">
                                <option value="">--Select--</option>
                                <option value="প্রকৌশল শাখা">প্রকৌশল শাখা</option>
                                <option value="আইসিটি সেল">আইসিটি সেল</option>
                            </select>

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">প্রাক্কলিত মোট মূল্য</span>
                            </label>
                            <p className="btn rounded-md text-2xl" > {formatedPrice} </p>
                            {error?.error === 'total_price' && <p className='text-red-600 font-bold'>{error.message}</p>}

                        </div>
                        <div className="form-control ">
                            <label className="label">
                                <span className="label-text">Action</span>
                            </label>
                            <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">প্রিভিউ দেখুন</button>
                        </div>
                    </form>
                    {error?.error === 'notingError' && <p className='text-red-600 px-4 font-bold'>{error.message}</p>}

                </div>

            </div>
            {projectionData && <>
                <div className={``} style={{ textAlign: 'justify', fontFamily: 'SutonnyOMJ' }}>
                    <h2 className="font-bold underline text-center pb-3 indent-10 ">{projectionData.notingHeading}</h2>
                    <p style={{ textIndent: '40px' }}>{`  ${requisitioner}  ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${projectionData.proj_from} ৳${formatedPrice}(${takaInword}) টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`
                    }</p>
                    <p style={{ textIndent: '40px' }}>{`এমতাবস্থায়, ${projectionData.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `}
                    </p>
                    <ul style={{ marginLeft: "40px", textIndent: '40px', listStyleType: 'none' }}>

                        <li style={{ padding: '0', margin: '0' }}>ক. {projectionData.proj_from} কর্তৃক প্রদত্ত ৳{formatedPrice}({takaInword}) টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।</li>
                        <li style={{ padding: '0', margin: '0' }}>খ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এম.এম.মডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।</li>
                    </ul>
                    <p style={{ textIndent: '40px' }}>সদয় অনুমোদনের জন্য উপস্থাপিত</p>

                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleSaveToDB}>সেভ করুন</button>
                </div>
            </>
            }
        </div>
    );
};

export default Projection;