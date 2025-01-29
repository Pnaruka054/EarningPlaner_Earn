import React from 'react';

const BottomAlert = ({text}) => {
    return (
        <div
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-4 rounded-md text-sm"
        >
            {text}
        </div>
    );
}

export default BottomAlert;
