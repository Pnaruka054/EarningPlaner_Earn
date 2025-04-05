import './App.css';
import { Route, Routes } from 'react-router-dom';
import Deshboard from './website/deshboard/deshboard';
import AdminLogin from './website/adminLogin/adminIogin';
import PtcAds from './website/ptcAds/ptcAds';
import ShortLink from './website/shortLink/shortLink';
import Withdrawal from './website/withdrawal/withdrawal';
import PrivacyPolicy from './website/privacy_policy/privacy_policy';
import TermsOfUse from './website/terms_of_use/terms_of_use';
import Dmca from './website/dmca/dmca';
import OfferWall from './website/offerWall/offerWall';
import Users from './website/users/users';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Deshboard />} />
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/ptc-ads' element={<PtcAds />} />
        <Route path='/admin/shorten-links' element={<ShortLink />} />
        <Route path='/admin/offer-walls' element={<OfferWall />} />
        <Route path='/admin/withdrawals' element={<Withdrawal />} />
        <Route path='/admin/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/admin/terms-of-use' element={<TermsOfUse />} />
        <Route path='/admin/dmca' element={<Dmca />} />
      </Routes>
    </div>
  );
}

export default App;
