import { Outlet, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'
import SiteFooter from './SiteFooter'
import SiteNav from './SiteNav'

function RouteChangeHandler() {
    const location = useLocation()
    const mainRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const main = mainRef.current

        if (location.hash) {
            const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
            target?.scrollIntoView({ behavior: 'instant' })
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }

        main?.focus({ preventScroll: true })
    }, [location.pathname, location.hash])

    return <div className='site-content'>
        <main ref={mainRef} id='main-content' tabIndex={-1}>
            <Outlet />
        </main>
        <SiteFooter />
    </div>
}

export default function SiteLayout() {
    return (
        <>
            <SiteNav />
            <RouteChangeHandler />
        </>
    )
}
