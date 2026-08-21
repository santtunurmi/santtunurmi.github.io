import CaseStudy from '../components/CaseStudy'
import PageMetadata from '../components/PageMetadata'
import SiteNav from '../components/SiteNav'
import { siteRoutes } from '../routes'

export default function ExenCaseStudyPage() {
    return (
        <>
            <PageMetadata title='EXEN Internship Case Study | Santtu Nurmi' description='A case study of my software development internship at EXEN esports Oy.' canonicalPath={siteRoutes.exenCaseStudy} />
            <SiteNav />
            <CaseStudy
                title='Software Development Internship at EXEN esports Oy'
                role='Software Development Intern'
                organization='EXEN esports Oy'
                location='Jyväskylä / Hybrid'
                period='January – May 2026'
                responsibilities='Worked across four successful projects spanning application development, system restoration, technical auditing, cloud-hosting and CI/CD research, WordPress/PHP work, and live video production.'
                outcome='The range let me use my full skill set and remains the strongest showcase of my project-first approach.'
                articleTitle='In detail'
                images={[
                    {
                        src: '/content/Exen1.jpeg',
                        alt: 'Santtu Nurmi in an EXEN-branded sweater in front of the EXEN logo at its sauna and gaming venue.',
                    },
                ]}
                links={[
                    {
                        type: 'external',
                        href: 'https://exen.fi/en/front-page/',
                        title: 'Official website of EXEN esports Oy.',
                        text: 'Official website of EXEN esports Oy',
                    },
                ]}
            >
                {/* Case-study prose goes here. */}
            </CaseStudy>
        </>
    )
}
