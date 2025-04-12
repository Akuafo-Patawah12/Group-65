import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "antd/dist/reset.css"; // For Ant Design v5+


createRoot(document.getElementById('root')!).render(
 
  
  <StrictMode>
     <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
