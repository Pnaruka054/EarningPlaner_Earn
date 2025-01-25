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
import Invoice from './website/client/invoice/invoice';
import Support from './website/client/support/support';
import ReferEarn from './website/client/ReferEarn/ReferEarn';

const App = () => {
  const [show_navBar_state, setshow_NavBar_state] = useState(false);
  const [showPopUp_onLogOut_btn, setShowPopUp_onLogOut_btn] = useState(false);
  const [sideMenu_state, setSideMenu_state] = useState('menu-outline');
  const [showBottomAlert, setShowBottomAlert] = useState(false);

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
        showPopUp_onLogOut_btn && createPortal(
          <PopUp setLogOut_btnClicked={setShowPopUp_onLogOut_btn} heading="Are you sure you want to log out?" btn1_text="Confirm" btn2_text="Close" />,
          document.getElementById('LoginConfirm_popup')
        )
      }
      {
        showBottomAlert && createPortal(
          <BottomAlert />,
          document.getElementById('showBottomAlert')
        )
      }
      {!show_navBar_state && <SideMenu sideMenu_show={{ sideMenu_state, setSideMenu_state }} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/member/dashboard" element={<DashBoard getLogOut_btnClicked={showPopUp_onLogOut_btn} setLogOut_btnClicked={setShowPopUp_onLogOut_btn} />} />
        <Route path="/member/deposit" element={<Deposit setShowBottomAlert={setShowBottomAlert} />} />
        <Route path="/member/withdraw" element={<Withdraw setShowBottomAlert={setShowBottomAlert} />} />
        <Route path="/member/refer-and-earn" element={<ReferEarn />} />
        <Route path="/member/invoices" element={<Invoice />} />
        <Route path="/member/support" element={<Support />} />
      </Routes>
    </>
  );
}

export default App;