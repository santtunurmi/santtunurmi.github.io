import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '../scss/main.scss'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename='/'>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
