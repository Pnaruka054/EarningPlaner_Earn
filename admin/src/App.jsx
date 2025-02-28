import './App.css';
import { Route, Routes } from 'react-router-dom';
import Deshboard from './website/deshboard/deshboard';
import AdminLogin from './website/adminLogin/adminIogin';
import ViewAds from './website/viewAds/viewAds';
import ShortLink from './website/shortLink/shortLink';
import Withdrawal from './website/withdrawal/withdrawal';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Deshboard />} />
        <Route path='/admin/view-ads' element={<ViewAds />} />
        <Route path='/admin/shorten-links' element={<ShortLink/>} />
        <Route path='/admin/withdrawals' element={<Withdrawal/>} />
      </Routes>
    </div>
  );
}

export default App;
