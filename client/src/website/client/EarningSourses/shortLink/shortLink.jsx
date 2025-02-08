import React, { useState } from 'react';
import Footer from '../../components/footer/footer';

const ShortLink = ({ setShowBottomAlert_state }) => {
    const [shortBtnDisabled, setShortBtnDisabled] = useState(false);
    const [submitProcessState, setSubmitProcessState] = useState(true);
    const [shortenedUrlVisible, setShortenedUrlVisible] = useState(false);
    const [shortenedUrl, setShortenedUrl] = useState('');
    let baseURL = import.meta.env.VITE_ADS_PAGE_BASE_URL
    const [currentPage_state, setCurrentPage_state] = useState(1);


    const handleCopy = () => {
        const textToCopy = document.getElementById('shortenedUrl');
        navigator.clipboard.writeText(textToCopy.textContent).then(() => {
            setShowBottomAlert_state(true);
            setTimeout(() => setShowBottomAlert_state(false), 2000);
        });
    };

    const handleLinkShortBtn = (e) => {
        e.preventDefault();
        setSubmitProcessState(false);
        setShortenedUrl('short.ly/abcd1234');
        setShortenedUrlVisible(true);
        setSubmitProcessState(true);
        setShortBtnDisabled(true);
    };

    let linkdata = [
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },
        {
            link_shortedId: "503b728e",
            stats_parameters: "#",
            date_and_time: "30/11/24 05:06 pm",
            destination_link: "https://gfgedggertetgd.blogspot.com/p/digital-markiting.html",
        },

    ]

    const linksPerPage = 3;

    const indexOfLastReferral = currentPage_state * linksPerPage;
    const indexOfFirstReferral = indexOfLastReferral - linksPerPage;
    const currentReferrals = linkdata.slice(indexOfFirstReferral, indexOfLastReferral);
    const totalPages = Math.ceil(linkdata.length / linksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage_state(pageNumber);
    };

    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Short Link
                </div>
                <form className="bg-white border border-green-500 p-6 mt-6" onSubmit={handleLinkShortBtn}>
                    <div className="mb-6">
                        <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700">Enter URL to Shorten:</label>
                        <input
                            type="url"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="urlInput"
                            placeholder="Enter your URL"
                            required
                        />
                    </div>
                    <div className="mb-6 max-w-[300px]">
                        <label htmlFor="aliasInput" className="block text-sm font-medium text-gray-700">Enter Alias (optional):</label>
                        <input
                            type="text"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="aliasInput"
                            placeholder="Enter an alias"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={shortBtnDisabled}
                        className={`px-6 py-2 rounded-lg text-white ${!submitProcessState ? "bg-gray-500" : "bg-red-500 hover:bg-red-700"} focus:outline-none focus:ring-2 focus:ring-red-500`}
                    >
                        {submitProcessState ? "Shorten" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                    <div className={`shortened-url-container ${shortenedUrlVisible ? 'block' : 'hidden'}`}>
                        {shortenedUrlVisible && (
                            <div className="my-6">
                                <label htmlFor="shortenedUrl" className="block text-sm font-medium text-gray-700">Shortened URL:</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="mt-1 p-2 w-full bg-gray-200 border border-gray-300 rounded-l-lg"
                                        id="shortenedUrl"
                                        value={baseURL + shortenedUrl}
                                        readOnly
                                    />
                                    <button
                                        className="bg-white outline-1 text-gray-500 outline-gray-500 outline-double py-[8px] mt-1 px-3 rounded-r-lg hover:bg-gray-500 hover:text-white"
                                        type="button"
                                        onClick={() => {
                                            handleCopy()
                                        }}>
                                        <i className="fa fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                <div className="p-3 space-y-4">
                    {
                        currentReferrals.map((value, index) => (
                            <div key={index}>
                                <a href='#' target='_blank' className='text-blue-500 underline hover:text-blue-600 text-xl font-bold'>{value.link_shortedId}</a>
                                <div className='mt-1 text-gray-700'>
                                    <span><i class="fa fa-bar-chart"></i> <a href={value.stats_parameters} target='_blank' className='text-blue-500 underline hover:text-blue-600'>Stats</a> - </span>
                                    <span><i class="fa fa-calendar"></i> {value.date_and_time} - </span>
                                    <a href="#" target='_blank' className='text-blue-500 underline hover:text-blue-600' >{value.destination_link}</a>
                                </div>
                                <div className='flex mt-2'>
                                    <input type='text' value={baseURL + value.link_shortedId} readOnly className='bg-white p-2 w-[90%] rounded-l-lg outline-none cursor-pointer' />
                                    <button className='bg-white outline outline-1 px-3 rounded-r-lg text-blue-500 hover:text-white hover:bg-blue-500 outline-blue-500'><i class="fa fa-clone"></i></button>
                                    <button className='bg-blue-500 text-white px-4 h-9 self-center ml-4 rounded-md'>Edit</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
             {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage_state - 1)}
                        className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md disabled:opacity-50"
                        disabled={currentPage_state === 1}>
                        Previous
                    </button>
                    {
                        Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 mx-1 text-white bg-blue-500 rounded-md ${currentPage_state === index + 1 ? 'bg-blue-700' : ''}`}>
                                {index + 1}
                            </button>
                        ))
                    }
                    <button
                        onClick={() => handlePageChange(currentPage_state + 1)}
                        className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md disabled:opacity-50"
                        disabled={currentPage_state === totalPages}>
                        Next
                    </button>
                </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default ShortLink;
