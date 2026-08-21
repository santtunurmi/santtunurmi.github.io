import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router'
import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import SiteFooter from './SiteFooter'
import { useRouteTransition } from './motion'

type RouteContentProps = {
    hash: string
    mainRef: RefObject<HTMLElement | null>
    outlet: ReactNode
}

function RouteContent({ hash, mainRef, outlet }: RouteContentProps) {
    const routeTransition = useRouteTransition()

    useLayoutEffect(() => {
        if (hash) {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)))
            target?.scrollIntoView({ behavior: 'instant' })
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }

        mainRef.current?.focus({ preventScroll: true })
    }, [hash, mainRef])

    return <motion.div {...routeTransition}>{outlet}</motion.div>
}

function RouteChangeHandler() {
    const location = useLocation()
    const outlet = useOutlet()
    const initialLocation = useRef(location.key)
    const mainRef = useRef<HTMLElement>(null)

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

    return <div className='site-content'>
        <main ref={mainRef} id='main-content' tabIndex={-1}>
            <AnimatePresence initial={false} mode='wait'>
                <RouteContent hash={location.hash} mainRef={mainRef} outlet={outlet} key={location.key} />
            </AnimatePresence>
        </main>
        <SiteFooter />
    </div>
}

export default function SiteLayout() {
    return <RouteChangeHandler />
}
