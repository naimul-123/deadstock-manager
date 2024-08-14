"use client"
import { decimalToBangla } from '@/utils/benword';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const VendorValue = ({ vendor, items, setValueInfo, valueInfo }) => {
    const { register, handleSubmit } = useForm();
    const [totalPrice, setTotalPrice] = useState(0)

    const handleFormData = (data) => {
        const vendorId = vendor.vendor_id;
        const result = Object.entries(data).map(([goods_model, price]) => ({ goods_model, price }))
        const value = { items: result, vendorId }
        const remaining = valueInfo.filter(v => v.vendorId !== vendor.vendor_id);

        setValueInfo([...remaining, value])

    };

    const [isOpen, setIsOpen] = useState(false)
    return (
        <div key={vendor.vendor_id}>
            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-[#D9EEE1] my-2 ">
                <h2 className="text-2xl font-bold">{vendor.vendor_name_bn},{vendor.vendor_add_bn} </h2>
                <h2 className="text-2xl font-bold">উদ্বৃত মোট মূল্য:{totalPrice > 0 ? decimalToBangla(totalPrice.toString()) + "/-" : ""} </h2>
                <div className="flex gap-2 justify-between items-center">
                    <button className="btn bg-[#04AA6D] text-white hover:text-[#04AA6D]" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Hide' : "Show"}</button>
                </div>
            </div>
            <div className={`card shadow-lg bg-[#E7E9EB] ${!isOpen ? "hidden" : null}`}>
                <form onSubmit={handleSubmit(handleFormData)}>
                    <table className="table table-zebra   text-2xl font-[sutonnyOMJ]">
                        <thead className="text-2xl font-bold text-black font-[sutonnyOMJ]">
                            <tr >
                                <td>ক্রঃ</td>
                                <td>পণ্যের নামঃ</td>
                                <td>মডেল</td>
                                <td>পরিমান</td>
                                <td>দর</td>
                            </tr>
                        </thead>

                        <tbody>

                            {items?.length > 0 && items.map((i, id) => <tr key={id}>
                                <td>{id + 1}</td>
                                <td>{i.goods_name_en}</td>
                                <td>{i.goods_model}</td>
                                <td>{i.quantity}</td>
                                <td>
                                    <input {...register(i.goods_model, { required: true })} type="text" placeholder="উদ্বৃত দর" className="input input-bordered" onBlur={(e) => setTotalPrice(p => p + (parseInt(e.target.value) * i.quantity))} />
                                </td>

                            </tr>)}


                        </tbody>


                    </table>
                    <div className="form-control flex-row p-6 text-center justify-end">
                        <button className="btn">Save</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default VendorValue;