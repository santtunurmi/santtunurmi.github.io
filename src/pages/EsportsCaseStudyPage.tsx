import CaseStudy from '../components/CaseStudy'
import PageMetadata from '../components/PageMetadata'
import SiteNav from '../components/SiteNav'
import { siteRoutes } from '../routes'

export default function EsportsCaseStudyPage() {
    return (
        <>
            <PageMetadata title='Esports Event Production Case Study | Santtu Nurmi' description='A case study of my production manager work for NUKE-Liiga.' canonicalPath={siteRoutes.esportsCaseStudy} />
            <SiteNav />
            <CaseStudy
                title='Esports Event Production'
                role='Production Manager'
                organization='NUKE-Liiga'
                location='Hybrid'
                period='June 2025 – present'
                responsibilities="Production manager for a Finnish youth esports league across two completed seasons, now continuing in the role for NUKE-Liiga's third season in fall 2026, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team."
                outcome='During the second season, interviewed and oriented an assistant producer while retaining responsibility for live technical delivery.'
                articleTitle='In detail'
                images={[
                    {
                        src: '/content/Working-wide.png',
                        alt: "Santtu Nurmi at a three-monitor production desk during the first NUKE-Liiga season's LAN final.",
                    },
                    {
                        src: '/content/Nukeliiga1.jpeg',
                        alt: "Santtu Nurmi working during the first NUKE-Liiga season's LAN final.",
                    },
                    {
                        src: '/content/Nukeliiga2.jpeg',
                        alt: "Santtu Nurmi in a NUKE-Liiga production shirt during the first season's LAN final.",
                    },
                    {
                        src: '/content/Nukeliiga3.jpg',
                        alt: "The first NUKE-Liiga season's trophy, with Santtu Nurmi working in the background.",
                    },
                    {
                        src: '/content/Nukeliiga4.png',
                        alt: "Santtu Nurmi being interviewed during the second NUKE-Liiga season's LAN final broadcast.",
                    },
                    {
                        src: '/content/Nukeliiga5.png',
                        alt: "Santtu Nurmi at the first NUKE-Liiga season's LAN final.",
                    },
                ]}
                links={[
                    {
                        type: 'external',
                        href: 'https://www.youtube.com/watch?v=cNMYjpt7Qfc',
                        title: 'Aftermovie from the LAN final of the second season, hosted on the official NUKE-Liiga YouTube channel.',
                        text: 'Second season LAN final aftermovie',
                    },
                    {
                        type: 'external',
                        href: 'https://linktr.ee/nukeliiga',
                        title: 'Official NUKE-Liiga links.',
                        text: 'Official NUKE-Liiga links',
                    },
                ]}
            >
                <p>I have competed at a high level in speedrunning, the practice of completing video games as quickly as possible, for more than 10 years. I had been involved in many charity events organized by speedrunning communities I was part of, helping organize events and doing commentary. I applied for the first season of NUKE-Liiga, and this prior experience caught the eye of the recruiters. After a successful interview, I was selected as the production manager for the first season of NUKE-Liiga.</p>
                <p>I came into the role with the feeling that I could have done more to help in previous productions I had been part of. Therefore, I was active in looking for opportunities to get things done. By actively looking for work that needed doing, I helped keep preparation on schedule while learning the production role quickly.</p>
                <p>Throughout the first season, I got a tremendous amount of help and guidance, which was a large part of why I was able to learn things so quickly. At the same time, I had significant responsibilities to fulfill to ensure that the broadcast would run smoothly during the league. There were initially concerns about how I would manage the pressure of a live broadcast environment. I knew from my experience in speedrunning, however, that I had great pressure management skills, which allowed me to execute the broadcasts even when there were unexpected technical difficulties that required quick thinking to solve.</p>
                <p>My ability to manage pressure was further highlighted during the event's playoffs, which culminated in the on-site final at ENCE's main office in Helsinki. I stayed calm through the on-site final, including the unexpected technical problems that had to be solved during a live broadcast. I felt proud that I was able to translate the pressure management skills, which I had mainly cultivated through video games, into tangible projects in a work environment.</p>
                <p>The response to my first season led to further opportunities, including my internship at EXEN, and I was selected to return as production manager for the second season of NUKE-Liiga. During the second season, I interviewed and oriented an assistant producer, which was an entirely new experience for me. It brought with it more responsibility and an emphasis on leadership, which I didn't have much prior experience in.</p>
                <p>The second season of NUKE-Liiga was arguably an even bigger success, with production quality improving considerably. This was largely thanks to the assistant producer learning the ropes quickly, bringing with them the same work ethic I had, along with more technical knowledge. As the season progressed, we found many ways to improve the production. During the on-site final, yet again hosted at ENCE's main office, we split production duties equally. This allowed a more dynamic and fast-paced work environment, which in turn made a more ambitious broadcast for the final possible.</p>
                <p>The success of the assistant producer during the second season was a great thing to witness and something I cannot take credit for. In fact, I recognized quickly that I had to deepen my technical knowledge and spent a lot of time learning the new techniques they were bringing to the production. I was able to learn these techniques, which allowed the production to stay consistent throughout. I even learned Photoshop in only a few hours to centralize the production tooling more effectively. When looking at the success of the second season as a whole, however, my onboarding of the assistant producer at the start of the season and my adaptation to a more senior role in production did their part in making a successful second season of NUKE-Liiga possible.</p>
                <p>I am continuing as production manager for NUKE-Liiga's third season, and I hope it will be as challenging and educational as the two seasons before it.</p>
            </CaseStudy>
        </>
    )
}
