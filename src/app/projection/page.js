"use client"
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Projection = () => {
    const [formdata, setFormData] = useState(null)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        setFormData(data);
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
                                <span className="label-text">যে শাখা থেকে রিকুইজিশন আসছে</span>
                            </label>
                            <input {...register('requisitioner', { required: true })} type="text" placeholder="শাখা/বিভাগের নাম ও নোটিং তারিখ  লিখুন" className="input input-bordered" />

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
                            <input {...register('total_price', { required: true })} type="text" placeholder="মোট মূল্য লিখুন" className="input input-bordered" />

                        </div>
                        <div className="form-control mt-6 col-span-full">
                            <button className="btn bg-gradient-to-r hover:bg-gradient-to-l text-white from-purple-600 to-violet-500">সেভ করুন</button>
                        </div>
                    </form>
                </div>
            </div>

            {formdata && <div className='container text-justify'>
                <p className="indent-10">{`  ${formdata.requisitioner} তারিখের  নোটিং এর প্রেক্ষিতে এ অফিসের ${formdata.proj_for} ব্যবহারের জন্য ${formdata.goods_name} ক্রয়ের লক্ষ্যে ইতিবাচক মতামত প্রদান এবং স্থানীয় বাজারদর যাচাইপূর্বক
    ${formdata.proj_from} ${formdata.total_price} টাকার একটি ব্যয়প্রাক্কলন প্রস্তুত করেছে (প্রাক্কলনের কপি সংযুক্ত) এবং এতদ্সংক্রান্ত পরবর্তী কার্যক্রম সম্পাদনের জন্য জড়সামগ্রী শাখাকে অনুরোধ জানিয়েছে।`
                }</p>
                <p className="indent-10">{`এমতাবস্থায়, ${formdata.proj_from} কর্তৃক প্রদত্ত মতামত ও প্রাক্কলনের প্রেক্ষিতে বর্ণিত ক্রয়কার্যক্রমটি সম্পাদনের জন্য নিম্নরূপ ব্যবস্থা গ্রহণ করা যেতে পারে। `}
                    <ol className="ml-10">
                        <li className="">ক. {formdata.proj_from} কর্তৃক প্রদত্ত ৳{formdata.total_price} টাকার ব্যয়প্রাক্কলনটি অনুমোদন করা যেতে পারে।</li>
                        <li className="">খ. প্রস্তাব “ক” অনুমোদিত হলে পিপিআর এর ৬৯ নং ধারায় বর্ণিত বিধানের আলোকে RFQ মেথডে এমমডিউল সিস্টেমের মাধ্যমে ক্রয় কার্যক্রমটি সম্পাদন করা যেতে পারে।</li>
                    </ol>

                </p>
                <p className="indent-10">সদয় অনুমোদনের জন্য উপস্থাপিত</p>
            </div>}
        </div>
    );
};

export default Projection;