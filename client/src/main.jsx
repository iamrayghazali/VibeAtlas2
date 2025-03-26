import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./context/AuthContext.jsx";
import {RouterProvider} from "react-router-dom";
import router from "./router"; // Import your router setup


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
          <App />
          <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
