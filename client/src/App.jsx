import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './website/client/auth/login/login';
import NavBar from './website/client/components/navBar/navBar';
import SignUp from './website/client/auth/signUp/signUp';
import DashBoard from './website/client/dashBoard/dashBoard';
import { useEffect, useState } from 'react';
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
import WatchVideo from './website/client/EarningSourses/watchVideo/watchVideo';

const App = () => {
  const [show_navBar_state, setshow_NavBar_state] = useState(false);
  const [showPopUp_onLogOut_btn_state, setShowPopUp_onLogOut_btn_state] = useState(false);
  const [sideMenu_state, setSideMenu_state] = useState('menu-outline');
  const [showBottomAlert_state, setShowBottomAlert_state] = useState(false);

  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/register'
    ) {
      setshow_NavBar_state(true)
    }
  }, []);

  return (
    <>
      {
        createPortal(
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
      {!show_navBar_state && <SideMenu sideMenu_show={{ sideMenu_state, setSideMenu_state }} />}
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
        <Route path="/member/watch-video" element={<WatchVideo />} />
      </Routes>
    </>
  );
}

export default App;