import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Login from './website/auth/login/login';
import NavBar from './website/components/navBar/navBar';
import SignUp from './website/auth/signUp/signUp';
import DashBoard from './website/dashBoard/dashBoard';
import PopUp from './website/components/popUp/popUp';
import Withdraw from './website/withdraw/withdraw';
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
import EmailVerification from './website/components/email-verification/email-verification';
import { NavBar_global_contextProvider } from "./website/components/context/navBar_globalContext";
import PaymentProof from './website/paymentProof/paymentProof';
import GiftCode from './website/GiftCode/GiftCode';
import OfferWall from './website/EarningSourses/OfferWall/OfferWall';
import ViewOfferWall from './website/EarningSourses/OfferWall/viewOfferWall';
import AppInstallButton from './website/components/appInstallButton/appInstallButton';
import UserNetworkStatusCheck from './website/components/userNetworkStatus_check';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const App = () => {
  const [show_navBar_state, setshow_NavBar_state] = useState(false);
  const [show_Full_navBar_state, setshow_Full_navBar_state] = useState(false);
  const [showPopUp_onLogOut_btn_state, setShowPopUp_onLogOut_btn_state] = useState(false);
  const [availableBalance_forNavBar_state, setAvailableBalance_forNavBar_state] = useState(0.000);
  const [appDownloadBtn_state, setAppDownloadBtn_state] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    if (
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/contact-us' ||
      location.pathname === '/payment-proof' ||
      location.pathname.includes('/signup/ref') ||
      location.pathname.includes('/password-reset-form') ||
      location.pathname.includes('/terms-of-use') ||
      location.pathname.includes('/privacy-policy') ||
      location.pathname.includes('/dmca')
    ) {
      setshow_NavBar_state(true);
      setshow_Full_navBar_state(false);
    } else if (
      location.pathname === '/member/dashboard' ||
      // location.pathname === '/member/deposit' ||
      location.pathname === '/member/withdraw' ||
      location.pathname === '/member/refer-and-earn' ||
      location.pathname === '/member/support' ||
      location.pathname === '/member/settings' ||
      location.pathname === '/member/profile' ||
      location.pathname === '/member/gift-code' ||
      location.pathname === '/member/view-ads' ||
      location.pathname.includes('/member/offer-wall') ||
      location.pathname === '/member/click-shorten-link'
    ) {
      setshow_NavBar_state(false);
      setshow_Full_navBar_state(false);
      localStorage.setItem("userAlreadyRegistered", 'true');
    } else if (
      location.pathname.includes('/waitRedirecting') ||
      location.pathname.includes('/member/last-page') ||
      location.pathname.includes('/email-verification')
    ) {
      setshow_Full_navBar_state(true);
    }


    if (
      location.pathname === '/' ||
      location.pathname === '/payment-proof' ||
      location.pathname.includes('/terms-of-use') ||
      location.pathname.includes('/privacy-policy') ||
      location.pathname.includes('/dmca') ||
      location.pathname === '/member/dashboard'
    ) {
      setAppDownloadBtn_state(true)
    } else {
      setAppDownloadBtn_state(false)
    }
  }, [location.pathname]);

  return (
    <NavBar_global_contextProvider>
      <UserNetworkStatusCheck />
      {
        appDownloadBtn_state && createPortal(
          <AppInstallButton />,
          document.getElementById('appInstall')
        )
      }
      {
        !show_Full_navBar_state && createPortal(
          <NavBar
            show={show_navBar_state}
            availableBalance_forNavBar_state={availableBalance_forNavBar_state}
            setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state}
          />,
          document.getElementById('navBar')
        )
      }
      {
        showPopUp_onLogOut_btn_state && createPortal(
          <PopUp
            setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state}
            heading="Are you sure you want to log out?"
            btn1_text="Confirm"
            btn2_text="Close"
          />,
          document.getElementById('LoginConfirm_popup')
        )
      }

      {/* Parent container with relative positioning using Tailwind */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/payment-proof"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PaymentProof />
                </motion.div>
              }
            />
            <Route
              path="/contact-us"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ContactUs forMember={false} />
                </motion.div>
              }
            />
            <Route
              path="/member/support"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ContactUs setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} forMember={true} />
                </motion.div>
              }
            />
            <Route
              path="/login"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="/password-reset-form/:token"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PasswordResetForm />
                </motion.div>
              }
            />
            <Route
              path="/signup"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SignUp />
                </motion.div>
              }
            />
            <Route
              path="/signup/ref/:id"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SignUp referral_status="true" />
                </motion.div>
              }
            />
            <Route
              path="/member/dashboard"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DashBoard
                    setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state}
                    getLogOut_btnClicked={showPopUp_onLogOut_btn_state}
                    setLogOut_btnClicked={setShowPopUp_onLogOut_btn_state}
                  />
                </motion.div>
              }
            />
            <Route
              path="/member/withdraw"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Withdraw
                    setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state}
                  />
                </motion.div>
              }
            />
            <Route
              path="/member/refer-and-earn"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ReferEarn setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/member/settings"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Setting setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/email-verification/:token/:email"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <EmailVerification />
                </motion.div>
              }
            />
            <Route
              path="/member/profile"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Profile setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PrivacyPolicy />
                </motion.div>
              }
            />
            <Route
              path="/terms-of-use"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Terms_of_Use />
                </motion.div>
              }
            />
            <Route
              path="/dmca"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DMCA />
                </motion.div>
              }
            />
            <Route
              path="/member/view-ads"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ViewAds setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/waitRedirecting"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <WaitRedirecting />
                </motion.div>
              }
            />
            <Route
              path="/waitRedirecting1"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <WaitRedirecting1 />
                </motion.div>
              }
            />
            <Route
              path="/member/click-shorten-link"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ClickShortedLink setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/member/last-page/:uniqueToken"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LastPage />
                </motion.div>
              }
            />
            <Route
              path="/member/offer-wall"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <OfferWall setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/member/offer-wall/:encodedUrl"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ViewOfferWall setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/member/gift-code"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <GiftCode setAvailableBalance_forNavBar_state={setAvailableBalance_forNavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/*"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PageNotFound setshow_NavBar_state={setshow_NavBar_state} />
                </motion.div>
              }
            />
            <Route
              path="/extension/uninstalled"
              element={
                <motion.div
                  className="absolute w-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ExtensionUninstalled setshow_NavBar_state={setshow_NavBar_state} />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </NavBar_global_contextProvider>
  );
};

export default App;
