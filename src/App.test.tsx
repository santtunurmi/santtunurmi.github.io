import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'
import { createTimelineScale, educationAndWorkTimeline } from './components/EducationAndWorkTimeline'
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
        ['/ai.html', '/ai'],
        ['/hobbies.html', '/hobbies'],
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
    })

    it('links the Hobbies callout to the Hobbies page', () => {
        render(
            <MemoryRouter>
                <EducationAndWorkPage />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'Link to my page about hobbies' }).getAttribute('href')).toBe('/hobbies')
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

describe('timeline data', () => {
    it('has unique entry identifiers and a deterministic month scale', () => {
        const entryIds = educationAndWorkTimeline.map((entry) => entry.id)
        const scale = createTimelineScale(new Date(2026, 7, 1))

        expect(new Set(entryIds).size).toBe(entryIds.length)
        expect(scale).toEqual({
            baseline: { year: 2018, month: 1 },
            current: { year: 2026, month: 8 },
            months: 104,
        })
    })

    it('supplies structured project images and links to the corresponding work entries', () => {
        expect(educationAndWorkTimeline.find((entry) => entry.id === 'exen-intern-2026')?.images?.map((image) => image.src)).toEqual(['/content/Exen1.jpeg'])
        expect(educationAndWorkTimeline.find((entry) => entry.id === 'nuke-liiga-production-manager-2025')?.images?.map((image) => image.src)).toEqual([
            '/content/Working-wide.png',
            '/content/Nukeliiga1.jpeg',
            '/content/Nukeliiga2.jpeg',
            '/content/Nukeliiga3.jpg',
            '/content/Nukeliiga4.png',
            '/content/Nukeliiga5.png',
        ])
        expect(educationAndWorkTimeline.find((entry) => entry.id === 'aanekoski-youth-counsellor-2019')?.link).toEqual({
            pathType: 'href',
            path: 'https://yle.fi/a/3-10856187',
            title: 'News article about the project.',
            text: 'https://yle.fi/a/3-10856187',
        })
    })
})
