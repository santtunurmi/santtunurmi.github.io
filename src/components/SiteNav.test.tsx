import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import SiteNav from './SiteNav'

describe('SiteNav', () => {
    it('uses router active state and a button for the Education and Work menu', () => {
        render(
            <MemoryRouter initialEntries={['/education-and-work']}>
                <SiteNav />
            </MemoryRouter>,
        )

        expect(screen.getByRole('button', { name: 'Education & Work' }).classList.contains('active')).toBe(true)
        expect(screen.getByRole('link', { name: 'Education & Work' }).classList.contains('active')).toBe(true)
        expect(screen.getByRole('link', { name: 'Portfolio' }).classList.contains('active')).toBe(false)
    })

    it('keeps the coming-soon route out of keyboard navigation', () => {
        render(
            <MemoryRouter>
                <SiteNav />
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'Webserver (Coming Soon)' })).toMatchObject({
            ariaDisabled: 'true',
            tabIndex: -1,
        })
    })
})
