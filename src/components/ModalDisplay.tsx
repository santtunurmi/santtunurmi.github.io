import { Link } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from 'react'
import type { ContentImage, ContentLink } from '../models/content'
import { useDialogTransition } from './motion'

export type ModalDisplayProps = {
    open: boolean
    title: string
    children: ReactNode
    links?: readonly ContentLink[]
    images?: readonly ContentImage[]
    onClosing?: () => void
    onClosed: () => void
    returnFocusRef?: RefObject<HTMLElement | null>
    restoreFocus?: boolean
}

export default function ModalDisplay({ open, title, children, links, images, onClosing, onClosed, returnFocusRef, restoreFocus = false }: ModalDisplayProps) {
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
    const reducedMotion = useReducedMotion()
    const [scrollState, setScrollState] = useState({ hasOverflow: false, activeIndex: 0 })

    const scroll = useCallback((direction: -1 | 1) => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const carouselImages = getCarouselImages(viewport)
        const currentIndex = targetIndexRef.current ?? getLeftAlignedImageIndex(viewport, carouselImages)
        const targetIndex = Math.max(0, Math.min(carouselImages.length - 1, currentIndex + direction))
        const target = carouselImages[targetIndex]

        if (!target || targetIndex === currentIndex) {
            return
        }

        const viewportRect = viewport.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const left = viewport.scrollLeft + targetRect.left - viewportRect.left

        targetIndexRef.current = targetIndex
        setScrollState((current) => ({ ...current, activeIndex: targetIndex }))
        viewport.scrollTo({
            left,
            behavior: reducedMotion ? 'auto' : 'smooth',
        })
    }, [reducedMotion])

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const viewportElement = viewport

        function updateScrollState() {
            viewportElement.style.setProperty('--carousel-image-max-width', `${viewportElement.clientWidth}px`)

            const carouselImages = getCarouselImages(viewportElement)
            const track = viewportElement.firstElementChild
            const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap) || 0 : 0
            const contentWidth = carouselImages.reduce((width, image) => width + image.getBoundingClientRect().width, 0) + Math.max(0, carouselImages.length - 1) * gap
            const hasOverflow = contentWidth > viewportElement.clientWidth + 1
            const edgeSpace = hasOverflow && carouselImages[0]
                ? Math.max(0, viewportElement.clientWidth - carouselImages[0].getBoundingClientRect().width)
                : 0

            viewportElement.style.setProperty('--carousel-edge-space', `${edgeSpace}px`)

            const leftAlignedIndex = getLeftAlignedImageIndex(viewportElement, carouselImages)
            const targetIndex = targetIndexRef.current

            if (targetIndex !== null) {
                const target = carouselImages[targetIndex]
                const viewportLeft = viewportElement.getBoundingClientRect().left
                const targetLeft = target ? target.getBoundingClientRect().left : viewportLeft

                if (Math.abs(targetLeft - viewportLeft) <= 1) {
                    targetIndexRef.current = null
                }
            }

            setScrollState({
                hasOverflow,
                activeIndex: targetIndexRef.current ?? leftAlignedIndex,
            })
        }

        updateScrollState()
        viewport.addEventListener('scroll', updateScrollState)

        const resizeObserver = new ResizeObserver(updateScrollState)
        resizeObserver.observe(viewport)
        const track = viewport.firstElementChild

        if (track) {
            resizeObserver.observe(track)
        }

        getCarouselImages(viewport).forEach((image) => resizeObserver.observe(image))

        return () => {
            viewport.removeEventListener('scroll', updateScrollState)
            resizeObserver.disconnect()
        }
    }, [images])

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

    return (
        <div className='modal-display-carousel' role='region' aria-label='Images'>
            <div className='modal-display-carousel-viewport' ref={viewportRef}>
                <div className='modal-display-carousel-track'>
                    {images.map((image, index) => (
                        <img className='modal-display-carousel-image' src={image.src} alt={image.alt} loading='lazy' key={`${image.src}-${index}`} />
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

function getLeftAlignedImageIndex(viewport: HTMLElement, images: readonly HTMLImageElement[]): number {
    const viewportLeft = viewport.getBoundingClientRect().left
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    images.forEach((image, index) => {
        const imageRect = image.getBoundingClientRect()
        const distance = Math.abs(imageRect.left - viewportLeft)

        if (distance < closestDistance) {
            closestIndex = index
            closestDistance = distance
        }
    })

    return closestIndex
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
