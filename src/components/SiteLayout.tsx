import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router'
import { useEffect, useLayoutEffect, useRef } from 'react'
import SiteFooter from './SiteFooter'
import SiteNav from './SiteNav'
import { useRouteTransition } from './motion'

function RouteChangeHandler() {
    const location = useLocation()
    const outlet = useOutlet()
    const initialLocation = useRef(location.key)
    const mainRef = useRef<HTMLElement>(null)
    const routeTransition = useRouteTransition()

    useLayoutEffect(() => {
        if (location.key !== initialLocation.current) {
            document.documentElement.classList.remove('initial-page-load')
        }
    }, [location.key])

    useEffect(() => {
        const root = document.documentElement
        const main = mainRef.current

        function finishInitialReveal(event: AnimationEvent) {
            const target = event.target

            if (event.animationName === 'initial-page-reveal' && target instanceof Element && !target.classList.contains('opening-card')) {
                root.classList.remove('initial-page-load')
            }
        }

        main?.addEventListener('animationend', finishInitialReveal)
        const fallback = window.setTimeout(() => root.classList.remove('initial-page-load'), 2100)

        return () => {
            main?.removeEventListener('animationend', finishInitialReveal)
            window.clearTimeout(fallback)
        }
    }, [])

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
            <AnimatePresence initial={false} mode='popLayout'>
                <motion.div key={location.pathname} {...routeTransition}>
                    {outlet}
                </motion.div>
            </AnimatePresence>
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
