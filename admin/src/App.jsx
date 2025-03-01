import './App.css';
import { Route, Routes } from 'react-router-dom';
import Deshboard from './website/deshboard/deshboard';
import AdminLogin from './website/adminLogin/adminIogin';
import ViewAds from './website/viewAds/viewAds';
import ShortLink from './website/shortLink/shortLink';
import Withdrawal from './website/withdrawal/withdrawal';
import PrivacyPolicy from './website/privacy_policy/privacy_policy';
import TermsOfUse from './website/terms_of_use/terms_of_use';
import Dmca from './website/dmca/dmca';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Deshboard />} />
        <Route path='/admin/view-ads' element={<ViewAds />} />
        <Route path='/admin/shorten-links' element={<ShortLink/>} />
        <Route path='/admin/withdrawals' element={<Withdrawal/>} />
        <Route path='/admin/privacy-policy' element={<PrivacyPolicy/>} />
        <Route path='/admin/terms-of-use' element={<TermsOfUse />} />
        <Route path='/admin/dmca' element={<Dmca/>} />
      </Routes>
    </div>
  );
}

export default App;
