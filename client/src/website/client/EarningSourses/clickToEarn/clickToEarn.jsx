import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer/footer';
import BottomAlert from '../../components/bottomAlert/bottomAlert';

const ClickToEarn = () => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [bottomAlert_state, setBottomAlert_state] = useState(false);
    const [clickSuccess_state, setClickSuccess_state] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const clickSuccessStatus = localStorage.getItem('isSuccess');
            if (clickSuccessStatus === 'true') {
                setClickSuccess_state(true);
                localStorage.removeItem('isSuccess')
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (clickSuccess_state) {
            setBottomAlert_state('Success!');
            setTimeout(() => {
                setBottomAlert_state(false);
                alert('success')
            }, 3000);
        }
    }, [clickSuccess_state]);


    let Instructions = [
        'Each user gets 5 Ads clicks to earn money per IP address.',
        'Clicking All Ads allows users to earn money.',
        'Once the 5 link clicks limit is reached, users cannot click more links with the same IP.',
        'To reset the balance and earn again, users must change their IP address.',
        'After changing the IP, users get 5 new Ads to click.',
        'This process can be repeated multiple times for more earnings.',
        'Users can change their IP address 50 times per day.',
        'Users can maximize their income by clicking Ads and changing IPs carefully.',
        'The cycle resets every day to allow users to earn again.',
        'As more users join the platform, the limits on ad clicks and IP changes will gradually increase, allowing users to earn even more as the platform grows.'
    ];    
    

    const handle_link_click = (link) => {
        setHandle_clickAds_btnClick_state(true);
        const newTab = window.open('/waitRedirecting', '_blank');
        if (newTab) {
            newTab.onload = () => {
                newTab.location.search = `?link=${encodeURIComponent(link)}`;
            };
        } else {
            alert("Please Allow Popup in Your Browse!");
        }
    };

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Click to Earn
                </div>
                <div className='flex flex-col items-center my-6'>
                    <div className='flex gap-4'>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Click Balance - 0/5</div>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Income - ₹2.548</div>
                    </div>
                    <div className='gap-2 justify-center bg-white px-6 py-3 shadow flex flex-wrap'>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => handle_link_click('https://poawooptugroo.com/4/8238196')}><span>Click On Ads 1</span><span>₹0.02</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => handle_link_click('https://poawooptugroo.com/4/8238196')}><span>Click On Ads 2</span><span>₹0.02</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => handle_link_click('https://poawooptugroo.com/4/8868626')}><span>Click On Ads 3</span><span>₹0.02</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => handle_link_click('https://poawooptugroo.com/4/8585876')}><span>Click On Ads 4</span><span>₹0.02</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`}><span>Click On Ads 5</span><span>₹0.02</span></button>
                        {bottomAlert_state && <BottomAlert text={bottomAlert_state} />}
                    </div>
                </div>
                <div className='bg-white rounded shadow px-5 py-2 mt-5'>
                    <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>Click Ads Instructions</p>
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
        </div>
    );
}

export default ClickToEarn;
