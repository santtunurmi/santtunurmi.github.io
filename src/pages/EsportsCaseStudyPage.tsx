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
                responsibilities='Production manager for a Finnish youth esports league across two completed seasons, now continuing into a third in fall 2026, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team.'
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
                {/* Case-study prose goes here. */}
            </CaseStudy>
        </>
    )
}
