import React, { useState } from 'react';

const Deposit = () => {
    const [deposit_amount_state, setDeposit_amount_state] = useState(0);

    function deposit_amount_btn(e) {
        setDeposit_amount_state(e.currentTarget.children[1].innerText);
    }
    return (
        <div className="ml-auto bg-[#ecf0f5] w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl'>
                    Deposit Amount
                </div>
                <div className='flex justify-center'>
                    <ul className='flex space-x-5'>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>100</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>500</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>1000</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>2000</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>3000</span>
                        </li>
                    </ul>
                </div>
                <div className='px-5'>
                    <input type="number" value={deposit_amount_state} onFocus={(e) => setDeposit_amount_state((prev) => prev = '')} onBlur={(e) => setDeposit_amount_state((prev) => prev === '' ? prev = 0 : prev = prev)} onChange={(e) => setDeposit_amount_state((prev) => prev = e.target.value)} pattern='^[0-9]' required className='block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat' />
                    <div className='space-x-5 flex justify-center'>
                        <button className='w-full py-2 bg-green-600 text-white'>Deposit</button>
                        <button onClick={() => setDeposit_amount_state(0)} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Deposit;
