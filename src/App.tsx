import { Route, Routes } from 'react-router'
import SiteNav from './components/SiteNav'
import HomePage from './pages/HomePage'

export default function App() {
    return (
        <>
            <SiteNav />
            <div className='site-content'>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/index.html' element={<HomePage />} />
                </Routes>
            </div>
        </>
    )
}
