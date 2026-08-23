import OpeningCard from '../components/OpeningCard'
import PortfolioCard, { type PortfolioCardProps } from '../components/PortfolioCard'
import PageMetadata from '../components/PageMetadata'
import SiteNav from '../components/SiteNav'
import { siteRoutes } from '../routes'

const portfolioCards: PortfolioCardProps[] = [
    {
        image: '/content/EXEN-card.webp',
        alt: 'Front page of the EXEN esports website, showcasing their gaming venue.',
        title: 'Software Development Internship at EXEN esports Oy',
        description: 'Worked across successful projects spanning application development, system restoration, technical auditing, cloud-hosting and CI/CD research, WordPress/PHP work, and live video production. The range let me use my full skill set and remains the strongest showcase of my project-first approach.',
        actionLabel: 'Read case study',
        destination: {
            type: 'internal',
            to: siteRoutes.exenCaseStudy,
        },
    },
    {
        image: '/content/NUKEliiga.webp',
        alt: 'Promotional banner of NUKE-Liiga, featuring the NUKE-Liiga logo in the center with a subheading of "NUORTEN KILPAPELAAJIEN E-URHEILULIIGA", and a Counter-Strike player model on the left.',
        title: 'Esports Event Production',
        description: "Production manager for a Finnish youth esports league across two completed seasons, now continuing in the role for NUKE-Liiga's third season in fall 2026, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team. During the second season, interviewed and oriented an assistant producer while retaining responsibility for live technical delivery.",
        actionLabel: 'Read case study',
        destination: {
            type: 'internal',
            to: siteRoutes.esportsCaseStudy,
        },
    },
    {
        image: '/content/Portfolio-website.png',
        alt: "Screenshot of Santtu Nurmi's portfolio website.",
        title: 'Portfolio Website',
        description: 'A self-started web project: V1.0 was hand-built with HTML, CSS, and JavaScript without AI; V2.0 became a Bootstrap/Sass multi-page site; and V3.0 migrated to Vite, React, and TypeScript with AI-assisted workflows, enabling better interactivity, animation, and modularity.',
        actionLabel: 'View on GitHub',
        externalIcon: true,
        destination: {
            type: 'external',
            href: 'https://github.com/santtunurmi/santtunurmi.github.io',
        },
    },
    {
        image: '/content/minecraft-wall.jpg',
        alt: 'Minecraft world with red pillars marking a wall layout.',
        title: 'Minecraft Wall Calculator',
        description: 'This may seem like an odd little project, but it spawned from a genuine need for a program that did exactly this functionality: a small utility for calculating the layout of a wall in Minecraft.',
        actionLabel: 'View on GitHub',
        externalIcon: true,
        destination: {
            type: 'external',
            href: 'https://github.com/santtunurmi/Minecraft-Wall-Calculator',
        },
    },
]

const latestWriting: PortfolioCardProps[] = [
    {
        image: '/content/AI-project.png',
        alt: 'Python notebook showing data preprocessing code.',
        title: 'AI-Assisted Workflows',
        description: 'I use AI-assisted workflows over many different projects for exploration, implementation, and review, while keeping responsibility for context, direction, testing, and final decisions. I use ChatGPT Codex, Claude Code, OpenClaw, and OpenCode. I talk to them, and I get things done.',
        actionLabel: 'Read article',
        destination: {
            type: 'internal',
            to: siteRoutes.aiAssistedWorkflows,
        },
    },
    {
        image: '/content/bassplaying.png',
        alt: 'Santtu Nurmi playing bass guitar.',
        title: 'Hobbies',
        description: 'I believe that one should constantly learn new things. My projects and work at EXEN and NUKE-Liiga provide recent examples of leveraging skills learned through my hobbies and applying them to real, tangible projects.',
        actionLabel: 'Read article',
        destination: {
            type: 'internal',
            to: siteRoutes.hobbies,
        },
    },
]

export default function HomePage() {
    return (
        <>
            <PageMetadata title='Portfolio of Santtu Nurmi' description="Santtu Nurmi's portfolio of projects and professional work." canonicalPath={siteRoutes.home} />
            <OpeningCard profile='portfolio'>
                <p>
                    Project-first software developer and technical problem-solver. I build and improve practical systems across web, tooling, technical reporting, and live production.
                    AI is part of my human-reviewed workflow for exploration, implementation, and verification.
                </p>
            </OpeningCard>
            <SiteNav />
            <h1 className='text-center p-5'>My portfolio:</h1>
            <div className='container-fluid'>
                <div className='portfolio-card-grid row'>
                    {portfolioCards.map((card, index) => (
                        <PortfolioCard key={card.title} revealDelay={index * 0.04} {...card} />
                    ))}
                </div>
            </div>
            <section className='container-fluid mt-5' aria-labelledby='latest-writing-heading'>
                <h2 id='latest-writing-heading' className='text-center pb-4'>Latest writing</h2>
                <div className='portfolio-card-grid row'>
                    {latestWriting.map((entry) => (
                        <PortfolioCard key={entry.title} {...entry} />
                    ))}
                </div>
            </section>
        </>
    )
}
