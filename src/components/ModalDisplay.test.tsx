import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRef, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import ModalDisplay, { ModalImageCarousel } from './ModalDisplay'

describe('ModalDisplay', () => {
    it('loads reusable content, structured links, and structured images', async () => {
        render(
            <MemoryRouter>
                <ModalDisplay
                    open
                    title='Project title'
                    links={[
                        { type: 'external', href: 'https://example.com/story', title: 'Read the project story.', text: 'Project story' },
                        { type: 'internal', to: '/project', title: 'Open the project page.', text: 'Project page' },
                    ]}
                    images={[
                        { src: '/first.jpg', alt: 'First project view.' },
                        { src: '/second.jpg', alt: 'Second project view.' },
                    ]}
                    onClosed={vi.fn()}
                >
                    <p>Project details</p>
                </ModalDisplay>
            </MemoryRouter>,
        )

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        expect(screen.getByText('Project details')).not.toBeNull()
        expect(screen.getByRole('link', { name: 'Project story' })).toMatchObject({
            href: 'https://example.com/story',
            rel: 'noopener noreferrer',
            target: '_blank',
            title: 'Read the project story.',
        })
        expect(screen.getByRole('link', { name: 'Project page' })).toMatchObject({
            pathname: '/project',
            title: 'Open the project page.',
        })
        expect(screen.getByRole('heading', { level: 3, name: 'Other links:' })).not.toBeNull()
        expect(screen.getByRole('link', { name: 'Project story' }).closest('section')).not.toBeNull()
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual(['/first.jpg', '/second.jpg'])
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual(['First project view.', 'Second project view.'])
    })

    it('closes from its button and returns focus to the trigger', async () => {
        const onClosed = vi.fn()

        render(<ModalHarness onClosed={onClosed} restoreFocus />)

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' })))

        fireEvent.click(screen.getByRole('button', { name: 'Close' }))

        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 1500 })
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open modal' })))
    })

    it('does not return focus to the trigger after a pointer close', async () => {
        const onClosed = vi.fn()

        render(<ModalHarness onClosed={onClosed} />)

        const closeButton = await screen.findByRole('button', { name: 'Close' })
        await waitFor(() => expect(document.activeElement).toBe(closeButton))

        fireEvent.click(closeButton, { detail: 1 })

        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 1500 })
        expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Open modal' }))
    })

    it('keeps the dialog container out of the Tab order', async () => {
        const { container } = render(<ModalHarness onClosed={vi.fn()} />)

        expect(await screen.findByRole('button', { name: 'Close' })).not.toBeNull()
        expect(container.querySelector('dialog')?.hasAttribute('tabindex')).toBe(false)
    })

    it('closes from Escape through the native cancel event', async () => {
        const onClosed = vi.fn()
        const { container } = render(<ModalHarness onClosed={onClosed} />)

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        const dialog = container.querySelector('dialog')
        const cancelEvent = new Event('cancel', { cancelable: true })

        expect(dialog).not.toBeNull()
        fireEvent(dialog!, cancelEvent)

        expect(cancelEvent.defaultPrevented).toBe(true)
        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 1500 })
    })

    it('closes when the native dialog backdrop is clicked', async () => {
        const onClosed = vi.fn()
        const { container } = render(<ModalHarness onClosed={onClosed} />)

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        const dialog = container.querySelector('dialog')

        expect(dialog).not.toBeNull()
        fireEvent.click(dialog!)

        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 1500 })
    })

    it('cancels queued opening work when it closes before the next frame', () => {
        let frameId = 0
        const frames = new Map<number, FrameRequestCallback>()
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frameId += 1
            frames.set(frameId, callback)
            return frameId
        })
        const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
            frames.delete(id)
        })
        const { container, rerender } = render(
            <ModalDisplay open title='Project title' onClosed={vi.fn()}>
                <p>Project details</p>
            </ModalDisplay>,
        )
        const openingFrame = requestFrame.mock.results[0].value

        rerender(
            <ModalDisplay open={false} title='Project title' onClosed={vi.fn()}>
                <p>Project details</p>
            </ModalDisplay>,
        )

        expect(cancelFrame).toHaveBeenCalledWith(openingFrame)
        act(() => frames.forEach((callback) => callback(performance.now())))
        expect(container.querySelector('dialog')?.classList.contains('modal-display--visible')).toBe(false)
        expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false)
    })
})

