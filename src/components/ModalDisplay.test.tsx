import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import ModalDisplay, { ModalImageCarousel } from './ModalDisplay'

describe('ModalDisplay', () => {
    it('loads reusable content, an external link, and structured images', async () => {
        render(
            <ModalDisplay
                open
                title='Project title'
                link={{ pathType: 'href', path: 'https://example.com/story', title: 'Read the project story.', text: 'Project story' }}
                images={[
                    { src: '/first.jpg', alt: 'First project view.' },
                    { src: '/second.jpg', alt: 'Second project view.' },
                ]}
                onClosed={vi.fn()}
            >
                <p>Project details</p>
            </ModalDisplay>,
        )

        expect(await screen.findByRole('heading', { level: 2, name: 'Project title' })).not.toBeNull()
        expect(screen.getByText('Project details')).not.toBeNull()
        expect(screen.getByRole('link', { name: 'Project story' })).toMatchObject({
            href: 'https://example.com/story',
            rel: 'noopener noreferrer',
            target: '_blank',
            title: 'Read the project story.',
        })
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual(['/first.jpg', '/second.jpg'])
        expect(screen.getAllByRole('img').map((image) => image.getAttribute('alt'))).toEqual(['First project view.', 'Second project view.'])
    })

    it('renders an internal link using its to path', async () => {
        render(
            <MemoryRouter>
                <ModalDisplay open title='Project title' link={{ pathType: 'to', path: '/project', title: 'Open the project page.', text: 'Project page' }} onClosed={vi.fn()}>
                    <p>Project details</p>
                </ModalDisplay>
            </MemoryRouter>,
        )

        expect(await screen.findByRole('link', { name: 'Project page' })).toMatchObject({
            pathname: '/project',
            title: 'Open the project page.',
        })
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
