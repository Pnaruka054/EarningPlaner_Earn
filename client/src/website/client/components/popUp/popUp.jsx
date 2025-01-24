import React from 'react';

const PopUp = ({ heading, btn1_text, btn2_text, setLogOut_btnClicked }) => {
    return (
        <div className='fixed select-none top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#00000067]'>
            <div className='bg-white inline-block p-6 rounded-md shadow-xl'>
                <div className='text-xl font-medium'>
                    <p>{heading}</p>
                </div>
                <div className='flex justify-around mt-4'>
                    <button className='px-4 py-1 font-medium text-lg text-white rounded-md bg-red-500'> {btn1_text} </button>
                    <button onClick={() => setLogOut_btnClicked(false)} className='px-4 py-1 font-medium text-lg text-white rounded-md bg-gray-500'> {btn2_text} </button>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
