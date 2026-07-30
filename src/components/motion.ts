import { useReducedMotion, type MotionProps } from 'motion/react'

const easing = [0.22, 1, 0.36, 1] as const

export function useRouteTransition(): MotionProps {
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
        transition: { duration: 0.27, ease: easing },
    }
}

export function useInViewReveal(delay = 0): MotionProps {
    const reducedMotion = useReducedMotion()

    if (reducedMotion) {
        return {
            initial: false,
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0 },
        }
    }

    return {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.27, delay, ease: easing },
    }
}
