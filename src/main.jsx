import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter, } from "react-router-dom";

import './index.css'
import { TranslationProvider } from './components/TranslationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider >
      <HashRouter>
        <App />
      </HashRouter>
    </TranslationProvider>
  </React.StrictMode>
)
