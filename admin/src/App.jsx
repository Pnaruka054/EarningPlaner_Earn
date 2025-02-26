import './App.css';
import { Route, Routes } from 'react-router-dom';
import Deshboard from './website/deshboard/deshboard';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/admin/dashboard' element={<Deshboard />} />
      </Routes>
    </div>
  );
}

export default App;
