import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer/footer';
import OnClickaVideoAds from '../../components/onClickaVideoAds/onClickaVideoAds';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import BottomAlert from '../../components/bottomAlert/bottomAlert';

const ViewAds = () => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [bottomAlert_state, setBottomAlert_state] = useState(false);
    const [showAdsDiv_state, setShowAdsDiv_state] = useState(false);
    const [processing_state, setProcessing_state] = useState(false);
    const [timerCount_state, setTimerCount_state] = useState(10);
    const [removeTimer_state, setRemoveTimer_state] = useState(false);

    function handelDottomAlert(result) {
        setBottomAlert_state(result);
        setTimeout(() => {
            setBottomAlert_state(false);
        }, 3000);
    }


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
        'As more users join the platform, the limits on ad clicks and IP changes will gradually increase, allowing users to earn even more as the platform grows.',
        'Please do not attempt to cheat or hack the website, as this could lead to your account being permanently banned. We are working hard to increase your income opportunities, so please follow the rules and earn money fairly. Any attempts to exploit scripts or find income tricks will result in both you and us being unable to earn. Follow the guidelines to maximize your earnings.'
    ];

    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('gfpl-wrapper')) {
                        handelAdsDiv()
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
    }, []);

    function handelAdsDiv() {
        setProcessing_state(false);
        let gfpl_wrapper = document.getElementsByClassName('gfpl-wrapper');
        if (gfpl_wrapper[0].children[0]) {
            setTimeout(() => {
                setRemoveTimer_state(true)
            }, 1000);
        }
        let interval = setInterval(() => {
            setTimerCount_state((prevCount) => {
                const newCount = prevCount - 1;
                if (newCount === -1) {
                    gfpl_wrapper[0]?.remove()
                    setShowAdsDiv_state(false)
                    setTimerCount_state(10)
                    handelDottomAlert('Success!')
                    clearInterval(interval)
                }
                return newCount;
            });
        }, 1000);
    }

    function loadAd(key) {
        const adDiv = document.getElementById('adSterra')
        if (adDiv) {
            adDiv.innerHTML = '';

            const script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.innerHTML = `
            atOptions = {
              'key': '${key}',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          `;

            adDiv.appendChild(script1);

            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.src = `//www.highperformanceformat.com/${key}/invoke.js`;

            adDiv.appendChild(script2);
            let count = 0;
            let checkInterval = setInterval(() => {
                count += 0
                if (count === 5 || adDiv.children[1].tagName === 'IFRAME') {
                    clearInterval(checkInterval)
                }
                if (adDiv.children[1].tagName === 'IFRAME') {
                    setTimeout(() => {
                        setRemoveTimer_state(true)
                        setProcessing_state((p) => p = false)
                    }, 1000);
                    let interval = setInterval(() => {
                        setTimerCount_state((prevCount) => {
                            const newCount = prevCount - 1;
                            if (newCount === -1) {
                                adDiv.innerHTML = ''
                                setShowAdsDiv_state(false)
                                clearInterval(interval)
                                handelDottomAlert('Success!')
                                setTimerCount_state(10)
                            }
                            return newCount;
                        });
                    }, 1000);
                }
            }, 1000);

        } else {
            console.error('Ad container (adstrra) not found.');
        }
    }


    function handelClick() {
        setShowAdsDiv_state(true)
        setProcessing_state((p) => p = true)
    }

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
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                            OnClickaVideoAds('https://js.onclckmn.com/static/onclicka.js', '234995')
                            setHandle_clickAds_btnClick_state(true)
                            handelClick()
                        }}><span>Click On Ads 1</span><span>₹0.01</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                            OnClickaVideoAds('https://js.wpadmngr.com/static/adManager.js', '288449')
                            setHandle_clickAds_btnClick_state(true)
                            handelClick()
                        }}><span>Click On Ads 2</span><span>₹0.01</span></button>
                        <button disabled={handle_clickAds_btnClick_state ? true : false} className={`${handle_clickAds_btnClick_state ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                            const adSterrakeys = ['9053e4594f6f11cc52b1a92378164206', 'f897c99fe416f65a488b750d0f978646'];
                            let randomNumber = Math.floor(Math.random() * adSterrakeys.length)
                            console.log(randomNumber);
                            loadAd('9053e4594f6f11cc52b1a92378164206')
                            setHandle_clickAds_btnClick_state(true)
                            handelClick()
                        }}><span>Click On Ads 3</span><span>₹0.01</span></button>
                        {bottomAlert_state && <BottomAlert text={bottomAlert_state} />}
                    </div>
                </div>
                <div className={`z-[1] absolute top-0 left-0 right-0 bottom-0 bg-[#0101015d] flex justify-center items-center flex-col ${showAdsDiv_state ? '' : 'hidden'}`}>
                    {removeTimer_state && <div className='bg-gray-500 text-white px-2 h-10 text-center rounded-md -mb-[14px]'>Please Wait - {timerCount_state}sec</div>}
                    <div data-banner-id="6033510" ></div>
                    <div data-banner-id="1435822"></div>
                    <div id="adSterra"></div>
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
            {processing_state && <ProcessBgBlack />}
        </div>
    );
}

export default ViewAds;
