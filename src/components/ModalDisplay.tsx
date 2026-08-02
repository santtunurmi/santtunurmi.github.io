import { Link } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject } from 'react'
import type { ContentImage, ContentLink } from '../models/content'
import { useDialogTransition } from './motion'

export type ModalDisplayProps = {
    open: boolean
    title: string
    children: ReactNode
    links?: readonly ContentLink[]
    images?: readonly ContentImage[]
    onClosed: () => void
    returnFocusRef?: RefObject<HTMLElement | null>
}

export default function ModalDisplay({ open, title, children, links, images, onClosed, returnFocusRef }: ModalDisplayProps) {
    const titleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const openFrameRef = useRef<number | null>(null)
    const closeButtonFocusFrameRef = useRef<number | null>(null)
    const returnFocusFrameRef = useRef<number | null>(null)
    const [visible, setVisible] = useState(false)
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
                setVisible(true)
                closeButtonFocusFrameRef.current = requestAnimationFrame(() => closeButtonRef.current?.focus())
            })
        } else if (dialog.open) {
            if (dialog.querySelector('.modal-display-content')) {
                setVisible(false)
            } else {
                dialog.close()
            }
        }

        return () => {
            cancelFrame(openFrameRef)
            cancelFrame(closeButtonFocusFrameRef)
        }
    }, [open])

    useEffect(() => () => cancelFrame(returnFocusFrameRef), [])

    function requestClose() {
        setVisible(false)
    }

    function finishClose() {
        if (!visible) {
            dialogRef.current?.close()
        }
    }

    function finishNativeClose() {
        setVisible(false)
        onClosed()
        returnFocusFrameRef.current = requestAnimationFrame(() => returnFocusRef?.current?.focus())
    }

    function closeFromBackdrop(event: ReactMouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            requestClose()
        }
    }

    return (
        <dialog className={`modal-display${visible ? ' modal-display--visible' : ''}`} ref={dialogRef} onClick={closeFromBackdrop} onCancel={(event) => { event.preventDefault(); requestClose() }} onClose={finishNativeClose} aria-labelledby={titleId}>
            <AnimatePresence onExitComplete={finishClose}>
                {open && visible && (
                    <motion.div className='modal-display-content' {...dialogTransition}>
                        <button className='modal-display-close' ref={closeButtonRef} type='button' onClick={requestClose} aria-label='Close'>Close</button>
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
    const reducedMotion = useReducedMotion()
    const [scrollState, setScrollState] = useState({ hasOverflow: false, atStart: true, atEnd: true })

    useLayoutEffect(() => {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        const viewportElement = viewport

        function updateScrollState() {
            const hasOverflow = viewportElement.scrollWidth > viewportElement.clientWidth + 1

            setScrollState({
                hasOverflow,
                atStart: viewportElement.scrollLeft <= 1,
                atEnd: !hasOverflow || viewportElement.scrollLeft + viewportElement.clientWidth >= viewportElement.scrollWidth - 1,
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

        return () => {
            viewport.removeEventListener('scroll', updateScrollState)
            resizeObserver.disconnect()
        }
    }, [images])

    function scroll(direction: -1 | 1) {
        const viewport = viewportRef.current

        if (!viewport) {
            return
        }

        viewport.scrollBy({
            left: direction * Math.max(300, viewport.clientWidth * 0.8),
            behavior: reducedMotion ? 'auto' : 'smooth',
        })
    }

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
                    <button className='modal-display-carousel-control modal-display-carousel-control--previous' type='button' onClick={() => scroll(-1)} disabled={scrollState.atStart} aria-label='Scroll images left'>&lsaquo;</button>
                    <button className='modal-display-carousel-control modal-display-carousel-control--next' type='button' onClick={() => scroll(1)} disabled={scrollState.atEnd} aria-label='Scroll images right'>&rsaquo;</button>
                </>
            )}
        </div>
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

function cancelFrame(frameRef: RefObject<number | null>) {
    if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
    }
}
