import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
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

        expect(screen.getByRole('link', { name: 'my hobbies page' }).getAttribute('href')).toBe('/hobbies')
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
