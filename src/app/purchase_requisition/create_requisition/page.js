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
import { useProjectionContext } from '@/context/projectionContext';
import { useHirarchyContext } from '@/context/hierarchyContext';
import { usePrContext } from '@/context/prContext';
moment.locale('bn')
const Project = ({ params }) => {
    const [takaInword, setTakaInWord] = useState('')
    const [formatedPrice, setFormatedPrice] = useState('')
    const [naration, setNaration] = useState('')
    const [projectionApproveInfo, setprojectionApproveInfo] = useState({})

    const [totalPrice, setTotalPrice] = useState(0)
    const [preview, setPreview] = useState(null)
    const { projections } = useProjectionContext();
    const { hierarchy } = useHirarchyContext();
    const { mutation, } = usePrContext();


    useEffect(() => {

        let total = 0;
        let connector = "";
        let naration = `${preview?.projectionApproveInfo.approver} মহোদয়ের ${decimalToBangla(moment(preview?.projectionApproveInfo.approved_date).format('DD/MM/YYYY'))} তারিখের অনুমোদনক্রমে`;

        preview?.receiverInfo.forEach((e, id) => {
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
            else if (id > 0 && preview?.receiverInfo.length === 2) {
                connector = "এবং"
            }
            else if (id > 0 && id === preview?.receiverInfo.length - 1) {
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
    }, [preview])

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
        const updatedProjection = { ...projection, pr_number, projectionApproveInfo }
        setPreview(updatedProjection)
        form.reset();

    }

    const handleSaveToDB = () => {
        const { _id: id, pr_number, projectionApproveInfo } = preview;
        const prNotingHierarchy = { ...hierarchy }
        delete prNotingHierarchy.ed
        delete prNotingHierarchy.ed_cc
        const data = { id, pr_number, projectionApproveInfo, prNotingHierarchy }
        mutation.mutate(data)
    }

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
                            <option value="নির্বাহী পরিচালক(চলতি দ্বায়িত্বে)">নির্বাহী পরিচালক(চলতি দ্বায়িত্বে)</option>
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

            {preview &&


                <>
                    <div className={`text-justify  border font-[SutonnyOMJ]    p-20 ${preview ? "" : "hidden"}`}>

                        <h2 className="font-bold underline text-center pb-3 indent-10 ">{preview.notingHeading}</h2>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(preview?.previousParaNo)) + 1 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(preview?.previousParaNo)) + 1).toString())}। ${naration} ক্রয়ের সিদ্ধান্ত গৃহীত হয়েছে এবং এ  লক্ষ্যে ${preview?.proj_from} কর্তৃক প্রদত্ত ৳${formatedPrice}(${takaInword}) টাকার ব্যয়প্রাক্কলন ও অনুমোদিত হয়েছে।`}</p>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(preview?.previousParaNo)) + 2 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(preview?.previousParaNo)) + 2).toString())}।এমতাবস্থায়, বর্ণিত ক্রয়কার্যক্রমটি সম্পাদন করার জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে:-`}
                        </p>
                        <ul className="ml-10  indent-10 list-none">

                            <li className="" >ক. ক্রয়কার্যক্রমটি সম্পন্ন করার লক্ষ্যে সরবরাহকারী প্রতিষ্ঠান হতে কোটেশন সংগ্রহের উদ্দেশ্যে  এম.এম মডিউল সিস্টেমে পারসেজ রিকুইজিশন নং #{preview?.pr_number} রিলিজ করা যেতে পারে। </li>
                            <li className="" >খ. কোটেশন সংগ্রহের পর পিপিআর ২০০৮ এর ৭২(২) ও ৭৩(১)-এ বর্ণিত বিধান অনুসারে দরপত্রসমূহ উন্মুক্তকরণ, যাচাই-বাছাই ও পর্যারোচনান্তে প্রতিবেদন দাখিলের জন্য একটি দরপত্র মূল্যায়ন কমিটি গঠন করা যেতে পারে এবং উক্ত কমিটি কর্তৃক প্রদত্ত সুপারিশের ভিত্তিতে পরবর্তী কার্যক্রম গ্রহণ করা যেতে পারে।</li>
                            <li className="" >গ. বাংলাদেশ ব্যাংক, প্রধান কার্যালয়ের হিউম্যান রিসোর্সেস ডিপার্টমেন্ট-১ এর ০৬/০৪/২০১৭ ইং তারিখের প্রশাসনিক পরিপত্র নং ১১ ও পিপিআর-এর ৮(১৫) ধারা মোতাবেক দরপত্র মূল্যায়ন কমিটির সদস্যগণ সম্মানী  পেতে পারেন।</li>
                        </ul>
                        <p className="indent-10">{`${parseInt(banglaToDecimal(preview?.previousParaNo)) + 3 < 10 ? "০" : ""}${decimalToBangla((parseInt(banglaToDecimal(preview?.previousParaNo)) + 3).toString())}।সদয় অনুমোদনের জন্য উপস্থাপিত`}</p>

                    </div>
                    <div className="flex justify-end">
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleSaveToDB} > আপডেট করুন</button>

                    </div>
                </>

            }



        </div>
    );
};

export default Project;