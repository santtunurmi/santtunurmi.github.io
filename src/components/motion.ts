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

export function useInViewReveal(delay = 0, amount = 0.15): MotionProps {
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
        viewport: { once: true, amount },
        transition: { duration: 0.27, delay, ease: easing },
    }
}
