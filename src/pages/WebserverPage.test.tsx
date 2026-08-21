import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import WebserverPage from './WebserverPage'

describe('WebserverPage', () => {
    it('keeps the Add Speedrun controls in a form without broken descriptions', () => {
        render(
            <MemoryRouter>
                <WebserverPage />
            </MemoryRouter>,
        )

        const submitButton = screen.getByRole('button', { name: 'Add Speedrun' })
        const form = submitButton.closest('form')

        expect(form).not.toBeNull()
        expect(screen.getByRole('textbox', { name: 'Game' }).hasAttribute('aria-describedby')).toBe(false)
        expect(screen.getByRole('textbox', { name: 'Category' }).hasAttribute('aria-describedby')).toBe(false)
        expect(screen.getByRole('textbox', { name: 'Time' }).hasAttribute('aria-describedby')).toBe(false)
        expect(screen.getByRole('textbox', { name: 'Variables' }).hasAttribute('aria-describedby')).toBe(false)
        expect(screen.getByRole('textbox', { name: 'Video' }).hasAttribute('aria-describedby')).toBe(false)
        expect(() => fireEvent.submit(form!)).not.toThrow()
    })
})
