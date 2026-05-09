import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#191b23',
          color: '#f0f0fb',
          borderRadius: '0.75rem',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          style: {
            background: '#004ac6',
            color: '#ffffff',
          },
          iconTheme: { primary: '#ffffff', secondary: '#004ac6' },
        },
        error: {
          style: {
            background: '#ba1a1a',
            color: '#ffffff',
          },
          iconTheme: { primary: '#ffffff', secondary: '#ba1a1a' },
        },
      }}
    />
  </React.StrictMode>,
)
