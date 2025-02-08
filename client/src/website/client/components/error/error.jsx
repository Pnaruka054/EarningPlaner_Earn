import React from 'react';
import ReactDOM from 'react-dom';

const Error = ({ color, text }) => {
    return ReactDOM.createPortal(
        <div className={`absolute bottom-4 right-4 rounded-md shadow-lg bg-${color}-500 px-2 py-1 font-bold drop-shadow-md text-white flex items-center gap-1`}>
            <span className='text-xl flex items-center'><ion-icon name="alert-circle"></ion-icon></span> {text}
        </div>,
        document.getElementById('errorMessage')
    );
};

export default Error;
