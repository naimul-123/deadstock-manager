"use client"
import React, { useRef } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { saveAs } from 'file-saver';

import { AlignmentType, Document, Packer, PageOrientation, Paragraph, TextRun } from 'docx';
const Projection = () => {
    const [formdata, setFormData] = useState(null)
    const contentRef = useRef()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        setFormData(data);

    }

    const handleKeyDown = (event) => {
        const { key, keyCode } = event;
        const isNumpadKey = keyCode >= 96 && keyCode <= 105;
        if (isNumpadKey) {
            event.preventDefault();
            alert('Number pad key is not valid');

        }
    }
    const handleSaveToWord = async () => {
        // const content = contentRef.current.innerHTML;
        // const converted = htmlDocx.asBlob(content);
        // saveAs(converted, formdata.proj_for)
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
                                    text: `\t${formdata.requisitioner} তারিখের  নোটিং এর প্রেক্ষিতে এ অফিসের ${formdata.proj_for} ব্যবহারের জন্য ${formdata.goods_name} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${formdata.proj_from} ${formdata.total_price} টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`,
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
                                    text: `\t এমতাবস্থায়, ${formdata.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `,
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
                                    text: `\t\tক. ${formdata.proj_from} কর্তৃক প্রদত্ত ৳${formdata.total_price} টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।`,
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
                                    text: `\t\tখ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এমমডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।`,
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
                            spacing: { after: 1000 },
                            children: [
                                new TextRun({
                                    text: `\tসদয় অনুমোদনের জন্য উপস্থাপিত।`,
                                    font: {
                                        name: 'sutonnyOMJ'
                                    },
                                    color: '#000000',
                                    size: 28

                                })
                            ]
                        }),
                    ]
                }
            ]
        })
        // this.doc.Settings.addCompatibility().doNotExpandShiftReturn();
        const blob = await Packer.toBlob(doc)
        saveAs(blob, formdata.proj_for)
    }

    return (
        <div className=" p-8 bg-base-200 min-h-screen">
            <div className="flex p-4 flex-col gap-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">প্রাক্কলনের তথ্য দিন</h1>

                </div>
                <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form className="grid grid-cols-2 gap-4 m-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">নোটিং এর শিরোনাম</span>
                            </label>
                            <input {...register('notingHeading', { required: true })} type="text" placeholder="নোটিং এর শিরোনাম লিখুন" className="input input-bordered" onKeyDown={handleKeyDown} />

                            {errors.proj_from && <p className='text-red-600 font-bold'>{errors.proj_from}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">যে শাখা থেকে রিকুইজিশন আসছে</span>
                            </label>
                            <input {...register('requisitioner', { required: true })} type="text" placeholder="শাখা/বিভাগের নাম ও নোটিং তারিখ  লিখুন" className="input input-bordered" onKeyDown={handleKeyDown} />

                            {errors.proj_from && <p className='text-red-600 font-bold'>{errors.proj_from}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">প্রাক্কলনপ্রদানকারী শাখা</span>
                            </label>
                            <select {...register('proj_from', { required: true })} className="select select-bordered w-full">
                                <option value="">--Select--</option>
                                <option value="প্রকৌশল শাখা">প্রকৌশল শাখা</option>
                                <option value="আইসিটি সেল">আইসিটি সেল</option>
                            </select>
                            {errors.proj_from && <p className='text-red-600 font-bold'>{errors.proj_from}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">যার জন্য কেনা হবে</span>
                            </label>
                            <input {...register('proj_for', { required: true })} type="text" placeholder="যার জন্য কেনা হবে তার নাম লিখুন" className="input input-bordered" />

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">যা কেনা হবে</span>
                            </label>
                            <input {...register('goods_name', { required: true })} type="text" placeholder="যা কেনা হবে লিখুন" className="input input-bordered" />

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">প্রাক্কলিত মোট মূল্য</span>
                            </label>
                            <input {...register('total_price', { required: true })} type="text" placeholder="মোট মূল্য লিখুন" className="input input-bordered" onKeyDown={handleKeyDown} />

                        </div>
                        <div className="form-control mt-6 col-span-full">
                            <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">সেভ করুন</button>
                        </div>
                    </form>
                </div>
            </div>

            {formdata && <>
                <div ref={contentRef} style={{ textAlign: 'justify', fontFamily: 'SutonnyOMJ' }}>
                    <p style={{ textIndent: '40px' }}>{`  ${formdata.requisitioner} তারিখের  নোটিং এর প্রেক্ষিতে এ অফিসের ${formdata.proj_for} ব্যবহারের জন্য ${formdata.goods_name} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${formdata.proj_from} ${formdata.total_price} টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`
                    }</p>
                    <p style={{ textIndent: '40px' }}>{`এমতাবস্থায়, ${formdata.proj_from} কর্তৃক প্রদত্ত    মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `}
                        <ul style={{ marginLeft: "40px", textIndent: '40px', listStyleType: 'none' }}>
                            <li style={{ padding: '0', margin: '0' }}>ক. {formdata.proj_from} কর্তৃক প্রদত্ত ৳{formdata.total_price} টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।</li>
                            <li style={{ padding: '0', margin: '0' }}>খ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এমমডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।</li>
                        </ul>

                    </p>
                    <p style={{ textIndent: '40px' }}>সদয় অনুমোদনের জন্য উপস্থাপিত</p>

                </div>
                <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleSaveToWord}>ডাউনলোড করুন</button>

            </>

            }

        </div>
    );
};

export default Projection;