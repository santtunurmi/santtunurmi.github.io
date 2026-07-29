import { Route, Routes } from 'react-router'
import SiteLayout from './components/SiteLayout'
import AiPage from './pages/AiPage'
import BioPage from './pages/BioPage'
import HobbiesPage from './pages/HobbiesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import WebserverPage from './pages/WebserverPage'

export default function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/index.html' element={<HomePage />} />
                <Route path='/bio' element={<BioPage />} />
                <Route path='/bio.html' element={<BioPage />} />
                <Route path='/ai' element={<AiPage />} />
                <Route path='/ai.html' element={<AiPage />} />
                <Route path='/hobbies' element={<HobbiesPage />} />
                <Route path='/hobbies.html' element={<HobbiesPage />} />
                <Route path='/webserver' element={<WebserverPage />} />
                <Route path='/webserver.html' element={<WebserverPage />} />
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
