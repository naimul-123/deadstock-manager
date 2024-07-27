"use client"
import React from 'react';
import { useState } from 'react';
import { getData } from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';

const AddReceiver = ({ handleReceiver, getSap, employee, isShowEmp, handleIsShow }) => {
    const [goodsFor, setGoodsFor] = useState('person')
    return (
        <>
            <div className="flex justify-center items-center " >
                <form className="grid grid-cols-7 gap-4 m-4 items-center justify-center" onSubmit={(e) => handleReceiver(e)}>
                    <div className="form-control flex-row col-span-full justify-end">
                        <label className="label gap-1 cursor-pointer">
                            <span className="label-text">For Person</span>
                            <input type="radio" name="goodsFor" value="person" className="radio checked:bg-green-500" defaultChecked onFocus={() => setGoodsFor('person')} />
                        </label>
                        <label className="label gap-1 cursor-pointer">
                            <span className="label-text">For space</span>
                            <input type="radio" name="goodsFor" value="space" className="radio checked:bg-green-500" onFocus={() => setGoodsFor('space')} />
                        </label>

                    </div>
                    {goodsFor === "person" ? <>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">এস.এ.পি আইডি:</span>
                            </label>
                            <input name='sap' type="text" placeholder="এস.এ.পি আইডি লিখুন" className="input input-bordered" onBlur={(e) => getSap(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">নাম:</span>
                            </label>
                            <input name="name" type="text" disabled value={employee?.name_bn || ''} className="input input-bordered" />

                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">পদবী</span>
                            </label>

                            <input name="designation" type="text" disabled value={employee?.designation_bn || ''} className="input input-bordered" />
                        </div>
                    </>
                        :
                        <div className="form-control col-span-3">
                            <label className="label">
                                <span className="label-text">স্থানের নাম:</span>
                            </label>
                            <input name='name' type="text" placeholder="স্থানের নাম লিখুন" className="input input-bordered" />
                        </div>
                    }
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">শাখার নাম</span>
                        </label>
                        <select name='section' className="select select-bordered w-full" required>
                            <option value="">--Select--</option>
                            <option value="নির্বাহী পরিচালকের শাখা">নির্বাহী পরিচালকের শাখা</option>
                            <option value="সংস্থাপন শাখা">সংস্থাপন শাখা</option>
                            <option value="আগাম প্রদান শাখা">আগাম প্রদান শাখা</option>
                            <option value="জড়সামগ্রী শাখা">জড়সামগ্রী শাখা</option>
                            <option value="প্রকৌশল শাখা">প্রকৌশল শাখা</option>
                            <option value="ভেরিফিকেশন ইউনিট">ভেরিফিকেশন ইউনিট</option>
                            <option value="সঞ্চয়পত্র শাখা">সঞ্চয়পত্র শাখা</option>
                            <option value="পিএডি শাখা">পিএডি শাখা</option>
                            <option value="ডিএবি শাখা">ডিএবি শাখা</option>
                            <option value="কৃষিঋণ শাখা">কৃষিঋণ শাখা</option>
                            <option value="ক্যাশ বিভাগ">ক্যাশ বিভাগ</option>
                            <option value="ডিবিআই শাখা">ডিবিআই শাখা</option>

                            <option value="আইসিটি সেল">আইসিটি সেল</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">নোটিং এর তারিখ</span>
                        </label>
                        <input name='notingDate' type="date" placeholder="নোটিং তারিখ  লিখুন" className="input input-bordered" required />
                    </div>
                    <div className="form-control mt-8">
                        <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">যোগ করুন</button>
                    </div>
                    <div className="form-control mt-8">
                        <p className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500" onClick={handleIsShow} >{isShowEmp ? 'Hide' : 'Show'}</p>
                    </div>
                </form>
            </div >
        </>
    );
};

export default AddReceiver;