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
                responsibilities='Worked across successful projects spanning application development, system restoration, technical auditing, cloud-hosting and CI/CD research, WordPress/PHP work, and live video production.'
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
                <p>EXEN had seen my work during the first season of NUKE-Liiga, where it was one of the participating organizations. That gave the team useful context when I later applied for an internship with EXEN. At EXEN, I was afforded a lot of freedom to structure how I wanted to do my work: I suggested I would learn AI-assisted workflows entirely from scratch, which EXEN was very supportive of from the start. To balance out the freedom, I was given responsibility for finishing a demanding application development project, essentially by myself. I worked with languages such as TypeScript, Go, Kotlin, and Swift for the first time, which was the perfect challenge to cut my teeth on the work while refining the AI-assisted workflows I had started designing.</p>
                <p>Only a couple of weeks into my internship, management at EXEN was impressed by my output and suggested that I join a software development project for an EXEN business partner. I took the challenge head-on and investigated, tested, and restored a full inventory-management system. I continued testing and developing the system and consulted on project decisions, including CI/CD, cloud-hosting options, and technical tradeoffs. I had never designed a cloud hosting deployment approach before, which I considered a significant gap in my skills as a software engineer. However, I was able to learn the necessary skills, provided clear direction for the project and took the skills I had learned back to EXEN projects.</p>
                <p>Alongside these projects, I also did esports broadcast production for both EXEN and the second season of NUKE-Liiga. The work at NUKE-Liiga was included in my internship, as EXEN is a participant in and key partner of NUKE-Liiga. The smaller EXEN production required more independent problem-solving because fewer people were available to absorb technical issues. Both productions were delivered successfully, and their broadcast quality improved over the course of each season.</p>
                <p>Despite having a lot on my plate, I was always looking for ways to add value for the EXEN organization. I spotted some possible improvements on the official EXEN website, and after being given the green light, I completed a full website audit, which I handed off to relevant stakeholders. I continued this active participation by offering to handle the WordPress updates identified in the audit. I learned WordPress from scratch and updated the entire site. After a meeting with stakeholders, I was given permission to handle the source-level PHP improvements to the site. I had never written PHP but learned it quickly and completed the full suite of technical improvements from the audit.</p>
                <p>I received strong praise throughout, as every project I completed for EXEN was a success. The relationship has continued beyond the internship: I am completing my thesis as a project for EXEN in autumn 2026. Being able to build on the work I had put in during my internship is exciting. I had a great time at EXEN and couldn't think of a better way to complete my internship.</p>
            </CaseStudy>
        </>
    )
}
