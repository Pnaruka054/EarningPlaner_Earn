import React from 'react';
import { createPortal } from 'react-dom';
import { FaSpinner } from 'react-icons/fa';

const ProcessBgBlack = () => {
    return createPortal(
        <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50'>
            <div className='flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg'>
                <FaSpinner className='text-blue-600 text-5xl animate-spin' />
                <p className='text-gray-800 text-lg font-semibold mt-4'>Processing...</p>
            </div>
        </div>,
        document.getElementById('processBgBlack') || document.body // Fallback agar element na mile
    );
};

export default ProcessBgBlack;