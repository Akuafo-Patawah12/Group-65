

import './App.css'
import "antd/dist/reset.css";
import { Routes,Route } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';

function App() {


  return (
    <div className='w-full'>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path='/*' element={<UserLayout/>} />
         <Route path="/protect/*" element={<AdminLayout/>} />
      </Routes>
    </div>
  )
}

export default App
