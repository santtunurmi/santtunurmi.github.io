import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import CaseStudy from './CaseStudy'

describe('CaseStudy', () => {
    it('places its long-form prose between the summary and evidence sections', () => {
        render(
            <MemoryRouter>
                <CaseStudy
                    title='Case-study title'
                    role='Role'
                    organization='Organization'
                    location='Location'
                    period='Period'
                    responsibilities='Responsibilities'
                    outcome='Outcome'
                    articleTitle='Article title'
                    images={[]}
                    links={[{ type: 'external', href: 'https://example.com', title: 'Example link.', text: 'Example link' }]}
                >
                    <p>Article prose</p>
                </CaseStudy>
            </MemoryRouter>,
        )

        const summary = screen.getByRole('heading', { level: 2, name: 'Context' }).closest('.case-study-sections')
        const prose = screen.getByRole('heading', { level: 2, name: 'Article title' }).closest('section')
        const images = screen.getByRole('heading', { level: 2, name: 'Images' }).closest('section')
        const relatedLink = screen.getByRole('link', { name: 'Example link' })

        expect(prose?.textContent).toContain('Article prose')
        expect(screen.getByRole('link', { name: 'Return to blog' }).getAttribute('href')).toBe('/blog')
        expect(screen.getByText('Case study').classList.contains('article-type-label')).toBe(true)
        expect(summary).not.toBeNull()
        expect(prose).not.toBeNull()
        expect(images).not.toBeNull()
        expect(summary!.compareDocumentPosition(prose!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(prose!.contains(relatedLink)).toBe(true)
        expect(prose!.compareDocumentPosition(images!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
})
