import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ToasterProvider } from './components/ui/toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </React.StrictMode>,
)