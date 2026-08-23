import { Link } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from 'react'
import type { ContentImage, ContentLink } from '../models/content'
import { useDialogTransition } from './motion'

export type ModalDisplayProps = {
    open: boolean
    title: string
    children: ReactNode
    caseStudy?: Extract<ContentLink, { type: 'internal' }>
    links?: readonly ContentLink[]
    images?: readonly ContentImage[]
    onClosing?: () => void
    onClosed: () => void
    returnFocusRef?: RefObject<HTMLElement | null>
    restoreFocus?: boolean
}

export default function ModalDisplay({ open, title, children, caseStudy, links, images, onClosing, onClosed, returnFocusRef, restoreFocus = false }: ModalDisplayProps) {
    const titleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const openFrameRef = useRef<number | null>(null)
    const closeButtonFocusFrameRef = useRef<number | null>(null)
    const returnFocusFrameRef = useRef<number | null>(null)
    const returnFocusAfterCloseRef = useRef(false)
    const visibleRef = useRef(false)
    const [visible, setVisible] = useState(false)
    const [closing, setClosing] = useState(false)
    const dialogTransition = useDialogTransition()

    useEffect(() => {
        const dialog = dialogRef.current

        cancelFrame(openFrameRef)
        cancelFrame(closeButtonFocusFrameRef)

        if (!dialog) {
            return
        }

        if (open) {
            if (!dialog.open) {
                dialog.showModal()
            }

            cancelFrame(returnFocusFrameRef)
            openFrameRef.current = requestAnimationFrame(() => {
                visibleRef.current = true
                setVisible(true)
                closeButtonFocusFrameRef.current = requestAnimationFrame(() => closeButtonRef.current?.focus())
            })
        } else if (dialog.open) {
            setVisible(false)

            if (visibleRef.current) {
                setClosing(true)
            } else {
                dialog.close()
            }
        } else {
            setClosing(false)
        }

        return () => {
            cancelFrame(openFrameRef)
            cancelFrame(closeButtonFocusFrameRef)
        }
    }, [open])

    useEffect(() => () => cancelFrame(returnFocusFrameRef), [])

    function requestClose() {
        returnFocusAfterCloseRef.current = restoreFocus
        visibleRef.current = false
        setVisible(false)
        setClosing(true)
        onClosing?.()
    }

    function finishClose() {
        if (closing) {
            dialogRef.current?.close()
        }
    }

    function finishNativeClose() {
        const shouldRestoreFocus = returnFocusAfterCloseRef.current

        visibleRef.current = false
        setVisible(false)
        setClosing(false)
        onClosed()
        returnFocusAfterCloseRef.current = false
        returnFocusFrameRef.current = requestAnimationFrame(() => {
            const trigger = returnFocusRef?.current

            if (shouldRestoreFocus) {
                trigger?.focus()
            } else if (trigger && document.activeElement === trigger) {
                trigger.blur()
            }
        })
    }

    function closeFromBackdrop(event: ReactMouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            requestClose()
        }
    }

    return (
        <dialog className={`modal-display${visible ? ' modal-display--visible' : ''}`} ref={dialogRef} onClick={closeFromBackdrop} onCancel={(event) => { event.preventDefault(); requestClose() }} onClose={finishNativeClose} aria-labelledby={titleId}>
            <AnimatePresence onExitComplete={finishClose}>
                {open && !closing && (
                    <motion.div className='modal-display-content' {...dialogTransition}>
                        <button className='modal-display-close site-control' ref={closeButtonRef} type='button' onClick={requestClose} aria-label='Close' autoFocus>Close</button>
                        <h2 id={titleId} className='h4 fw-semibold'>{title}</h2>
                        {children}
                        {caseStudy && <CaseStudyLink link={caseStudy} />}
                        {links && links.length > 0 && <ModalLinks links={links} />}
                        {images && images.length > 0 && <ModalImageCarousel images={images} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </dialog>
    )
}

export type ModalImageCarouselProps = {
    images: readonly ContentImage[]
}

export function ModalImageCarousel({ images }: ModalImageCarouselProps) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const targetPositionRef = useRef<number | null>(null)
    const imagePositionsRef = useRef<number[]>([])
    const scrollFrameRef = useRef<number | null>(null)
    const momentumFrameRef = useRef<number | null>(null)
    const pressedControlTimeoutRef = useRef<number | null>(null)
    const dragRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number; lastX: number; lastTime: number; velocity: number } | null>(null)
    const reducedMotion = useReducedMotion()
    const [scrollState, setScrollState] = useState({ hasOverflow: false, atStart: true, atEnd: true })
    const scrollStateRef = useRef(scrollState)
    const [dragging, setDragging] = useState(false)
    const [pressedControl, setPressedControl] = useState<-1 | 1 | null>(null)

    function cancelMouseMomentum() {
        cancelFrame(momentumFrameRef)
    }

    function getMaximumScroll(viewport: HTMLElement): number {
        return Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    }

    const updateScrollState = useCallback((viewport: HTMLElement) => {
        const maximumScroll = getMaximumScroll(viewport)
        const currentScroll = targetPositionRef.current ?? viewport.scrollLeft
        const nextScrollState = {
            hasOverflow: maximumScroll > 1,
            atStart: currentScroll <= 1,
            atEnd: maximumScroll - currentScroll <= 1,
        }

        if (scrollStateRef.current.hasOverflow !== nextScrollState.hasOverflow || scrollStateRef.current.atStart !== nextScrollState.atStart || scrollStateRef.current.atEnd !== nextScrollState.atEnd) {
            scrollStateRef.current = nextScrollState
            setScrollState(scrollStateRef.current)
        }
    }, [])

    const scroll = useCallback((direction: -1 | 1) => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const maximumScroll = getMaximumScroll(viewport)
        const currentScroll = targetPositionRef.current ?? viewport.scrollLeft

        if ((direction === -1 && currentScroll <= 1) || (direction === 1 && maximumScroll - currentScroll <= 1)) {
            return
        }

        cancelMouseMomentum()

        const imagePositions = imagePositionsRef.current
        const left = direction === 1
            ? imagePositions.find((position) => position > currentScroll + 1) ?? maximumScroll
            : [...imagePositions].reverse().find((position) => position < currentScroll - 1) ?? 0

        targetPositionRef.current = left
        updateScrollState(viewport)
        viewport.scrollTo({
            left,
            behavior: reducedMotion ? 'auto' : 'smooth',
        })
    }, [reducedMotion, updateScrollState])

    function startMouseMomentum(velocity: number, movedAt: number, releasedAt: number) {
        if (reducedMotion || releasedAt - movedAt > 120 || Math.abs(velocity) < 0.02) {
            return
        }

        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        let lastTime = performance.now()

        function continueMomentum(time: number) {
            momentumFrameRef.current = null

            const currentViewport = viewportRef.current

            if (!currentViewport) {
                return
            }

            const elapsed = Math.min(32, Math.max(1, time - lastTime))
            lastTime = time
            velocity *= Math.pow(0.92, elapsed / 16)
            const maximumScroll = getMaximumScroll(currentViewport)
            const nextScroll = Math.min(maximumScroll, Math.max(0, currentViewport.scrollLeft + velocity * elapsed))
            currentViewport.scrollLeft = nextScroll

            if (nextScroll <= 0 || nextScroll >= maximumScroll || Math.abs(velocity) < 0.02) {
                return
            }

            momentumFrameRef.current = requestAnimationFrame(continueMomentum)
        }

        momentumFrameRef.current = requestAnimationFrame(continueMomentum)
    }

    const activateControl = useCallback((direction: -1 | 1) => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const maximumScroll = getMaximumScroll(viewport)
        const currentScroll = targetPositionRef.current ?? viewport.scrollLeft

        if ((direction === -1 && currentScroll <= 1) || (direction === 1 && maximumScroll - currentScroll <= 1)) {
            return
        }

        cancelMouseMomentum()
        if (pressedControlTimeoutRef.current !== null) {
            window.clearTimeout(pressedControlTimeoutRef.current)
        }

        setPressedControl(direction)
        pressedControlTimeoutRef.current = window.setTimeout(() => {
            pressedControlTimeoutRef.current = null
            setPressedControl(null)
        }, 160)
        scroll(direction)
    }, [scroll])

    function cancelProgrammaticScroll(viewport: HTMLElement) {
        targetPositionRef.current = null
        viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'auto' })
        updateScrollState(viewport)
    }

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const viewportElement = viewport

        function updateScrollPosition() {
            scrollFrameRef.current = null

            if (targetPositionRef.current !== null && Math.abs(targetPositionRef.current - viewportElement.scrollLeft) <= 1) {
                targetPositionRef.current = null
            }

            updateScrollState(viewportElement)
        }

        function measureLayout() {
            cancelMouseMomentum()
            setCssCustomProperty(viewportElement, '--carousel-image-max-width', `${viewportElement.clientWidth}px`)

            const carouselImages = getCarouselImages(viewportElement)
            const viewportRect = viewportElement.getBoundingClientRect()
            const imageRects = carouselImages.map((image) => image.getBoundingClientRect())
            const maximumScroll = getMaximumScroll(viewportElement)
            imagePositionsRef.current = imageRects.map((imageRect) => Math.min(maximumScroll, Math.max(0, viewportElement.scrollLeft + imageRect.left - viewportRect.left)))
            targetPositionRef.current = targetPositionRef.current === null ? null : Math.min(maximumScroll, targetPositionRef.current)

            updateScrollState(viewportElement)
        }

        function scheduleScrollPositionUpdate() {
            if (scrollFrameRef.current === null) {
                scrollFrameRef.current = requestAnimationFrame(updateScrollPosition)
            }

        }

        measureLayout()
        viewport.addEventListener('scroll', scheduleScrollPositionUpdate, { passive: true })

        const resizeObserver = new ResizeObserver(measureLayout)
        resizeObserver.observe(viewport)
        const track = viewport.firstElementChild

        if (track) {
            resizeObserver.observe(track)
        }

        const carouselImages = getCarouselImages(viewport)
        carouselImages.forEach((image) => {
            resizeObserver.observe(image)
            image.addEventListener('load', measureLayout)
        })

        return () => {
            viewport.removeEventListener('scroll', scheduleScrollPositionUpdate)
            resizeObserver.disconnect()
            carouselImages.forEach((image) => image.removeEventListener('load', measureLayout))
            cancelFrame(scrollFrameRef)
            cancelMouseMomentum()
            const drag = dragRef.current

            if (drag && viewportElement.hasPointerCapture(drag.pointerId)) {
                viewportElement.releasePointerCapture(drag.pointerId)
            }

            dragRef.current = null
            targetPositionRef.current = null
        }
    }, [images, updateScrollState])

    useEffect(() => () => {
        if (pressedControlTimeoutRef.current !== null) {
            window.clearTimeout(pressedControlTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        function scrollFromArrowKey(event: KeyboardEvent) {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditableElement(event.target)) {
                return
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const viewport = viewportRef.current
                const direction = event.key === 'ArrowLeft' ? -1 : 1

                if (!viewport) {
                    return
                }

                const currentScroll = targetPositionRef.current ?? viewport.scrollLeft

                if ((direction === -1 && currentScroll <= 1) || (direction === 1 && getMaximumScroll(viewport) - currentScroll <= 1)) {
                    return
                }

                event.preventDefault()
                activateControl(direction)
            }
        }

        document.addEventListener('keydown', scrollFromArrowKey)

        return () => document.removeEventListener('keydown', scrollFromArrowKey)
    }, [activateControl])

    function finishDrag(pointerId: number, continueWithMomentum: boolean, releasedAt: number) {
        const drag = dragRef.current

        if (!drag || drag.pointerId !== pointerId) {
            return
        }

        dragRef.current = null
        setDragging(false)

        if (viewportRef.current?.hasPointerCapture(pointerId)) {
            viewportRef.current.releasePointerCapture(pointerId)
        }

        if (continueWithMomentum) {
            startMouseMomentum(drag.velocity, drag.lastTime, releasedAt)
        }
    }

    function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
        if (!event.isPrimary) {
            return
        }

        const viewport = event.currentTarget

        if (event.pointerType !== 'mouse') {
            cancelMouseMomentum()
            cancelProgrammaticScroll(viewport)
            return
        }

        if (event.button !== 0) {
            return
        }

        cancelMouseMomentum()
        cancelProgrammaticScroll(viewport)
        viewport.setPointerCapture(event.pointerId)
        dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: viewport.scrollLeft, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 }
        setDragging(true)
    }

    function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
        const drag = dragRef.current

        if (!drag || drag.pointerId !== event.pointerId) {
            return
        }

        event.preventDefault()
        event.currentTarget.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX)
        const elapsed = event.timeStamp - drag.lastTime

        if (elapsed > 0) {
            drag.velocity = -(event.clientX - drag.lastX) / elapsed
            drag.lastX = event.clientX
            drag.lastTime = event.timeStamp
        }
    }

    function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
        finishDrag(event.pointerId, true, event.timeStamp)
    }

    function cancelDrag(event: ReactPointerEvent<HTMLDivElement>) {
        finishDrag(event.pointerId, false, event.timeStamp)
    }

    function clickControl(direction: -1 | 1, event: ReactMouseEvent<HTMLButtonElement>) {
        activateControl(direction)

        if (event.detail > 0) {
            event.currentTarget.blur()
        }
    }

    return (
        <div className='modal-display-carousel' role='region' aria-label='Images'>
            <div className={`modal-display-carousel-viewport${dragging ? ' modal-display-carousel-viewport--dragging' : ''}`} ref={viewportRef} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onWheel={(event) => { cancelMouseMomentum(); cancelProgrammaticScroll(event.currentTarget) }}>
                <div className='modal-display-carousel-track'>
                    {images.map((image, index) => (
                        <img className='modal-display-carousel-image' src={image.src} alt={image.alt} loading='lazy' draggable={false} onDragStart={(event) => event.preventDefault()} key={`${image.src}-${index}`} />
                    ))}
                </div>
            </div>
            {scrollState.hasOverflow && (
                <>
                    <button className={`modal-display-carousel-control modal-display-carousel-control--previous site-control${pressedControl === -1 ? ' modal-display-carousel-control--pressed' : ''}`} type='button' onClick={(event) => clickControl(-1, event)} disabled={scrollState.atStart} aria-label='Scroll images left'><CarouselArrowIcon direction='previous' /></button>
                    <button className={`modal-display-carousel-control modal-display-carousel-control--next site-control${pressedControl === 1 ? ' modal-display-carousel-control--pressed' : ''}`} type='button' onClick={(event) => clickControl(1, event)} disabled={scrollState.atEnd} aria-label='Scroll images right'><CarouselArrowIcon direction='next' /></button>
                </>
            )}
        </div>
    )
}

