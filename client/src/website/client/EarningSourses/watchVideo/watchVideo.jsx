import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import OnClickaVideoAds from '../../components/onClickaVideoAds/onClickaVideoAds'
import BottomAlert from '../../components/bottomAlert/bottomAlert';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';

const WatchVideo = () => {
    const [onClickaAds_state, setOnClickaAds_state] = useState(false);
    const [bottomAlert_state, setBottomAlert_state] = useState(false);
    const [onClicka_clickadilla_state, setOnClicka_clickadilla_state] = useState('');
    const [handle_videoAds_btnClick_state, sethandle_videoAds_btnClick_state_state] = useState(false);
    const [processing_state, setProcessing_state] = useState(false);

    let Instructions = [
        'Each user gets 2 video ads to watch per IP address.',
        'Watching both ads allows users to earn money.',
        'Once the 2 ads limit is reached, users cannot watch more ads with the same IP.',
        'To reset the balance and earn again, users must change their IP address.',
        'After changing the IP, users get 2 new ads to watch.',
        'This process can be repeated multiple times for more earnings.',
        'Users can change their IP address only 10 times per day.',
        'After 10 IP changes, they must wait 24 hours before earning again.',
        'Users can maximize their income by watching ads and changing IPs carefully.',
        'After 10 IP changes, the cycle resets the next day.',
    ]

    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('video_slider')) {
                        if (onClicka_clickadilla_state === 'onClicka') {
                            handle_onClickaAds('iframe[src="https://js.onclmng.com/log/count.html"]', 'script[src="https://js.onclckmn.com/static/onclicka.js"]')
                        } else if (onClicka_clickadilla_state === 'clickAdilla') {
                            handle_onClickaAds('iframe[src="https://storage.multstorage.com/log/count.html"]', 'script[src="https://js.wpadmngr.com/static/adManager.js"]')
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [onClicka_clickadilla_state]);

    function handle_onClickaAds(iframe, script) {
        let onClicka_video_ads_div = document.getElementById('onClicka_video_ads_div')
        setOnClickaAds_state((p) => p = true)
        let video_slider = document.getElementsByClassName('video_slider')[0]
        let video_stop_traker = setInterval(() => {
            console.log("Interval");
            let ads_header__close_ad = document.getElementsByClassName('ads_header__close-ad')[0].children[0].innerText
            if (ads_header__close_ad === 'Close ad') {
                console.log("success");
                clearInterval(video_stop_traker)
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                video_slider.style.display = 'none'
                setOnClickaAds_state((p) => p = false)
                setBottomAlert_state((p) => p = 'Success!')
                setTimeout(() => setBottomAlert_state((p) => p = false), 2000)
                sethandle_videoAds_btnClick_state_state((p) => p = false)
            } else if (!ads_header__close_ad) {
                clearInterval(video_stop_traker)
                console.log("success2");
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                video_slider.style.display = 'none'
                setOnClickaAds_state((p) => p = false)
                setBottomAlert_state((p) => p = 'Success!')
                setTimeout(() => setBottomAlert_state((p) => p = false), 2000)
                sethandle_videoAds_btnClick_state_state((p) => p = false)
            } else if (onClicka_video_ads_div.children[0].style.display === 'none') {
                clearInterval(video_stop_traker)
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                setOnClickaAds_state((p) => p = false)
                setBottomAlert_state((p) => p = 'ooh Please Try again!')
                setTimeout(() => setBottomAlert_state((p) => p = false), 2000)
                sethandle_videoAds_btnClick_state_state((p) => p = false)
            }
        }, 1000)
        video_slider.removeAttribute('class')
        video_slider.removeAttribute('style')
        video_slider.style.flexDirection = 'column'
        onClicka_video_ads_div.appendChild(video_slider)
        setProcessing_state((p) => p = false)
    }

    return (
        <div className='ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12'>
            <div className='p-2'>
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex md:justify-start justify-center">
                    Watch Videos & Earn Money
                </div>
                <div className='flex flex-col items-center my-6'>
                    <div className='flex gap-4'>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Video Balance - 0/5</div>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Income - ₹2.548</div>
                    </div>
                    <div className='gap-2 justify-center bg-white px-6 py-3 shadow flex flex-wrap'>
                        <button disabled={handle_videoAds_btnClick_state ? true : false} className={`${handle_videoAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                            sethandle_videoAds_btnClick_state_state(true)
                            setProcessing_state((p) => p = true)
                            setOnClicka_clickadilla_state('onClicka')
                            OnClickaVideoAds('https://js.onclckmn.com/static/onclicka.js', '287247')
                        }}><span>Watch Video 1</span><span>₹0.001</span></button>
                        <button disabled={handle_videoAds_btnClick_state ? true : false} className={`${handle_videoAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={() => {
                            sethandle_videoAds_btnClick_state_state(true)
                            setProcessing_state((p) => p = true)
                            setOnClicka_clickadilla_state('clickAdilla')
                            OnClickaVideoAds('https://js.wpadmngr.com/static/adManager.js', '286401')
                        }}><span>Watch Video 2</span><span>₹0.001</span></button>
                        {/* <button disabled={handle_videoAds_btnClick_state ? true : false} className={`${handle_videoAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`}><span>Watch Video 3</span><span>₹0.002</span></button>
                        <button disabled={handle_videoAds_btnClick_state ? true : false} className={`${handle_videoAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`}><span>Watch Video 4</span><span>₹0.002</span></button>
                        <button disabled={handle_videoAds_btnClick_state ? true : false} className={`${handle_videoAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`}><span>Watch Video 5</span><span>₹0.002</span></button> */}
                        {bottomAlert_state && <BottomAlert text={bottomAlert_state} />}
                    </div>
                </div>
                <div className={`z-[1] absolute top-0 left-0 right-0 bottom-0 bg-[#0101015d] flex justify-center items-center ${!onClickaAds_state ? 'hidden' : ''}`}>
                    <div id="onClicka_video_ads_div" >
                    </div>
                </div>
                <div className='bg-white rounded shadow px-5 py-2 mt-5'>
                    <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>Video Ads Instructions</p>
                    <hr className='mt-2 border' />
                    <ul className='mt-4 font-medium text-gray-500 drop-shadow-sm'>
                        {
                            Instructions.map((value, index) => <li key={index}><i className="fa-solid fa-hand-point-right fa-fade text-red-600"></i> {value}</li>)
                        }
                    </ul>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
            {processing_state && <ProcessBgBlack />}
        </div>
    );
}

export default WatchVideo;
