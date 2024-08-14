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
import VendorValue from '@/app/components/vendorValue';
import { useForm } from 'react-hook-form';

moment.locale('bn')
const Project = ({ params }) => {
    const [formatedPrice, setFormatedPrice] = useState('')
    const [valueInfo, setValueInfo] = useState(null)
    const { rfqData: projection, rfqPrNumber, valueMutation } = usePrContext();
    const { register, handleSubmit, watch, reset } = useForm();

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

    const handleFormData = (data) => {

        const valuationData = { valueInfo: data, pr_number: projection.pr_number }
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
                // console.log(valuationData);
                valueMutation.mutate(valuationData)
            }
        });

    };

    useEffect(() => {
        setValueInfo(null)
        const subscribe = watch((data) => {
            const { vendors } = data;
            vendors?.forEach(vendor => {
                const total = vendor.values.reduce((sum, item) => {
                    return sum += (parseFloat(item.price ? item.price : 0) * parseInt(item.quantity))
                }, 0)
                vendor.total_price = total.toString()
            })
            setValueInfo(data);

        });


        return () => subscribe.unsubscribe();

    }, [watch, projection])

    useEffect(() => {
        reset()
        let total = 0;
        projection?.items.forEach((item, id) => {
            total += item.unit_price * item.quantity
        })

        setFormatedPrice(indianNumberFormat(total));
    }, [projection, reset])



    return (
        <div className="grow h-[calc(100vh - 44px)] scroll-auto overflow-y-auto min-w-fit">

            {projection &&
                <div className="font-[sutonnyOMJ]">

                    <div className="flex px-4 py-2 font-bold gap-2 justify-between items-center shadow-lg text-2xl bg-[#D9EEE1] sticky top-0 z-10 ">
                        <h2 className=" "> পারসেজ রিকুইজিশন নং- {rfqPrNumber}</h2>
                        <p className="  " >প্রাক্কলিত মোট মূল্য= ৳{formatedPrice}</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(handleFormData)}>
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                                        <tr >
                                            <th></th>
                                            <th></th>
                                            {projection.rfqInfo.vendors?.map((vendor, vid) => <th key={vendor.vendor_id}>
                                                {vendor.vendor_name_bn} </th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            {projection.rfqInfo.vendors?.map((vendor, vid) =>
                                                <td key={`total${vid}`}>

                                                    <input {...register(`vendors[${vid}].total_price`)} type="hidden" defaultValue={valueInfo?.vendors?.[vid]?.total_price > 0 ? valueInfo?.vendors?.[vid]?.total_price : '' || ''} className="input input-bordered font-bold bg-[#D9EEE1]" />
                                                    <input readOnly defaultValue={valueInfo?.vendors?.[vid]?.total_price > 0 ? valueInfo?.vendors?.[vid]?.total_price : '' || ''} className="input font-bold focus:outline-none focus:border-none bg-[#D9EEE1]" />

                                                </td>
                                            )}
                                        </tr>
                                        {projection.items?.map((item, itemId) => {

                                            return (
                                                <tr key={itemId}>
                                                    <td>{itemId + 1}</td>
                                                    <td>{`${item.goods_name_en} (${item.quantity})`}</td>
                                                    {projection.rfqInfo.vendors?.map((vendor, vid) =>
                                                        <td key={vid}>

                                                            <input {...register(`vendors[${vid}].values[${itemId}].price`)} type="text" placeholder={`${vendor.vendor_name_bn} দর`} className="input input-bordered" required />
                                                            <input type="hidden" {...register(`vendors[${vid}].values[${itemId}].goods_model`)} value={item.goods_model} />
                                                            <input type="hidden" {...register(`vendors[${vid}].values[${itemId}].quantity`)} value={item.quantity} />

                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        }


                                        )}

                                        <tr>
                                            <td></td>
                                            <td>Submition Date</td>
                                            {projection.rfqInfo.vendors?.map((vendor, vid) =>
                                                <td key={vid}>

                                                    <input type="hidden" {...register(`vendors[${vid}].vendor_id`)} value={vendor.vendor_id} />
                                                    <input type="date" {...register(`vendors[${vid}].sub_date`, { required: true })} className="input input-bordered font-bold" />

                                                </td>
                                            )}
                                        </tr>


                                        <tr >
                                            <td colSpan={projection.items.length + 4}>
                                                <div className="flex justify-center w-full">
                                                    <button className="btn inline-block bg-[#04AA6D] text-white hover:text-[#04AA6D]">সেভ করুন</button>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </form>
                    </div>



                </div>
            }





        </div>
    );
};

export default Project;