import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import EducationAndWorkPage from './pages/EducationAndWorkPage'

function LocationProbe() {
    const location = useLocation()

    return <output data-testid='location'>{location.pathname}</output>
}

function renderAppAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <App />
            <LocationProbe />
        </MemoryRouter>,
    )
}

describe('route compatibility', () => {
    it.each([
        ['/index.html', '/'],
        ['/education-and-work.html', '/education-and-work'],
        ['/bio', '/education-and-work'],
        ['/bio.html', '/education-and-work'],
        ['/ai', '/blog/ai-assisted-workflows'],
        ['/ai.html', '/blog/ai-assisted-workflows'],
        ['/blog.html', '/blog'],
        ['/hobbies', '/blog/hobbies'],
        ['/hobbies.html', '/blog/hobbies'],
        ['/webserver.html', '/webserver'],
    ])('redirects %s to %s', async (legacyPath, canonicalPath) => {
        renderAppAt(legacyPath)

        await waitFor(() => expect(screen.getByTestId('location').textContent).toBe(canonicalPath))
    })
})

describe('Education and Work page', () => {
    it('keeps the Info heading with its first prose block and associates the section', () => {
        render(
            <MemoryRouter>
                <EducationAndWorkPage />
            </MemoryRouter>,
        )

        const infoHeading = screen.getByRole('heading', { level: 2, name: 'Info' })
        const infoBlock = infoHeading.parentElement
        const infoSection = infoBlock?.parentElement

        expect(infoHeading.className).toContain('h3')
        expect(infoBlock?.querySelector('p')).not.toBeNull()
        expect(infoSection?.getAttribute('aria-labelledby')).toBe('info-heading')
        expect(infoSection?.classList.contains('education-and-work-info--immediate')).toBe(true)
    })

    it('links the Hobbies callout to the Hobbies page', () => {
        render(
            <MemoryRouter>
                <EducationAndWorkPage />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'my hobbies page' }).getAttribute('href')).toBe('/blog/hobbies')
    })

    it('publishes its clean canonical URL', () => {
        render(
            <MemoryRouter>
                <EducationAndWorkPage />
            </MemoryRouter>,
        )

        expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe('https://santtunurmi.netlify.app/education-and-work')
    })
})

describe('article and listing layouts', () => {
    it('keeps the outgoing page at its current scroll position until its exit finishes', async () => {
        const { container } = renderAppAt('/blog')

        expect(await screen.findByRole('heading', { level: 1, name: 'Blog' })).not.toBeNull()
        const caseStudyCard = [...container.querySelectorAll('.portfolio-card')]
            .find((card) => card.querySelector('.card-title')?.textContent === 'Software Development Internship at EXEN esports Oy')

        expect(caseStudyCard).not.toBeUndefined()
        vi.mocked(window.scrollTo).mockClear()
        fireEvent.click(within(caseStudyCard as HTMLElement).getByRole('link', { name: 'Read case study' }))

        expect(window.scrollTo).not.toHaveBeenCalled()
        await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/blog/exen-internship'))
        await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' }), { timeout: 1500 })
    })

    it('places article navigation and context between the opening card and headline', async () => {
        const { container } = renderAppAt('/blog/ai-assisted-workflows')

        const openingCard = container.querySelector('.opening-card')
        const navigation = container.querySelector('.site-navigation')
        const articleContext = container.querySelector('.article-context')
        const heading = await screen.findByRole('heading', { level: 1, name: 'AI-Assisted Workflows' })

        expect(openingCard).not.toBeNull()
        expect(navigation).not.toBeNull()
        expect(articleContext).not.toBeNull()
        expect(openingCard!.compareDocumentPosition(navigation!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(navigation!.compareDocumentPosition(articleContext!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(articleContext!.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(screen.getByText('Article').classList.contains('article-type-label')).toBe(true)
    })

    it('uses the home-page card columns for the blog listing', async () => {
        const { container } = renderAppAt('/blog')

        expect(await screen.findByRole('heading', { level: 1, name: 'Blog' })).not.toBeNull()

        const cardColumns = [...container.querySelectorAll('.portfolio-card')].map((card) => card.parentElement)
        const titles = [...container.querySelectorAll('.card-title')].map((title) => title.textContent)

        expect(cardColumns).toHaveLength(4)
        expect(cardColumns.every((column) => column?.classList.contains('col-sm-6'))).toBe(true)
        expect(cardColumns.some((column) => column?.classList.contains('col-md-4'))).toBe(false)
        expect(titles).toEqual([
            'AI-Assisted Workflows',
            'Software Development Internship at EXEN esports Oy',
            'Esports Event Production',
            'Hobbies',
        ])
    })

    it('presents Hobbies as a Blog article', async () => {
        const { container } = renderAppAt('/blog/hobbies')

        expect(await screen.findByRole('heading', { level: 1, name: 'Hobbies' })).not.toBeNull()
        expect(screen.getByText('Article').classList.contains('article-type-label')).toBe(true)
        expect(screen.getByRole('link', { name: 'Return to blog' }).getAttribute('href')).toBe('/blog')
        expect(container.querySelector('.opening-card--hobbies')).not.toBeNull()
    })

    it('orders AI-Assisted Workflows before Hobbies in Latest writing', async () => {
        renderAppAt('/')

        const latestWriting = (await screen.findByRole('heading', { level: 2, name: 'Latest writing' })).closest('section')
        const titles = [...latestWriting!.querySelectorAll('.card-title')].map((title) => title.textContent)

        expect(titles).toEqual(['AI-Assisted Workflows', 'Hobbies'])
    })
})
