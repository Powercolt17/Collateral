import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // No .tsx extension required usually
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
