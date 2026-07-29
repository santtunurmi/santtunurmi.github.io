import PortfolioCard, { type PortfolioCardProps } from '../components/PortfolioCard'
import PageMetadata from '../components/PageMetadata'

const portfolioCards: PortfolioCardProps[] = [
    {
        image: '/content/EXEN-card.webp',
        alt: 'EXEN esports website showing its gaming venue.',
        title: 'Software development internship at EXEN esports Oy',
        description: 'Worked across application development, technical auditing, WordPress/PHP improvements, cloud-hosting and CI/CD research, and an inventory-management system for an EXEN business partner.',
        destination: {
            type: 'external',
            href: 'https://exen.fi/en/front-page/',
        },
    },
    {
        image: '/content/NUKEliiga.webp',
        alt: 'NUKE-Liiga logo beside a Counter-Strike player.',
        title: 'NUKE-Liiga production management',
        description: 'Production manager for a Finnish youth esports league across two seasons, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team.',
        destination: {
            type: 'external',
            href: 'https://linktr.ee/nukeliiga',
        },
    },
    {
        image: '/content/AI-project.png',
        alt: 'Python notebook showing data preprocessing code.',
        title: 'AI-assisted workflows',
        description: 'I use AI for exploration, implementation, and review, while keeping responsibility for context, decisions, testing, and the final result.',
        destination: {
            type: 'internal',
            to: '/ai',
        },
    },
    {
        image: '/content/Portfolio-website.png',
        alt: "Screenshot of Santtu Nurmi's portfolio website.",
        title: 'Portfolio website',
        description: 'A self-started web project: V1 was hand-built with HTML, CSS, and JavaScript without AI; V2 became a Bootstrap/Sass multi-page site; V3 is a Vite, React, and TypeScript SPA.',
        destination: {
            type: 'external',
            href: 'https://github.com/santtunurmi/santtunurmi.github.io',
        },
    },
    {
        image: '/content/minecraft-wall.jpg',
        alt: 'Minecraft world with red pillars marking a wall layout.',
        title: 'Minecraft wall calculator',
        description: 'A small utility built for a real need: calculating the layout of a Minecraft wall.',
        destination: {
            type: 'external',
            href: 'https://github.com/santtunurmi/Minecraft-Wall-Calculator',
        },
    },
]

export default function HomePage() {
    return (
        <>
            <PageMetadata title='Portfolio of Santtu Nurmi' description="Santtu Nurmi's portfolio of projects and professional work." />
            <header className='card border-0 mh-10 bg-black'>
                <div className='row g-0 gap-0 row-gab-0'>
                    <div className='Opening-card-fade-50 position-absolute h-100 p-0 z-1'></div>
                    <div className='opening-card-background portfolio-image col-sm-8 p-0 z-0'></div>
                    <div className='col-sm-4'></div>
                </div>
                <div className='Opening-card-text-block position-absolute rounded-1 p-2 z-1'>
                    <p>Project-first software developer and technical problem-solver. I build and improve practical systems across web, tooling, technical reporting, and live production. AI is part of my human-reviewed workflow for exploration, implementation, and verification. I am finishing an ICT engineering degree, with my thesis planned for autumn 2026.</p>
                </div>
            </header>
            <h1 className='text-center p-5'>My portfolio:</h1>
            <div className='container-fluid'>
                <div className='container-fluid text-center'>
                    <div className='row gy-3'>
                        {portfolioCards.map((card, index) => (
                            <PortfolioCard key={card.title} revealDelay={index * 0.04} {...card} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
