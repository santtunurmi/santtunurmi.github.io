import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import EducationAndWorkTimeline from './EducationAndWorkTimeline'
import type { TimelineEntry, TimelineScale } from './timeline-types'

const entry: TimelineEntry = {
    id: 'project',
    title: 'Project title',
    organization: 'Organization',
    location: 'Location',
    period: 'June 2025 – present',
    geometry: {
        type: 'duration',
        start: { year: 2025, month: 6 },
        end: 'current',
    },
}

const scale: TimelineScale = {
    baseline: { year: 2025, month: 1 },
    current: { year: 2026, month: 8 },
    months: 20,
}

describe('EducationAndWorkTimeline', () => {
    it('keeps a clicked entry highlighted until its modal begins closing', async () => {
        render(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )

        const trigger = screen.getByRole('button', { name: /Project title/ })
        const timelineEntry = trigger.closest('li')

        fireEvent.click(trigger, { detail: 1 })

        expect(timelineEntry?.classList.contains('education-and-work-timeline-entry--active')).toBe(true)
        fireEvent.click(await screen.findByRole('button', { name: 'Close' }), { detail: 1 })
        expect(timelineEntry?.classList.contains('education-and-work-timeline-entry--active')).toBe(false)
    })

    it('restores focus only when the entry was opened from the keyboard', async () => {
        const { container, rerender } = render(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )
        const pointerTrigger = screen.getByRole('button', { name: /Project title/ })

        pointerTrigger.focus()
        fireEvent.click(pointerTrigger, { detail: 1 })
        expect(document.activeElement).not.toBe(pointerTrigger)
        fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }))
        await waitFor(() => expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false), { timeout: 1500 })
        expect(document.activeElement).not.toBe(pointerTrigger)

        rerender(
            <MemoryRouter>
                <EducationAndWorkTimeline entries={[entry]} scale={scale} />
            </MemoryRouter>,
        )
        const keyboardTrigger = screen.getByRole('button', { name: /Project title/ })

        fireEvent.click(keyboardTrigger, { detail: 0 })
        fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }))
        await waitFor(() => expect(document.activeElement).toBe(keyboardTrigger), { timeout: 1500 })
    })
})
