import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Login from './website/auth/login/login';
import NavBar from './website/components/navBar/navBar';
import SignUp from './website/auth/signUp/signUp';
import DashBoard from './website/dashBoard/dashBoard';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom'
import PopUp from './website/components/popUp/popUp';
import Withdraw from './website/withdraw/withdraw';
import BottomAlert from './website/components/bottomAlert/bottomAlert';
import ReferEarn from './website/ReferEarn/ReferEarn';
import Profile from './website/profile/profile';
import Setting from './website/setting/setting';
import ViewAds from './website/EarningSourses/viewAds/viewAds';
import WaitRedirecting from './website/EarningSourses/viewAds/waitRedirecting';
import WaitRedirecting1 from './website/EarningSourses/viewAds/waitRedirecting1';
import Home from './website/home/home';
import ContactUs from './website/components/contactUs/contactUs';
import PageNotFound from './website/components/pageNotFound/pageNotFound';
import ExtensionUninstalled from './website/extensionUninstalled/extensionUninstalled';
import PasswordResetForm from './website/passwordResetForm/passwordResetForm';
import ClickShortedLink from './website/EarningSourses/clickShortedLink/clickShortedLink';
import LastPage from './website/EarningSourses/clickShortedLink/lastPage';
import PrivacyPolicy from './website/PrivacyPolicy/PrivacyPolicy';
import Terms_of_Use from './website/Terms_of_Use/Terms_of_Use';
import DMCA from './website/DMCA/DMCA';
import FillSurvey from './website/EarningSourses/fillSurvey/fillSurvey';
import EmailVerification from './website/components/email-verification/email-verification';
import { Faq_navBar_contextProvider } from "./website/components/context/faq_navBar_context";

const App = () => {
  const [show_navBar_state, setshow_NavBar_state] = useState(false);
  const [show_Full_navBar_state, setshow_Full_NavBar_state] = useState(false);
  const [showPopUp_onLogOut_btn_state, setShowPopUp_onLogOut_btn_state] = useState(false);
  const [showBottomAlert_state, setShowBottomAlert_state] = useState(false);
  const [isOffline_state, setIsOffline_state] = useState(navigator.onLine ? false : true);
  const [availableBalance_forNavBar_state, setAvailableBalance_forNavBar_state] = useState(0.000);
  const location = useLocation();
  const networkStatusRef = useRef(null);
  const nodeRefMap = useMemo(() => new Map(), []);

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

  useLayoutEffect(() => {
    if (
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/contact-us' ||
      location.pathname.includes('/signup/ref') ||
      location.pathname.includes('/password-reset-form') ||
      location.pathname.includes('/terms-of-use') ||
      location.pathname.includes('/privacy-policy') ||
      location.pathname.includes('/dmca')
    ) {
      setshow_NavBar_state((p) => p = true)
      setshow_Full_NavBar_state((p) => p = false)
    } else if (
      location.pathname === '/member/dashboard' ||
      // location.pathname === '/member/deposit' ||
      location.pathname === '/member/withdraw' ||
      location.pathname === '/member/refer-and-earn' ||
      location.pathname === '/member/support' ||
      location.pathname === '/member/settings' ||
      location.pathname === '/member/profile' ||
      location.pathname === '/member/view-ads' ||
      location.pathname === '/member/click-shorten-link'
    ) {
      setshow_NavBar_state((p) => p = false)
      setshow_Full_NavBar_state((p) => p = false)
    } else if (
      location.pathname.includes('/waitRedirecting') ||
      location.pathname.includes('/member/last-page') ||
      location.pathname.includes('/email-verification')
    ) {
      setshow_Full_NavBar_state((p) => p = true)
    }
  }, [location.pathname]);

  return (
    <Faq_navBar_contextProvider>
      {
        !show_Full_navBar_state && createPortal(
          <NavBar show={show_navBar_state} availableBalance_forNavBar_state={availableBalance_forNavBar_state} />,
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
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          timeout={300}
          classNames="page-fade"
          nodeRef={
            nodeRefMap.has(location.pathname)
              ? nodeRefMap.get(location.pathname)
              : (() => {
                const newRef = { current: null };
                nodeRefMap.set(location.pathname, newRef);
                return newRef;
              })()
          }
        >
          <div ref={nodeRefMap.get(location.pathname)}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact-us" element={<ContactUs forMember={false} />} />
              <Route path="/member/support" element={<ContactUs setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} forMember={true} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset-form/:token" element={<PasswordResetForm />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup/ref/:id" element={<SignUp referral_status="true" />} />
              <Route path="/member/dashboard" element={<DashBoard setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} getLogOut_btnClicked={showPopUp_onLogOut_btn_state} setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state} />} />
              {/* <Route path="/member/deposit" element={<Deposit setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} setShowBottomAlert_state={setShowBottomAlert_state} />} /> */}
              <Route path="/member/withdraw" element={<Withdraw setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} setShowBottomAlert_state={setShowBottomAlert_state} />} />
              <Route path="/member/refer-and-earn" element={<ReferEarn setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/member/settings" element={<Setting setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/email-verification/:token/:email" element={<EmailVerification />} />
              <Route path="/member/profile" element={<Profile setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<Terms_of_Use />} />
              <Route path="/dmca" element={<DMCA />} />
              {/* Earning Sourse */}
              <Route path="/member/view-ads" element={<ViewAds setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/waitRedirecting" element={<WaitRedirecting />} />
              <Route path="/waitRedirecting1" element={<WaitRedirecting1 />} />
              <Route path="/member/click-shorten-link" element={<ClickShortedLink setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/member/last-page/:uniqueToken" element={<LastPage />} />
              <Route path="/member/fill-survey" element={<FillSurvey setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />} />
              <Route path="/*" element={<PageNotFound setshow_NavBar_state={setshow_NavBar_state} />} />

              <Route path="/extension/uninstalled" element={<ExtensionUninstalled setshow_NavBar_state={setshow_NavBar_state} />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <div id="networkStatus" ref={networkStatusRef} className='hidden' />
    </Faq_navBar_contextProvider>
  );
}

export default App;