function CaseStudyLink({ link }: { link: Extract<ContentLink, { type: 'internal' }> }) {
    return (
        <section className='mt-3 mb-3' aria-label='Case study'>
            <h3 className='h6 mb-1'>Case study:</h3>
            <Link to={link.to} title={link.title}>{link.text}</Link>
        </section>
    )
}

function CarouselArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
    return (
        <svg className='modal-display-carousel-arrow' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
            <path d={direction === 'previous' ? 'M10.5 2.5 5 8l5.5 5.5' : 'M5.5 2.5 11 8l-5.5 5.5'} />
        </svg>
    )
}

function ModalLinks({ links }: { links: readonly ContentLink[] }) {
    return (
        <section className='mt-3 mb-3' aria-label='Other links'>
            <h3 className='h6 mb-1'>Other links:</h3>
            <ul className='list-unstyled mb-0'>
                {links.map((link, index) => (
                    <li key={`${link.type}-${link.type === 'internal' ? link.to : link.href}-${index}`}>
                        {link.type === 'internal' ? (
                            <Link to={link.to} title={link.title}>{link.text}</Link>
                        ) : (
                            <a href={link.href} title={link.title} target='_blank' rel='noopener noreferrer'>{link.text}</a>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

function getCarouselImages(viewport: HTMLElement): HTMLImageElement[] {
    return [...viewport.querySelectorAll<HTMLImageElement>('.modal-display-carousel-image')]
}

function setCssCustomProperty(element: HTMLElement, property: string, value: string) {
    if (element.style.getPropertyValue(property) !== value) {
        element.style.setProperty(property, value)
    }
}

function isEditableElement(target: EventTarget | null): boolean {
    return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
}

function cancelFrame(frameRef: RefObject<number | null>) {
    if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
    }
}
