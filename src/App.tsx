import { Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/SiteLayout'
import AiPage from './pages/AiPage'
import EducationAndWorkPage from './pages/EducationAndWorkPage'
import HobbiesPage from './pages/HobbiesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import WebserverPage from './pages/WebserverPage'

export default function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/index.html' element={<Navigate to='/' replace />} />
                <Route path='/education-and-work' element={<EducationAndWorkPage />} />
                <Route path='/education-and-work.html' element={<Navigate to='/education-and-work' replace />} />
                <Route path='/bio' element={<Navigate to='/education-and-work' replace />} />
                <Route path='/bio.html' element={<Navigate to='/education-and-work' replace />} />
                <Route path='/ai' element={<AiPage />} />
                <Route path='/ai.html' element={<Navigate to='/ai' replace />} />
                <Route path='/hobbies' element={<HobbiesPage />} />
                <Route path='/hobbies.html' element={<Navigate to='/hobbies' replace />} />
                <Route path='/webserver' element={<WebserverPage />} />
                <Route path='/webserver.html' element={<Navigate to='/webserver' replace />} />
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
