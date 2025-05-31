

import './App.css'
import { Routes,Route } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import ForgetPassword from './Pages/Auth/ForgetPassword';
import UpdatePassword from './Pages/Auth/UpdatePassword';
import TermsAndConditions from './Pages/Terms';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import { ToastContainer } from 'react-toastify';
function App() {


  return (
    <div className='w-full'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <Routes>
         <Route path="/" element={<Login />} />
         <Route path='/*' element={<UserLayout/>} />
         <Route path="/forget_password" element={<ForgetPassword />} />
         <Route path="/reset-password/:token" element={<UpdatePassword />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
         <Route path="/terms" element={<TermsAndConditions />} />
         <Route path="/protect/*" element={<AdminLayout/>} />
      </Routes>
    </div>
  )
}

export default App
