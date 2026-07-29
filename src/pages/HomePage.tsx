import PortfolioCard, { type PortfolioCardProps } from '../components/PortfolioCard'
import PageMetadata from '../components/PageMetadata'

const portfolioCards: PortfolioCardProps[] = [
    {
        image: '/content/EXEN-card.webp',
        alt: 'EXEN esports front page.',
        title: 'Software development internship at EXEN esports Oy Jan–May 2026',
        description: 'Worked accross four different projects, ranging from application work, system restoration, technical audit, cloud-host and CI/CD research, WordPress/PHP and live video production. I really got to use the entire range of my skillset at EXEN, which remains the strongest showcase of my project-first mentality and ability to get things done, as all four projects were a success.',
        destination: {
            type: 'external',
            href: 'https://exen.fi/en/front-page/',
        },
    },
    {
        image: '/content/Portfolio-website.png',
        alt: 'Image of this website.',
        title: 'Full-stack development',
        description: 'I started this portfolio website in my free time to stand out more during the recruitment process. I ended up spending 2 months making the first version of this site. After, I studied most of the full-stack module in my university and took the lessons from there to improve the site further. The site is a constant work-in-progress but should showcase my skills in full-stack development well.',
        destination: {
            type: 'external',
            href: 'https://github.com/santtunurmi/santtunurmi.github.io',
        },
    },
    {
        image: '/content/NUKEliiga.webp',
        alt: 'Data preprocessing code.',
        title: 'Esports event production',
        description: 'I was the production manager at "NUKE-Liiga", a Finnish academy league for Counter-Strike esports, for its first two seasons. As the production manager I handled the technical execution of the stream, communicated with casters during broadcasts, and created the stream layouts together with graphic designers. I additionally handled the in-game camerawork.',
        destination: {
            type: 'external',
            href: 'https://linktr.ee/nukeliiga',
        },
    },
    {
        image: '/content/AI-project.png',
        alt: 'Data preprocessing code.',
        title: 'AI-workflows',
        description: 'I have many different projects, and using AI-workflows has allowed me to speed up that work considerably, while never sacrificing quality, or losing that human touch and creativity. I use ChatGPT Codex, Anthropic Claude Code, OpenClaw and OpenCode. I talk to them, and I get things done.',
        destination: {
            type: 'internal',
            to: '/ai',
        },
    },
    {
        image: '/content/minecraft-wall.jpg',
        alt: 'Image of pillars in minecraft.',
        title: 'Minecraft wall calculator',
        description: "This may seem like an odd little project, and it's not complex, I'll admit, but it spawned from a genuine need for a program that did exactly this functionality.",
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
                    <p>Project-first software-developer with great technical problem solving skills. My experience spans software, web, tooling, reporting, live production, and more, while I use AI-assisted workflows to speed up research, problem solving and development. Currently finishing an ICT Engineering degree in Jyväskylä.</p>
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
