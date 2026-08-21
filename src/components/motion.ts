import { useEffect, useState } from 'react'
import { useReducedMotion, type MotionProps } from 'motion/react'

const easing = [0.22, 1, 0.36, 1] as const

function useVerticalTransition(duration: number): MotionProps {
    const reducedMotion = useReducedMotion()

    if (reducedMotion) {
        return {
            initial: false,
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 1, y: 0 },
            transition: { duration: 0 },
        }
    }

    return {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration, ease: easing },
    }
}

export function useRouteTransition(): MotionProps {
    return useVerticalTransition(0.27)
}

export function useDialogTransition(): MotionProps {
    return useVerticalTransition(0.54)
}

export function useInViewReveal(delay = 0, amount = 0.15, enabled = true): MotionProps {
    const reducedMotion = useReducedMotion()

    if (reducedMotion || !enabled) {
        return {
            initial: false,
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0 },
        }
    }

    return {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount },
        transition: { duration: 0.27, delay, ease: easing },
    }
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

    useEffect(() => {
        const mediaQuery = window.matchMedia(query)

        function updateMatch() {
            setMatches(mediaQuery.matches)
        }

        updateMatch()
        mediaQuery.addEventListener('change', updateMatch)

        return () => mediaQuery.removeEventListener('change', updateMatch)
    }, [query])

    return matches
}
