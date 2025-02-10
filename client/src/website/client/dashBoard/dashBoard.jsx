import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Watch_Video_icon from '../../../assets/WatchVideo.png'
import Betting_games_icon from '../../../assets/BettingGames.png'
import ShortLink_icon from '../../../assets/ShortLink.png'
import ClickShortenLink_icon from '../../../assets/ClickShortenLink.png'
import ClickOnAds from '../../../assets/ClickOnAds.png'
import ViewAds from '../../../assets/ViewAds.png'
import Quiz from '../../../assets/Quiz.png'
import poolTrading from '../../../assets/poolTrading.png'
import Games from '../../../assets/Games.png'
import FillSurvey from '../../../assets/FillSurvey.png'
import Mining from '../../../assets/Mining.png'
import ClickToEarn from '../../../assets/ClickToEarn.png'
import Footer from '../components/footer/footer';
import { Link } from 'react-router-dom';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import axios from 'axios';

const DashBoard = ({ getLogOut_btnClicked, setLogOut_btnClicked, setAvailableBalance_forNavBar_state }) => {
    const [userData_state, setUserData_state] = useState([]);
    let [data_process_state, setData_process_state] = useState(false);
    let dropdownRef = useRef(null)
    let logOut_btnRef = useRef(null)
    const [dropdownButtonValue_state, setDropdownButtonValue_state] = useState('');
    const [monthlyData_state, setMonthlyData_state] = useState([]);
    const navigation = useNavigate();
    function dropdownButtonValue(e) {
        setDropdownButtonValue_state(e.target.innerText);
        dropdownRef.current.classList.add('hidden')
    }

    useEffect(() => {
        setMonthlyData_state(
            userData_state[2]?.filter((value) => {
                return dropdownButtonValue_state === value.monthName
            })
        )
    }, [userData_state]);

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userDataGet`, {
                    withCredentials: true
                });
                setUserData_state(response.data.userData);
                setDropdownButtonValue_state(response.data.userData[1][0].monthName)
                setAvailableBalance_forNavBar_state(Number(response.data.userData[0].deposit_amount) + Number(response.data.userData[0].withdrawable_amount));
            } catch (error) {
                if (error.response.data.jwtMiddleware_token_not_found_error) {
                    navigation('/login');
                } else if (error.response.data.jwtMiddleware_error) {
                    Swal.fire({
                        title: 'Session Expired',
                        text: 'Your session has expired. Please log in again.',
                        icon: 'error',
                        timer: 5000,
                        timerProgressBar: true,
                        confirmButtonText: 'OK',
                        didClose: () => {
                            navigation('/login');
                        }
                    });
                }
                console.error(error);
            } finally {
                setData_process_state(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (getLogOut_btnClicked) {
            logOut_btnRef.current.innerHTML = `<i class="fa-light fa-spinner fa-spin"></i>`
        } else {
            logOut_btnRef.current.innerHTML = `LogOut`
        }
        window.addEventListener('click', (e) => {
            e.stopPropagation()
            dropdownRef.current?.classList.add('hidden')
        })
        return () => {
            window.removeEventListener('click', (e) => {
                e.stopPropagation()
                dropdownRef.current.classList.add('hidden')
            })
        }
    }, [getLogOut_btnClicked]);

    return (
        <div onScroll={(e) => {
            e.stopPropagation()
            dropdownRef.current.classList.add('hidden')
        }} className="ml-auto bg-[#ecf0f5] flex flex-col justify-between  w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-1 select-none'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 flex justify-between'>
                    <h1>Dashboard</h1>
                    <button ref={logOut_btnRef} onClick={() => setLogOut_btnClicked(true)} className='text-lg border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-red-500'>LogOut</button>
                </div>
                <div className="grid grid-cols-2 grid-rows-5 sm:grid-cols-3 sm:grid-rows-3 grid-flow-col gap-2 font-poppins mb-5 text-lg sm:text-xl text-center">
                    {/* <Link to="/member/watch-video" className="bg-blue-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Watch Video</div>
                        <div className='z-[1]'>₹0.2155</div>
                        <img src={Watch_Video_icon} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link> */}
                    <Link to="/member/view-ads" className="bg-green-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>View Ads</div>
                        <div className='z-[1]'>₹{userData_state.viewAds || '0.0000'}</div>
                        <img src={ViewAds} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link>
                    {/* bg-purple-500 */}  <div className=" text-white bg-gray-500 relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Play Betting Game</div>
                        <div>Null</div>
                        <img src={Betting_games_icon} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2]' />
                    </div>
                    {/* bg-red-500 */} <div className="bg-gray-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Play Games</div>
                        <div>Null</div>
                        <img src={Games} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2]' />
                    </div>
                    {/* <Link to="/member/click-on-ads" className="bg-orange-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Click On Ads</div>
                        <div className='z-[1]'>₹0.2155</div>
                        <img src={ClickOnAds} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link> */}
                    <div className="bg-cyan-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Click Shorten Link</div>
                        <div className='z-[1]'>₹{userData_state.clickShortenLink || '0.0000'}</div>
                        <img src={ClickShortenLink_icon} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </div>
                    {/* bg-yellow-500 */} <div className="bg-gray-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Play Quiz</div>
                        <div>Null</div>
                        <img src={Quiz} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2]' />
                    </div>
                    {/* bg-indigo-500 */} <div className="bg-gray-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Pool Trading</div>
                        <div>Null</div>
                        <img src={poolTrading} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2]' />
                    </div>
                    <Link to="/member/short-link" className="bg-pink-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Short Link</div>
                        <div className='z-[1]'>₹{userData_state.shortLink || '0.0000'}</div>
                        <img src={ShortLink_icon} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link>
                    <div className="bg-green-700 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Mining</div>
                        <div className='z-[1]'>₹{userData_state.mining || '0.0000'}</div>
                        <img src={Mining} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </div>
                    {/* bg-blue-300 <div className="bg-gray-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Fill Survey</div>
                        <div>Null</div>
                        <img src={FillSurvey} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2]' />
                    </div> */}
                    {/* <Link to="/member/click-to-earn" className="bg-teal-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Click to Earn</div>
                        <div className='z-[1]'>₹0.2155</div>
                        <img src={ClickToEarn} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link> */}
                    <Link to="/member/refer-and-earn" className="bg-lime-500 text-white relative h-40 m-2 rounded-lg shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div px-1">
                        <div>Referral Income</div>
                        <div className='z-[1]'>₹{userData_state.referralIncome || '0.0000'}</div>
                        <img src={Watch_Video_icon} className='self-end mr-2 absolute bottom-3 right-1 opacity-[0.2] hover_on_image' />
                    </Link>
                </div>
                <div className='flex justify-around flex-wrap gap-4'>
                    <div id="frame" style={{ width: '300px', height: 'auto' }}>
                        <iframe
                            data-aa="2379444"
                            src="//ad.a-ads.com/2379444?size=300x250"
                            style={{
                                width: '300px',
                                height: '250px',
                                border: '0px',
                                padding: '0',
                                overflow: 'hidden',
                                backgroundColor: 'transparent',
                            }}
                        ></iframe>
                    </div>
                    <div id="frame" style={{ width: '200px', height: 'auto' }}>
                        <iframe
                            data-aa="2379500"
                            src="//ad.a-ads.com/2379500?size=200x200"
                            style={{
                                width: '200px',
                                height: '200px',
                                border: '0px',
                                padding: '0',
                                overflow: 'hidden',
                                backgroundColor: 'transparent'
                            }}
                            title="Advertisement"
                        ></iframe>
                    </div>
                    <div id="frame" style={{ width: '250px', height: 'auto' }}>
                        <iframe
                            data-aa="2379499"
                            src="//ad.a-ads.com/2379499?size=250x250"
                            style={{
                                width: '250px',
                                height: '250px',
                                border: '0px',
                                padding: '0',
                                overflow: 'hidden',
                                backgroundColor: 'transparent'
                            }}
                            title="Advertisement"
                        ></iframe>
                    </div>
                </div>
                <div className="w-full mt-4 bg-white border border-blue-500 rounded-lg shadow-md mb-4">
                    <div className="bg-red-800 text-white p-4 rounded-t-lg flex items-center space-x-2">
                        <i className="fa fa-bullhorn"></i>
                        <span>Announcements</span>
                        <span className="relative flex size-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-redky-500"></span>
                        </span>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <p className="announcement">
                                <span className="text-sm text-gray-500 float-right">
                                    <i className="fa fa-clock-o"></i> 8/10/24, 11:53 AM
                                </span>
                            </p>
                            <p className="font-semibold">Why Choose Us?</p>
                            <p>
                                1. Receive a $1 bonus for signing up.<br />
                                2. Enjoy the highest CPM rates globally.<br />
                                3. No intrusive pop-up ads.<br />
                                4. Ability to shorten links for 18+, Movies, Faucets, etc.<br />
                                5. Fast payments within 2 to 3 days.
                            </p>
                            <p className="text-red-500 font-semibold">
                                (Your first payment will be processed within 1 - 2 days)
                            </p>
                            <p className="font-semibold">Statistics will be refreshed every 10 minutes.</p>
                        </div>
                        <hr className="border-t-2 border-gray-300" />
                        <div className="space-y-2">
                            <p className="announcement">
                                <span className="text-sm text-gray-500 float-right">
                                    <i className="fa fa-clock-o"></i> 8/10/24, 11:52 AM
                                </span>
                            </p>
                            <p className="font-semibold">Contest</p>
                            <p className="text-red-500 font-semibold">Use Your Referral Link:</p>
                            <p>
                                The user with the most active referrals will earn a
                                <span className="text-green-500 font-semibold">25% commission</span>.
                                Find your referral link here -
                                <a href="https://droplink.co/member/users/referrals" target="_blank" className="text-blue-500 hover:underline">Click</a><br />
                                When your referral earns money, your commission will be credited to your DropLink wallet.
                            </p>
                            <p className="text-red-500 font-semibold">Spread the Word:</p>
                            <p>
                                Write an article about us (feel free to include your referral link!) and earn up to
                                <span className="text-green-500 font-semibold">$5</span>.<br />
                                Create a YouTube video discussing our platform and earn up to $100. Minimum withdrawal is
                                <span className="text-green-500 font-semibold">$5</span>.<br />
                                Send us the link to your article or video via -
                                <a href="mailto:support@droplink.co" className="text-blue-500 hover:underline">Email</a> |
                                <a href="https://t.me/droplinksp" target="_blank" className="text-blue-500 hover:underline">Telegram</a><br />
                                Funds will be credited to your account every Sunday.
                            </p>
                        </div>
                        <hr className="border-t-2 border-gray-300" />
                        <div className="space-y-2">
                            <p className="announcement">
                                <span className="text-sm text-gray-500 float-right">
                                    <i className="fa fa-clock-o"></i> 8/10/24, 11:50 AM
                                </span>
                            </p>
                            <p className="font-semibold">Policy</p>
                            <p>
                                Dear users, please refrain from creating bots, using proxies, or generating fake traffic. Violating this policy will result in
                                <span className="text-red-500 font-semibold">account deactivation</span>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center mt-3'>
                    <div className='relative'>
                        <button onClick={(e) => {
                            e.stopPropagation()
                            dropdownRef.current.classList.toggle('hidden')
                        }} className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg w-48 justify-between px-4 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            <span>{dropdownButtonValue_state}</span>
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <div ref={dropdownRef} id="dropdown" className="bg-white hidden rounded-md absolute left-0 right-0 max-h-52 overflow-auto">
                            <ul onClick={dropdownButtonValue} className="py-2 text-sm dark:text-gray-200">
                                {
                                    userData_state[1]?.map((monthlyData, index) => (
                                        <li key={index} className="block px-4 py-2 text-black hover:bg-slate-100 cursor-pointer">
                                            {monthlyData.monthName}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="overflow-auto mt-3 max-h-[300px]">
                    <table className="table-auto border-collapse min-w-[633px] sm:min-w-full">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="text-start px-4 py-2 border border-gray-300">Date</th>
                                <th className="text-start px-4 py-2 border border-gray-300">Self Earnings</th>
                                <th className="text-start px-4 py-2 border border-gray-300">Referral Earnings</th>
                                <th className="text-start px-4 py-2 border border-gray-300">Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                monthlyData_state?.map((table_values, index) => (
                                    <tr key={index} className="odd:bg-gray-200">
                                        <td className="px-4 py-2 border border-gray-300">{table_values.date}</td>
                                        <td className="px-4 py-2 border border-gray-300">₹{table_values.self_earnings || '0.000'}</td>
                                        <td className="px-4 py-2 border border-gray-300">₹{table_values.referral_earnings || '0.000'}</td>
                                        <td className="px-4 py-2 border border-gray-300">₹{table_values.Total_earnings || '0.000'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
            {data_process_state && <ProcessBgBlack />}
        </div>
    );
}

export default DashBoard;