describe('ModalImageCarousel', () => {
    it('uses natural image edges and real bounded arrow stops', async () => {
        const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
        const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1464)
        const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(function scrollTo(this: HTMLElement, options: ScrollToOptions | number, y?: number) {
            void y
            this.scrollLeft = typeof options === 'number' ? options : options.left ?? this.scrollLeft
        })
        const elementRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: HTMLElement) {
            if (this.classList.contains('modal-display-carousel-viewport')) {
                return createRect(0, 600)
            }

            if (this instanceof HTMLImageElement) {
                const index = [...this.parentElement!.children].indexOf(this)
                return createRect(index * 366, 350)
            }

            return createRect(0, 0)
        })

        render(<ModalImageCarousel images={[
            { src: '/one.jpg', alt: 'First view.' },
            { src: '/two.jpg', alt: 'Second view.' },
            { src: '/three.jpg', alt: 'Third view.' },
            { src: '/four.jpg', alt: 'Fourth view.' },
        ]} />)

        const previous = await screen.findByRole('button', { name: 'Scroll images left' })
        const next = screen.getByRole('button', { name: 'Scroll images right' })

        expect(screen.getAllByRole('img')[0].getBoundingClientRect().left).toBe(0)
        expect(screen.getByRole('region', { name: 'Images' }).querySelector<HTMLDivElement>('.modal-display-carousel-viewport')?.style.getPropertyValue('--carousel-edge-space')).toBe('')
        expect(previous.hasAttribute('disabled')).toBe(true)
        expect(next.hasAttribute('disabled')).toBe(false)
        fireEvent.click(next)
        expect(scrollTo).toHaveBeenLastCalledWith({ left: 366, behavior: 'smooth' })
        fireEvent.scroll(screen.getByRole('region', { name: 'Images' }).querySelector<HTMLDivElement>('.modal-display-carousel-viewport')!)
        fireEvent.click(next)
        expect(scrollTo).toHaveBeenLastCalledWith({ left: 732, behavior: 'smooth' })
        fireEvent.scroll(screen.getByRole('region', { name: 'Images' }).querySelector<HTMLDivElement>('.modal-display-carousel-viewport')!)
        fireEvent.click(next)
        expect(scrollTo).toHaveBeenLastCalledWith({ left: 864, behavior: 'smooth' })
        fireEvent.scroll(screen.getByRole('region', { name: 'Images' }).querySelector<HTMLDivElement>('.modal-display-carousel-viewport')!)
        await waitFor(() => expect(next.hasAttribute('disabled')).toBe(true))

        clientWidth.mockRestore()
        scrollWidth.mockRestore()
        scrollTo.mockRestore()
        elementRect.mockRestore()
    })

    it('retargets rapid button and keyboard navigation from the last requested stop', () => {
        const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
        const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1464)
        const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo')
        const elementRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: HTMLElement) {
            if (this.classList.contains('modal-display-carousel-viewport')) {
                return createRect(0, 600)
            }

            if (this instanceof HTMLImageElement) {
                return createRect([...this.parentElement!.children].indexOf(this) * 366, 350)
            }

            return createRect(0, 0)
        })

        render(<ModalImageCarousel images={[
            { src: '/one.jpg', alt: 'First view.' },
            { src: '/two.jpg', alt: 'Second view.' },
            { src: '/three.jpg', alt: 'Third view.' },
            { src: '/four.jpg', alt: 'Fourth view.' },
        ]} />)

        const next = screen.getByRole('button', { name: 'Scroll images right' })

        fireEvent.click(next)
        fireEvent.click(next)
        fireEvent.keyDown(document, { key: 'ArrowRight' })
        fireEvent.keyDown(document, { key: 'ArrowLeft' })
        fireEvent.keyDown(document, { key: 'ArrowLeft' })

        expect(scrollTo.mock.calls.map(([options]) => options)).toEqual([
            { left: 366, behavior: 'smooth' },
            { left: 732, behavior: 'smooth' },
            { left: 864, behavior: 'smooth' },
            { left: 732, behavior: 'smooth' },
            { left: 366, behavior: 'smooth' },
        ])

        clientWidth.mockRestore()
        scrollWidth.mockRestore()
        scrollTo.mockRestore()
        elementRect.mockRestore()
    })

    it('centers a short row without rendering scroll controls', () => {
        const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(900)
        const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(600)

        const { container } = render(<ModalImageCarousel images={[
            { src: '/one.jpg', alt: 'First view.' },
            { src: '/two.jpg', alt: 'Second view.' },
        ]} />)

        expect(container.querySelector('.modal-display-carousel-track')).not.toBeNull()
        expect(screen.queryByRole('button', { name: 'Scroll images left' })).toBeNull()
        expect(screen.queryByRole('button', { name: 'Scroll images right' })).toBeNull()

        clientWidth.mockRestore()
        scrollWidth.mockRestore()
    })

    it('tracks native scrolling without remeasuring layout or updating unchanged state', () => {
        let frameId = 0
        const frames = new Map<number, FrameRequestCallback>()
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frameId += 1
            frames.set(frameId, callback)
            return frameId
        })
        const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
        const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1464)
        const elementRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: HTMLElement) {
            if (this.classList.contains('modal-display-carousel-viewport')) {
                return createRect(0, 600)
            }

            if (this instanceof HTMLImageElement) {
                const index = [...this.parentElement!.children].indexOf(this)
                return createRect(index * 366, 350)
            }

            return createRect(0, 0)
        })

        const { container } = render(<ModalImageCarousel images={[
            { src: '/one.jpg', alt: 'First view.' },
            { src: '/two.jpg', alt: 'Second view.' },
        ]} />)
        const viewport = container.querySelector<HTMLDivElement>('.modal-display-carousel-viewport')!

        elementRect.mockClear()
        viewport.scrollLeft = 864
        fireEvent.scroll(viewport)
        fireEvent.scroll(viewport)

        expect(requestFrame).toHaveBeenCalledTimes(1)
        act(() => frames.forEach((callback) => callback(performance.now())))
        expect(elementRect).not.toHaveBeenCalled()
        expect(screen.getByRole('button', { name: 'Scroll images left' }).hasAttribute('disabled')).toBe(false)
        expect(screen.getByRole('button', { name: 'Scroll images right' }).hasAttribute('disabled')).toBe(true)

        fireEvent.scroll(viewport)
        act(() => frames.forEach((callback) => callback(performance.now())))
        expect(elementRect).not.toHaveBeenCalled()

        requestFrame.mockRestore()
        clientWidth.mockRestore()
        scrollWidth.mockRestore()
        elementRect.mockRestore()
    })

    it('continues a fast mouse drag with momentum and cancels it for new interactions and unmounting', () => {
        let frameId = 0
        const frames = new Map<number, FrameRequestCallback>()
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frameId += 1
            frames.set(frameId, callback)
            return frameId
        })
        const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
            frames.delete(id)
        })
        const { viewport, unmount, restore } = renderOverflowingCarousel()

        setPointerCapture(viewport)
        firePointerEvent(viewport, 'pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 500, clientY: 20, button: 0, isPrimary: true }, 100)
        firePointerEvent(viewport, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 20, isPrimary: true }, 116)
        expect(viewport.classList.contains('modal-display-carousel-viewport--dragging')).toBe(true)
        expect(viewport.scrollLeft).toBe(200)
        firePointerEvent(viewport, 'pointerup', { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 20, isPrimary: true }, 116)

        expect(viewport.classList.contains('modal-display-carousel-viewport--dragging')).toBe(false)
        expect(frames.size).toBe(1)
        act(() => [...frames.values()][0](132))
        expect(viewport.scrollLeft).toBeGreaterThan(200)

        fireEvent.pointerDown(viewport, { pointerId: 2, pointerType: 'mouse', clientX: 300, clientY: 20, button: 0, isPrimary: true })
        expect(cancelFrame).toHaveBeenCalled()
        fireEvent.wheel(viewport)
        unmount()

        requestFrame.mockRestore()
        cancelFrame.mockRestore()
        restore()
    })

    it('does not continue mouse momentum after a pause before release', () => {
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame')
        const { viewport, restore } = renderOverflowingCarousel()

        setPointerCapture(viewport)
        firePointerEvent(viewport, 'pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 500, clientY: 20, button: 0, isPrimary: true }, 100)
        firePointerEvent(viewport, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 20, isPrimary: true }, 116)
        firePointerEvent(viewport, 'pointerup', { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 20, isPrimary: true }, 316)

        expect(requestFrame).not.toHaveBeenCalled()

        requestFrame.mockRestore()
        restore()
    })

    it('leaves touch gestures native while cancelling a programmatic arrow scroll', () => {
        const { viewport, scrollTo, restore } = renderOverflowingCarousel()

        fireEvent.pointerDown(viewport, { pointerId: 1, pointerType: 'touch', clientX: 1000, clientY: 10, isPrimary: true })
        fireEvent.pointerMove(viewport, { pointerId: 1, pointerType: 'touch', clientX: 1, clientY: 10, isPrimary: true })
        fireEvent.pointerUp(viewport, { pointerId: 1, pointerType: 'touch', clientX: 1, clientY: 10, isPrimary: true })

        expect(viewport.setPointerCapture).toBeUndefined()
        expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' })
        restore()
    })

    it('does not activate disabled directions from the keyboard', () => {
        vi.useFakeTimers()
        const { viewport, scrollTo, restore } = renderOverflowingCarousel()
        const next = screen.getByRole('button', { name: 'Scroll images right' })
        const previous = screen.getByRole('button', { name: 'Scroll images left' })

        fireEvent.keyDown(document, { key: 'ArrowLeft' })
        expect(scrollTo).not.toHaveBeenCalled()
        expect(previous.classList.contains('modal-display-carousel-control--pressed')).toBe(false)

        viewport.scrollLeft = 864
        fireEvent.keyDown(document, { key: 'ArrowRight' })
        expect(scrollTo).not.toHaveBeenCalled()
        expect(next.classList.contains('modal-display-carousel-control--pressed')).toBe(false)

        restore()
        vi.useRealTimers()
    })

    it('uses one navigation activation per physical press while preserving keyboard focus', () => {
        vi.useFakeTimers()
        const { scrollTo, restore } = renderOverflowingCarousel()
        const next = screen.getByRole('button', { name: 'Scroll images right' })
        const previous = screen.getByRole('button', { name: 'Scroll images left' })

        fireEvent.keyDown(document, { key: 'ArrowRight' })
        expect(next.classList.contains('modal-display-carousel-control--pressed')).toBe(true)
        act(() => vi.advanceTimersByTime(160))

        next.focus()
        fireEvent.pointerDown(next, { pointerId: 1, pointerType: 'mouse', button: 0, isPrimary: true })
        fireEvent.click(next, { detail: 1 })
        fireEvent.pointerDown(next, { pointerId: 1, pointerType: 'mouse', button: 0, isPrimary: true })
        fireEvent.click(next, { detail: 2 })
        expect(document.activeElement).not.toBe(next)
        expect(scrollTo.mock.calls.map(([options]) => options)).toEqual([
            { left: 366, behavior: 'smooth' },
            { left: 732, behavior: 'smooth' },
            { left: 864, behavior: 'smooth' },
        ])

        previous.focus()
        fireEvent.click(previous, { detail: 0 })
        expect(document.activeElement).toBe(previous)

        fireEvent.pointerDown(previous, { pointerId: 2, pointerType: 'touch', button: 0, isPrimary: true })
        expect(scrollTo).toHaveBeenCalledTimes(4)
        fireEvent.click(previous, { detail: 1 })
        expect(scrollTo).toHaveBeenLastCalledWith({ left: 366, behavior: 'smooth' })

        restore()
        vi.useRealTimers()
    })

    it('keeps pressed feedback through an activation that reaches the real end', () => {
        vi.useFakeTimers()
        let frame: FrameRequestCallback | null = null
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frame = callback
            return 1
        })
        const { viewport, restore } = renderOverflowingCarousel()
        const next = screen.getByRole('button', { name: 'Scroll images right' })

        viewport.scrollLeft = 732
        fireEvent.scroll(viewport)
        act(() => frame!(performance.now()))
        fireEvent.click(next)
        fireEvent.scroll(viewport)
        act(() => frame!(performance.now()))

        expect(next.hasAttribute('disabled')).toBe(true)
        expect(next.classList.contains('modal-display-carousel-control--pressed')).toBe(true)
        act(() => vi.advanceTimersByTime(160))
        expect(next.classList.contains('modal-display-carousel-control--pressed')).toBe(false)

        requestFrame.mockRestore()
        restore()
        vi.useRealTimers()
    })

    it('cleans up pointer dragging after release, cancellation, and lost capture', () => {
        const requestFrame = vi.spyOn(window, 'requestAnimationFrame')
        const { viewport, restore } = renderOverflowingCarousel()
        const events: Array<'pointerUp' | 'pointerCancel' | 'lostPointerCapture'> = ['pointerUp', 'pointerCancel', 'lostPointerCapture']

        for (const [index, type] of events.entries()) {
            const pointerId = index + 1

            const releasePointerCapture = setPointerCapture(viewport)
            fireEvent.pointerDown(viewport, { pointerId, pointerType: 'mouse', clientX: 200, clientY: 10, button: 0, isPrimary: true })
            fireEvent.pointerMove(viewport, { pointerId, pointerType: 'mouse', clientX: 100, clientY: 10, isPrimary: true })
            fireEvent[ type ](viewport, { pointerId, pointerType: 'mouse', clientX: 100, clientY: 10, isPrimary: true })

            expect(viewport.classList.contains('modal-display-carousel-viewport--dragging')).toBe(false)
            expect(releasePointerCapture).toHaveBeenCalledOnce()

            if (type !== 'pointerUp') {
                expect(requestFrame).not.toHaveBeenCalled()
            }

            requestFrame.mockClear()
        }

        requestFrame.mockRestore()
        restore()
    })
})

