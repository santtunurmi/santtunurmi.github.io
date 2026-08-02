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
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual(['/first.jpg', '/second.jpg'])
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual(['First project view.', 'Second project view.'])
    })

    it('closes from its button and returns focus to the trigger', async () => {
        const onClosed = vi.fn()

        render(<ModalHarness onClosed={onClosed} />)

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' })))

        fireEvent.click(screen.getByRole('button', { name: 'Close' }))

        await waitFor(() => expect(onClosed).toHaveBeenCalledOnce(), { timeout: 1500 })
        await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open modal' })))
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
    it('shows manual controls only when the image row overflows', async () => {
        const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
        const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1000)
        const scrollBy = vi.spyOn(HTMLElement.prototype, 'scrollBy')

        render(<ModalImageCarousel images={[
            { src: '/one.jpg', alt: 'First view.' },
            { src: '/two.jpg', alt: 'Second view.' },
            { src: '/three.jpg', alt: 'Third view.' },
            { src: '/four.jpg', alt: 'Fourth view.' },
        ]} />)

        const previous = await screen.findByRole('button', { name: 'Scroll images left' })
        const next = screen.getByRole('button', { name: 'Scroll images right' })

        expect(previous.hasAttribute('disabled')).toBe(true)
        expect(next.hasAttribute('disabled')).toBe(false)
        fireEvent.click(next)
        expect(scrollBy).toHaveBeenCalledWith({ left: 480, behavior: 'smooth' })

        clientWidth.mockRestore()
        scrollWidth.mockRestore()
        scrollBy.mockRestore()
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
})

function ModalHarness({ onClosed }: { onClosed: () => void }) {
    const [open, setOpen] = useState(true)
    const triggerRef = useRef<HTMLButtonElement>(null)

    return (
        <>
            <button ref={triggerRef} type='button' onClick={() => setOpen(true)}>Open modal</button>
            <ModalDisplay open={open} title='Project title' onClosed={() => { setOpen(false); onClosed() }} returnFocusRef={triggerRef}>
                <p>Project details</p>
            </ModalDisplay>
        </>
    )
}
