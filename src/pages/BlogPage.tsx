import PageMetadata from '../components/PageMetadata'
import PortfolioCard, { type PortfolioCardProps } from '../components/PortfolioCard'
import { siteRoutes } from '../routes'

const blogEntries: PortfolioCardProps[] = [
    {
        image: '/content/AI-project.png',
        alt: 'Python notebook showing data preprocessing code.',
        title: 'AI-Assisted Workflows',
        description: 'I use AI-assisted workflows over many different projects for exploration, implementation, and review, while keeping responsibility for context, direction, testing, and final decisions. I use ChatGPT Codex, Claude Code, OpenClaw, and OpenCode. I talk to them, and I get things done.',
        actionLabel: 'Read article',
        columnClassName: 'col-md-4',
        destination: {
            type: 'internal',
            to: siteRoutes.aiAssistedWorkflows,
        },
    },
    {
        image: '/content/EXEN-card.webp',
        alt: 'Front page of the EXEN esports website, showcasing their gaming venue.',
        title: 'Software Development Internship at EXEN esports Oy',
        description: 'Worked across four successful projects spanning application development, system restoration, technical auditing, cloud-hosting and CI/CD research, WordPress/PHP work, and live video production. The range let me use my full skill set and remains the strongest showcase of my project-first approach.',
        actionLabel: 'Read case study',
        columnClassName: 'col-md-4',
        destination: {
            type: 'internal',
            to: siteRoutes.exenCaseStudy,
        },
    },
    {
        image: '/content/NUKEliiga.webp',
        alt: 'Promotional banner of NUKE-Liiga, featuring the NUKE-Liiga logo in the center with a subheading of "NUORTEN KILPAPELAAJIEN E-URHEILULIIGA", and a Counter-Strike player model on the left.',
        title: 'Esports Event Production',
        description: 'Production manager for a Finnish youth esports league across two seasons, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team. During the second season, interviewed and oriented an assistant producer while retaining responsibility for live technical delivery.',
        actionLabel: 'Read case study',
        columnClassName: 'col-md-4',
        destination: {
            type: 'internal',
            to: siteRoutes.esportsCaseStudy,
        },
    },
]

export default function BlogPage() {
    return (
        <div className='page-without-opening-card container-fluid'>
            <PageMetadata title='Blog | Santtu Nurmi' description='Articles and case studies by Santtu Nurmi.' canonicalPath={siteRoutes.blog} />
            <h1 className='fw-semibold'>Blog</h1>
            <p>Articles and case studies.</p>
            <div className='row gx-2 gy-3 mt-3 text-center'>
                {blogEntries.map((entry, index) => (
                    <PortfolioCard key={entry.title} revealDelay={index * 0.04} {...entry} />
                ))}
            </div>
        </div>
    )
}