function renderOverflowingCarousel() {
    const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
    const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1464)
    const elementRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: HTMLElement) {
        if (this.classList.contains('modal-display-carousel-viewport')) {
            return createRect(0, 600)
        }

        if (this instanceof HTMLImageElement) {
            return createRect([...this.parentElement!.children].indexOf(this) * 366, 350)
        }

        return createRect(0, 0)
    })
    const scrollTo = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(function scrollTo(this: HTMLElement, options: ScrollToOptions | number, y?: number) {
        void y
        this.scrollLeft = typeof options === 'number' ? options : options.left ?? this.scrollLeft
    })
    const { container, unmount } = render(<ModalImageCarousel images={[
        { src: '/one.jpg', alt: 'First view.' },
        { src: '/two.jpg', alt: 'Second view.' },
        { src: '/three.jpg', alt: 'Third view.' },
    ]} />)
    const viewport = container.querySelector<HTMLDivElement>('.modal-display-carousel-viewport')!
    return {
        viewport,
        scrollTo,
        unmount,
        restore: () => {
            clientWidth.mockRestore()
            scrollWidth.mockRestore()
            elementRect.mockRestore()
            scrollTo.mockRestore()
        },
    }
}

function firePointerEvent(viewport: HTMLDivElement, type: string, init: PointerEventInit, timeStamp: number) {
    const event = new Event(type, { bubbles: true, cancelable: true })

    Object.assign(event, init)
    Object.defineProperty(event, 'timeStamp', { value: timeStamp })
    fireEvent(viewport, event)
}

function setPointerCapture(viewport: HTMLDivElement) {
    let captured = true
    const releasePointerCapture = vi.fn(() => { captured = false })

    viewport.setPointerCapture = vi.fn()
    viewport.hasPointerCapture = vi.fn(() => captured)
    viewport.releasePointerCapture = releasePointerCapture

    return releasePointerCapture
}

function ModalHarness({ onClosed, restoreFocus = false }: { onClosed: () => void; restoreFocus?: boolean }) {
    const [open, setOpen] = useState(true)
    const triggerRef = useRef<HTMLButtonElement>(null)

    return (
        <>
            <button ref={triggerRef} type='button' onClick={() => setOpen(true)}>Open modal</button>
            <ModalDisplay open={open} title='Project title' onClosed={() => { setOpen(false); onClosed() }} returnFocusRef={triggerRef} restoreFocus={restoreFocus}>
                <p>Project details</p>
            </ModalDisplay>
        </>
    )
}

function createRect(left: number, width: number): DOMRect {
    return {
        bottom: 250,
        height: 250,
        left,
        right: left + width,
        top: 0,
        width,
        x: left,
        y: 0,
        toJSON: () => ({}),
    }
}
