import React from 'react';
import { createPortal } from 'react-dom';

const ProcessBgBlack = () => {
    return createPortal(
        <div className='flex justify-center items-center fixed z-20 top-0 bottom-0 left-0 right-0 bg-[#00000061] text-white text-4xl'>
            <i className="fa-duotone fa-solid fa-spinner-third fa-spin"></i>
        </div>,
        document.getElementById('processBgBlack') || document.body // Fallback if element not found
    );
};

export default ProcessBgBlack;
