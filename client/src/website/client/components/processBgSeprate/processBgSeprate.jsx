import React from "react";

const ProcessBgSeprate = () => {
  return (
    <div className="w-full h-full inset-0 flex items-center justify-center bg-white bg-opacity-80">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold mt-4 text-gray-800">Loading...</h2>
        <p className="text-gray-600 text-sm mt-2">Please wait while we process.</p>
      </div>
    </div>
  );
};

export default ProcessBgSeprate;