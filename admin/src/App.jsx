import './App.css';
import { Route, Routes } from 'react-router-dom';
import Deshboard from './website/deshboard/deshboard';
import AdminLogin from './website/adminLogin/adminIogin';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Deshboard />} />
      </Routes>
    </div>
  );
}

export default App;
