import { Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/SiteLayout'
import AiPage from './pages/AiPage'
import EducationAndWorkPage from './pages/EducationAndWorkPage'
import HobbiesPage from './pages/HobbiesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import WebserverPage from './pages/WebserverPage'
import { legacyRouteRedirects, siteRoutes } from './routes'

export default function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route path={siteRoutes.home} element={<HomePage />} />
                <Route path={siteRoutes.educationAndWork} element={<EducationAndWorkPage />} />
                <Route path={siteRoutes.ai} element={<AiPage />} />
                <Route path={siteRoutes.hobbies} element={<HobbiesPage />} />
                <Route path={siteRoutes.webserver} element={<WebserverPage />} />
                {legacyRouteRedirects.map((route) => (
                    <Route path={route.from} element={<Navigate to={route.to} replace />} key={route.from} />
                ))}
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
