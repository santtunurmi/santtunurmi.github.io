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
    const targetIndexRef = useRef<number | null>(null)
    const imagePositionsRef = useRef<number[]>([])
    const hasOverflowRef = useRef(false)
    const scrollFrameRef = useRef<number | null>(null)
    const settleTimeoutRef = useRef<number | null>(null)
    const dragRef = useRef<{ pointerId: number; startX: number; startY: number; startIndex: number; startScrollLeft: number; horizontal: boolean } | null>(null)
    const reducedMotion = useReducedMotion()
    const [scrollState, setScrollState] = useState({ hasOverflow: false, activeIndex: 0 })
    const scrollStateRef = useRef(scrollState)
    const [dragging, setDragging] = useState(false)

    const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth') => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const carouselImages = getCarouselImages(viewport)
        const targetIndex = Math.max(0, Math.min(carouselImages.length - 1, index))
        const target = carouselImages[targetIndex]

        if (!target) {
            return
        }

        const left = imagePositionsRef.current[targetIndex] ?? viewport.scrollLeft + target.getBoundingClientRect().left - viewport.getBoundingClientRect().left

        if (Math.abs(left - viewport.scrollLeft) <= 1) {
            targetIndexRef.current = null
            if (scrollStateRef.current.activeIndex !== targetIndex) {
                scrollStateRef.current = { ...scrollStateRef.current, activeIndex: targetIndex }
                setScrollState(scrollStateRef.current)
            }
            return
        }

        targetIndexRef.current = targetIndex
        if (scrollStateRef.current.activeIndex !== targetIndex) {
            scrollStateRef.current = { ...scrollStateRef.current, activeIndex: targetIndex }
            setScrollState(scrollStateRef.current)
        }
        viewport.scrollTo({
            left,
            behavior,
        })
    }, [reducedMotion])

    const scroll = useCallback((direction: -1 | 1) => {
        const currentIndex = targetIndexRef.current ?? getClosestPositionIndex(viewportRef.current?.scrollLeft ?? 0, imagePositionsRef.current)

        scrollToIndex(currentIndex + direction)
    }, [scrollToIndex])

    function cancelProgrammaticScroll(viewport: HTMLElement) {
        targetIndexRef.current = null
        viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'auto' })
    }

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const viewportElement = viewport

        function updateScrollState(hasOverflow: boolean, activeIndex: number) {
            if (scrollStateRef.current.hasOverflow !== hasOverflow || scrollStateRef.current.activeIndex !== activeIndex) {
                scrollStateRef.current = { hasOverflow, activeIndex }
                setScrollState(scrollStateRef.current)
            }
        }

        function updateScrollPosition() {
            scrollFrameRef.current = null

            const positions = imagePositionsRef.current

            if (positions.length === 0) {
                return
            }

            const leftAlignedIndex = getClosestPositionIndex(viewportElement.scrollLeft, positions)
            const targetIndex = targetIndexRef.current

            if (targetIndex !== null && Math.abs(positions[targetIndex] - viewportElement.scrollLeft) <= 1) {
                targetIndexRef.current = null
            }

            updateScrollState(hasOverflowRef.current, targetIndexRef.current ?? leftAlignedIndex)
        }

        function measureLayout() {
            setCssCustomProperty(viewportElement, '--carousel-image-max-width', `${viewportElement.clientWidth}px`)

            const carouselImages = getCarouselImages(viewportElement)
            const track = viewportElement.firstElementChild
            const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap) || 0 : 0
            const viewportRect = viewportElement.getBoundingClientRect()
            const imageRects = carouselImages.map((image) => image.getBoundingClientRect())
            const contentWidth = imageRects.reduce((width, imageRect) => width + imageRect.width, 0) + Math.max(0, carouselImages.length - 1) * gap
            const hasOverflow = contentWidth > viewportElement.clientWidth + 1
            const edgeSpace = hasOverflow && imageRects[0]
                ? Math.max(0, viewportElement.clientWidth - imageRects[0].width)
                : 0

            setCssCustomProperty(viewportElement, '--carousel-edge-space', `${edgeSpace}px`)
            imagePositionsRef.current = imageRects.map((imageRect) => viewportElement.scrollLeft + imageRect.left - viewportRect.left)
            hasOverflowRef.current = hasOverflow

            const leftAlignedIndex = getClosestPositionIndex(viewportElement.scrollLeft, imagePositionsRef.current)
            const targetIndex = targetIndexRef.current

            if (targetIndex !== null) {
                if (Math.abs(imagePositionsRef.current[targetIndex] - viewportElement.scrollLeft) <= 1) {
                    targetIndexRef.current = null
                }
            }

            updateScrollState(hasOverflow, targetIndexRef.current ?? leftAlignedIndex)
        }

        function scheduleScrollPositionUpdate() {
            if (scrollFrameRef.current === null) {
                scrollFrameRef.current = requestAnimationFrame(updateScrollPosition)
            }

            if (settleTimeoutRef.current !== null) {
                window.clearTimeout(settleTimeoutRef.current)
            }

            settleTimeoutRef.current = window.setTimeout(() => {
                settleTimeoutRef.current = null

                if (dragRef.current === null && targetIndexRef.current === null) {
                    scrollToIndex(getClosestPositionIndex(viewportElement.scrollLeft, imagePositionsRef.current))
                }
            }, 120)
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
            const drag = dragRef.current

            if (drag && viewportElement.hasPointerCapture(drag.pointerId)) {
                viewportElement.releasePointerCapture(drag.pointerId)
            }

            dragRef.current = null
            if (settleTimeoutRef.current !== null) {
                window.clearTimeout(settleTimeoutRef.current)
            }
        }
    }, [images, scrollToIndex])

    useEffect(() => {
        function scrollFromArrowKey(event: KeyboardEvent) {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditableElement(event.target)) {
                return
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()
                scroll(event.key === 'ArrowLeft' ? -1 : 1)
            }
        }

        document.addEventListener('keydown', scrollFromArrowKey)

        return () => document.removeEventListener('keydown', scrollFromArrowKey)
    }, [scroll])

    function finishDrag(pointerId: number, returnToStart: boolean) {
        const drag = dragRef.current

        if (!drag || drag.pointerId !== pointerId) {
            return
        }

        dragRef.current = null
        setDragging(false)

        if (viewportRef.current?.hasPointerCapture(pointerId)) {
            viewportRef.current.releasePointerCapture(pointerId)
        }

        if (returnToStart && drag.horizontal) {
            scrollToIndex(drag.startIndex)
        }
    }

    function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) {
            return
        }

        const viewport = event.currentTarget
        cancelProgrammaticScroll(viewport)
        const startIndex = getClosestPositionIndex(viewport.scrollLeft, imagePositionsRef.current)

        viewport.setPointerCapture(event.pointerId)
        dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, startIndex, startScrollLeft: viewport.scrollLeft, horizontal: false }
    }

    function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
        const drag = dragRef.current

        if (!drag || drag.pointerId !== event.pointerId) {
            return
        }

        const horizontalDistance = event.clientX - drag.startX
        const verticalDistance = event.clientY - drag.startY

        if (!drag.horizontal) {
            if (Math.abs(verticalDistance) > 8 && Math.abs(verticalDistance) > Math.abs(horizontalDistance)) {
                finishDrag(event.pointerId, false)
                return
            }

            if (Math.abs(horizontalDistance) <= 8 || Math.abs(horizontalDistance) < Math.abs(verticalDistance)) {
                return
            }

            drag.horizontal = true
            targetIndexRef.current = null
            setDragging(true)
        }

        event.preventDefault()
        event.currentTarget.scrollLeft = drag.startScrollLeft - horizontalDistance
    }

    function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
        const drag = dragRef.current

        if (!drag || drag.pointerId !== event.pointerId) {
            return
        }

        const horizontalDistance = event.clientX - drag.startX
        const targetIndex = drag.horizontal && Math.abs(horizontalDistance) >= 48
            ? drag.startIndex + (horizontalDistance < 0 ? 1 : -1)
            : drag.startIndex

        finishDrag(event.pointerId, false)
        scrollToIndex(targetIndex)
    }

    function cancelDrag(event: ReactPointerEvent<HTMLDivElement>) {
        finishDrag(event.pointerId, true)
    }

    return (
        <div className='modal-display-carousel' role='region' aria-label='Images'>
            <div className={`modal-display-carousel-viewport${dragging ? ' modal-display-carousel-viewport--dragging' : ''}`} ref={viewportRef} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onWheel={(event) => cancelProgrammaticScroll(event.currentTarget)}>
                <div className='modal-display-carousel-track'>
                    {images.map((image, index) => (
                        <img className='modal-display-carousel-image' src={image.src} alt={image.alt} loading='lazy' draggable={false} onDragStart={(event) => event.preventDefault()} key={`${image.src}-${index}`} />
                    ))}
                </div>
            </div>
            {scrollState.hasOverflow && (
                <>
                    <button className='modal-display-carousel-control modal-display-carousel-control--previous site-control' type='button' onClick={() => scroll(-1)} disabled={scrollState.activeIndex === 0} aria-label='Scroll images left'><CarouselArrowIcon direction='previous' /></button>
                    <button className='modal-display-carousel-control modal-display-carousel-control--next site-control' type='button' onClick={() => scroll(1)} disabled={scrollState.activeIndex === images.length - 1} aria-label='Scroll images right'><CarouselArrowIcon direction='next' /></button>
                </>
            )}
        </div>
    )
}

function CaseStudyLink({ link }: { link: Extract<ContentLink, { type: 'internal' }> }) {
    return (
        <section className='mt-3 mb-3' aria-label='Case study'>
            <h3 className='h6 mb-1'>Case study</h3>
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
    )
}

function getCarouselImages(viewport: HTMLElement): HTMLImageElement[] {
    return [...viewport.querySelectorAll<HTMLImageElement>('.modal-display-carousel-image')]
}

function getClosestPositionIndex(position: number, positions: readonly number[]): number {
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    positions.forEach((imagePosition, index) => {
        const distance = Math.abs(imagePosition - position)

        if (distance < closestDistance) {
            closestIndex = index
            closestDistance = distance
        }
    })

    return closestIndex
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
