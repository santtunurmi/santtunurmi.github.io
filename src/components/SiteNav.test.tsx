import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import SiteNav from './SiteNav'

describe('SiteNav', () => {
    it('uses router active state for the primary destinations', () => {
        render(
            <MemoryRouter initialEntries={['/education-and-work']}>
                <SiteNav />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'Education & Work' }).classList.contains('active')).toBe(true)
        expect(screen.getByRole('link', { name: 'Portfolio' }).classList.contains('active')).toBe(false)
        expect(screen.getByRole('link', { name: 'Blog' })).not.toBeNull()
    })

    it('keeps Blog active on article and case-study routes', () => {
        render(
            <MemoryRouter initialEntries={['/blog/exen-internship']}>
                <SiteNav />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'Blog' }).classList.contains('active')).toBe(true)
    })

    it('opens and closes the mobile menu with its toggle, Escape, and outside clicks', () => {
        render(
            <MemoryRouter>
                <SiteNav />
            </MemoryRouter>,
        )

        const toggle = screen.getByRole('button', { name: 'Toggle navigation' })
        const links = document.getElementById('primary-navigation-links')

        fireEvent.click(toggle)
        expect(toggle.getAttribute('aria-expanded')).toBe('true')
        expect(links?.classList.contains('site-nav-links--open')).toBe(true)

        fireEvent.keyDown(document, { key: 'Escape' })
        expect(toggle.getAttribute('aria-expanded')).toBe('false')
        expect(document.activeElement).toBe(toggle)

        fireEvent.click(toggle)
        fireEvent.pointerDown(document.body)
        expect(toggle.getAttribute('aria-expanded')).toBe('false')
    })
})
