"use client"
import React from 'react';
import { useState } from 'react';

const AddItems = ({ handleItems, employee, removeEmp, handleremoveItem, empInfo, error }) => {
    const [isShow, setIsShwo] = useState(false)
    const { name, designation, sap, itemInfo } = employee
    const handleIsShow = () => {
        setIsShwo(!isShow)
    }


    return (
        < >
            <div className="flex p-2  gap-2 justify-between items-center shadow-lg bg-slate-400  ">
                <h2 className="text-2xl font-bold"> {`নাম: জনাব ${name}, পদবী:${designation}`}</h2>
                <div className="flex gap-2 justify-between items-center">
                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={() => handleIsShow()}>{isShow ? 'Hide' : "Show"}</button>
                    <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={() => removeEmp(sap)}>Remove Employee</button>
                </div>
            </div>

            <div className={!isShow ? "hidden" : undefined}>
                <form className="grid grid-cols-4 gap-4 m-4 items-center justify-center" onSubmit={(e) => handleItems(e, sap)}>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">যা কেনা হবে</span>
                        </label>
                        <input name='goods_name' type="text" placeholder="যা কেনা হবে লিখুন" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">পরিমান</span>
                        </label>
                        <input name='quantity' type="text" placeholder="কতগুলো কেনা হবে লিখুন" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">একক মূল্য</span>
                        </label>
                        <input name='unit_price' type="text" placeholder="মোট মূল্য লিখুন" className="input input-bordered" />

                    </div>
                    <div className="form-control mt-8">
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">সেভ করুন</button>

                    </div>
                </form>
                {error?.error === sap && <p className='text-red-600 font-bold'>{error.message}</p>}

                {itemInfo.length > 0 &&
                    <table className="table table-zebra">
                        <thead>


                            <tr >
                                <td>SL</td>
                                <td>Name</td>
                                <td>quantity</td>
                                <td className="text-right">Unit Price</td>
                                <td className="text-right">Total Price</td>
                                <td className="text-right">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {itemInfo.map((item, idx) => {
                                const sl = idx + 1 < 10 ? `0${idx + 1}` : idx + 1

                                return (
                                    <tr key={idx} className="">
                                        <td>{sl}</td>
                                        <td>{item.goods_name}</td>
                                        <td>{item.quantity}</td>
                                        <td className="text-right">{item.unit_price}</td>
                                        <td className="text-right">{item.quantity * item.unit_price}</td>
                                        <td className="text-right" onClick={() => handleremoveItem(sap, item.goods_name)}>Remove</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                }
            </div>

        </>
    );
};

export default AddItems;