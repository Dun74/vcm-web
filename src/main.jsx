import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, } from "react-router-dom";
import Brothers from './components/brothers/Brothers';
import ProgramEditor from './components/program/ProgramEditor';

import './index.css'
import { TranslationProvider } from './components/TranslationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TranslationProvider>
  </React.StrictMode>
)
