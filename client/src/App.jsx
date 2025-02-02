import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './website/client/auth/login/login';
import NavBar from './website/client/components/navBar/navBar';
import SignUp from './website/client/auth/signUp/signUp';
import DashBoard from './website/client/dashBoard/dashBoard';
import { useEffect, useRef, useState } from 'react';
import Deposit from './website/client/deposit/deposit';
import SideMenu from './website/client/components/sideMenu/sideMenu';
import { createPortal } from 'react-dom'
import PopUp from './website/client/components/popUp/popUp';
import Withdraw from './website/client/withdraw/withdraw';
import BottomAlert from './website/client/components/bottomAlert/bottomAlert';
import Support from './website/client/support/support';
import ReferEarn from './website/client/ReferEarn/ReferEarn';
import Profile from './website/client/profile/profile';
import Setting from './website/client/setting/setting';
import ViewAds from './website/client/EarningSourses/viewAds/viewAds';
import WaitRedirecting from './website/client/EarningSourses/viewAds/waitRedirecting';

const App = () => {
  const [show_navBar_state, setshow_NavBar_state] = useState(false);
  const [showPopUp_onLogOut_btn_state, setShowPopUp_onLogOut_btn_state] = useState(false);
  const [sideMenu_state, setSideMenu_state] = useState('menu-outline');
  const [showBottomAlert_state, setShowBottomAlert_state] = useState(false);
  const [showSideMenu_navBar_state, setShowSideMenu_navBar_state] = useState(true);
  const [isOffline_state, setIsOffline_state] = useState(navigator.onLine ? false : true);
  const location = useLocation();
  const networkStatusRef = useRef(null);
  const updateNetworkStatus = (message, classes, status) => {
    if (networkStatusRef.current) {
      networkStatusRef.current.innerHTML = `
        <div class="rounded-[5%] h-96 w-full font-bold text-white pt-1 drop-shadow select-none text-sm ${classes}">
          ${message}
        </div>
      `;
      if (status === 'offline') {
        networkStatusRef.current.className = 'fixed top-0 bottom-0 right-0 left-0 bg-[#0005] z-10 text-center flex items-end'
      } else if (status === 'online') {
        setTimeout(() => {
          networkStatusRef.current.className = 'hidden'
        }, 1200);
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline_state(false); // Set to online
      updateNetworkStatus('You are Online', 'bg-green-500 OnlineAnimation', 'online');
    };

    const handleOffline = () => {
      setIsOffline_state(true); // Set to offline
      updateNetworkStatus('You are Offline', 'bg-gray-500 offlineAnimation', 'offline');
    };
    // Event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline_state]);


  useEffect(() => {
    if (
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/register'
    ) {
      setshow_NavBar_state(true)
    }
    if (location.pathname.includes('/waitRedirecting')) {
      setShowSideMenu_navBar_state(false)
    }
  }, []);

  return (
    <>
      {
        showSideMenu_navBar_state && createPortal(
          <NavBar sideMenu_show={{ sideMenu_state, setSideMenu_state }} show={show_navBar_state} />,
          document.getElementById('navBar')
        )
      }
      {
        showPopUp_onLogOut_btn_state && createPortal(
          <PopUp setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state} heading="Are you sure you want to log out?" btn1_text="Confirm" btn2_text="Close" />,
          document.getElementById('LoginConfirm_popup')
        )
      }
      {
        showBottomAlert_state && createPortal(
          <BottomAlert text={'Text copied to clipboard!'} />,
          document.getElementById('showBottomAlert')
        )
      }
      {showSideMenu_navBar_state && !show_navBar_state && <SideMenu sideMenu_show={{ sideMenu_state, setSideMenu_state }} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/member/dashboard" element={<DashBoard getLogOut_btnClicked={showPopUp_onLogOut_btn_state} setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state} />} />
        <Route path="/member/deposit" element={<Deposit setShowBottomAlert_state={setShowBottomAlert_state} />} />
        <Route path="/member/withdraw" element={<Withdraw setShowBottomAlert_state={setShowBottomAlert_state} />} />
        <Route path="/member/refer-and-earn" element={<ReferEarn />} />
        <Route path="/member/support" element={<Support />} />
        <Route path="/member/settings" element={<Setting />} />
        <Route path="/member/profile" element={<Profile />} />
        {/* Earning Sourse */}
        <Route path="/member/view-ads" element={<ViewAds />} />
        <Route path="/waitRedirecting" element={<WaitRedirecting />} />
      </Routes>
      <div id="networkStatus" ref={networkStatusRef} className='hidden' />
    </>
  );
}

export default App;