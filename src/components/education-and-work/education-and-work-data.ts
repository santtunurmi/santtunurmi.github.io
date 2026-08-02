import type { TimelineEntry } from './timeline-types'

const educationTimeline: readonly TimelineEntry[] = [
    {
        id: 'jamk-ict-2022',
        title: "Bachelor's Degree Programme in Information and Communication Technology",
        organization: 'JAMK University of Applied Sciences',
        location: 'Jyväskylä',
        period: 'August 2022 – thesis planned for autumn 2026',
        description: 'My education in information and communication technology at JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills. I strongly believe that a wide range of skills and knowledge is vital, because it helps you see how different things can work together. My education has also challenged me to demand more of myself. I did not get the best grades at the start, and I did not work as hard as I could have to get the most out of my education. A change of heart and a lot of hard work allowed me to turn things around; I have used that momentum to kickstart my career.',
        links: [
            {
                type: 'external',
                href: 'https://www.jamk.fi/en/apply-to-Jamk/bachelors-degree/become-an-ict-engineer-ready-for-rapidly-digitalising-world',
                title: 'Click here for more information about the Programme.',
                text: 'Click here for more information about the Programme.',
            },
        ],
        geometry: {
            type: 'duration',
            start: { year: 2022, month: 8 },
            end: 'current',
        },
    },
    {
        id: 'aanekoski-upper-secondary-2019',
        title: 'High School Diploma',
        organization: 'Äänekoski Upper Secondary School',
        location: 'Äänekoski',
        period: 'August 2019 – June 2022',
        geometry: {
            type: 'duration',
            start: { year: 2019, month: 8 },
            end: { year: 2022, month: 6 },
        },
    },
]

const workTimeline: readonly TimelineEntry[] = [
    {
        id: 'exen-intern-2026',
        title: 'Software Development Intern',
        organization: 'EXEN esports Oy',
        location: 'Jyväskylä / Hybrid',
        period: 'January – May 2026',
        description: 'Worked across four successful projects spanning application development, system restoration, technical auditing, cloud-hosting and CI/CD research, WordPress/PHP work, and live video production. The range let me use my full skill set and remains the strongest showcase of my project-first approach.',
        links: [
            {
                type: 'external',
                href: 'https://exen.fi/en/front-page/',
                title: 'Official website of EXEN esports Oy.',
                text: 'https://exen.fi/en/front-page/',
            },
        ],
        images: [
            {
                src: '/content/Exen1.jpeg',
                alt: 'Santtu Nurmi in an EXEN-branded sweater in front of the EXEN logo at its sauna and gaming venue.',
            },
        ],
        geometry: {
            type: 'duration',
            start: { year: 2026, month: 1 },
            end: { year: 2026, month: 5 },
            lane: 2,
            titleSide: 'right',
        },
    },
    {
        id: 'nuke-liiga-production-manager-2025',
        title: 'Production Manager',
        organization: 'NUKE-Liiga',
        location: 'Hybrid',
        period: 'June 2025 – May 2026',
        description: 'Production manager for a Finnish youth esports league across two seasons, handling broadcast preparation, technical execution, in-game camerawork, and coordination with the production team. During the second season, interviewed and oriented an assistant producer while retaining responsibility for live technical delivery.',
        links: [
            {
                type: 'external',
                href: 'https://www.youtube.com/watch?v=cNMYjpt7Qfc',
                title: 'Aftermovie from the LAN final of the second season, hosted on the official NUKE-Liiga YouTube channel.',
                text: 'Click here to view the second season LAN final aftermovie!',
            },
        ],
        images: [
            {
                src: '/content/Working-wide.png',
                alt: 'Santtu Nurmi at a three-monitor production desk during the first NUKE-Liiga season\'s LAN final.',
            },
            {
                src: '/content/Nukeliiga1.jpeg',
                alt: 'Santtu Nurmi working during the first NUKE-Liiga season\'s LAN final.',
            },
            {
                src: '/content/Nukeliiga2.jpeg',
                alt: 'Santtu Nurmi in a NUKE-Liiga production shirt during the first season\'s LAN final.',
            },
            {
                src: '/content/Nukeliiga3.jpg',
                alt: 'The first NUKE-Liiga season\'s trophy, with Santtu Nurmi working in the background.',
            },
            {
                src: '/content/Nukeliiga4.png',
                alt: 'Santtu Nurmi being interviewed during the second NUKE-Liiga season\'s LAN final broadcast.',
            },
            {
                src: '/content/Nukeliiga5.png',
                alt: 'Santtu Nurmi at the first NUKE-Liiga season\'s LAN final.',
            },
        ],
        geometry: {
            type: 'duration',
            start: { year: 2025, month: 6 },
            end: { year: 2026, month: 5 },
            lane: 1,
            titleSide: 'right',
        },
    },
    {
        id: 'abc-hirvaskangas-retail-2022',
        title: 'Retail Store Worker (summer job)',
        organization: 'ABC Hirvaskangas',
        location: 'Äänekoski',
        period: 'May 2022 – August 2022',
        description: 'My second summer job in retail built on my previous experience with stocking shelves and storage, while adding dishwashing and a longer, more involved role. I learned more about the work it takes to keep a store running. That hands-on experience remains grounding as my education and projects have moved me toward more technical roles.',
        geometry: {
            type: 'duration',
            start: { year: 2022, month: 5 },
            end: { year: 2022, month: 8 },
            lane: 1,
            titleSide: 'right',
        },
    },
    {
        id: 'k-citymarket-trainee-2019',
        title: 'Trainee (summer job)',
        organization: 'K-Citymarket Äänekoski',
        location: 'Äänekoski',
        period: 'July 2019',
        description: 'Worked with stocking shelves and storage. A valuable experience that helped me land a second summer job in retail later on.',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 7 },
            titleOffset: -32,
        },
    },
    {
        id: 'aanekoski-youth-counselor-2019',
        title: "Youth Counselor's Assistant (summer job)",
        organization: 'City of Äänekoski',
        location: 'Äänekoski',
        period: 'June 2019',
        description: 'Took part in a painting project organized by the city of Äänekoski. With no prior experience in painting, I was able to learn the required skills to provide valuable help for the project, which was completed in a month and on schedule. The outdoor group project gave me useful variety in my early work experience. My active participation also gave me an opportunity to be featured in a news article about the project:',
        links: [
            {
                type: 'external',
                href: 'https://yle.fi/a/3-10856187',
                title: 'News article about the project.',
                text: 'https://yle.fi/a/3-10856187',
            },
        ],
        geometry: {
            type: 'point',
            at: { year: 2019, month: 6 },
            titleOffset: 32,
        },
    },
    {
        id: 'huvikumpu-summer-trainee-2018',
        title: 'Summer Trainee (summer job)',
        organization: 'Pienryhmäkoti Huvikumpu',
        location: 'Äänekoski',
        period: 'June 2018',
        description: 'My first paid summer job consisted of cleaning and assisting with guiding children. As my first experience of working life, it instilled a strong work ethic and a dedication to quality that I still value today.',
        geometry: {
            type: 'point',
            at: { year: 2018, month: 6 },
        },
    },
]

export const educationAndWorkTimeline: readonly TimelineEntry[] = [...educationTimeline, ...workTimeline]
