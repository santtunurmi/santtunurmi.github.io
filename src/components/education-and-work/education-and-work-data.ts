import type { TimelineEntry } from './timeline-types'

const educationTimeline: readonly TimelineEntry[] = [
    {
        id: 'jamk-ict-2022',
        title: "Bachelor's Degree Programme in Information and Communication Technology",
        organization: 'JAMK University of Applied Sciences',
        location: 'Jyväskylä',
        period: 'August 2022 – thesis planned for autumn 2026',
        description: 'My education in information and communication technology at the JAMK University of Applied Sciences in Jyväskylä has taught me the importance of learning new skills. I strongly believe that having a wide range of skills and knowledge is vital for any person to have. You can often find ways to learn how different things can be used together. My education has also challenged me to demand more of myself. I wasn\'t getting the best grades at the start, and didn\'t work as hard as I could have to get the most out of my education. A change of heart and a lot of hard work allowed me to turn things around; the momentum of which I\'ve used to kickstart my career.',
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
        description: 'Worked accross four different projects, ranging from application work, system restoration, technical audit, cloud-host and CI/CD research, WordPress/PHP and live video production. I really got to use the entire range of my skillset at EXEN, which remains the strongest showcase of my project-first mentality and ability to get things done, as all four projects were a success.',
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
                alt: 'An image of me taken at the EXEN esports sauna and gaming venue. I\'m wearing an EXEN-branded sweater and the wall behind me has the EXEN logo on it.',
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
        description: 'I was the production manager at "NUKE-Liiga", a Finnish academy league for Counter-Strike esports, during its first two seasons. As the production manager, I handled the technical execution of the stream, communicated with casters during broadcasts, and created the stream layouts together with graphic designers. I additionally handled the in-game camerawork. During the second season, I interviewed and onboarded an assistant producer while carrying live broadcast responsibility.',
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
                alt: 'An image of me working during the LAN final of the first season of NUKE-Liiga, with a production desk of three monitors and a Stream Deck.',
            },
            {
                src: '/content/Nukeliiga1.jpeg',
                alt: 'An image of me working during the LAN final of the first season of NUKE-Liiga.',
            },
            {
                src: '/content/Nukeliiga2.jpeg',
                alt: 'An selfie of me in the NUKE-Liiga production t-shirt during the LAN final of the first season of NUKE-Liiga.',
            },
            {
                src: '/content/Nukeliiga3.jpg',
                alt: 'An image of the trophy of the first season of NUKE-Liiga, with me working in the background.',
            },
            {
                src: '/content/Nukeliiga4.png',
                alt: 'An image of me being interviewed during the NUKE-Liiga second season LAN final broadcast.',
            },
            {
                src: '/content/Nukeliiga5.png',
                alt: 'An image of me taken during the LAN final of the first season of NUKE-Liiga.',
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
        description: 'My second summer job in retail, building off of my previous experience. Worked shelving, storage and dishwashing. In a longer term, and more involved role, I learnt more about what it takes to run a store. The hands-on work continues to be a grounding experience, as my work has shifted to more technical roles through my education and projects.',
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
        description: 'Worked shelving and storage. A valuable experience that helped me land a second summer job in retail later on.',
        geometry: {
            type: 'point',
            at: { year: 2019, month: 7 },
            titleOffset: -32,
        },
    },
    {
        id: 'aanekoski-youth-counsellor-2019',
        title: "Youth Counsellor's Assistant (summer job)",
        organization: 'City of Äänekoski',
        location: 'Äänekoski',
        period: 'June 2019',
        description: 'Took part in a painting project organized by the city of Äänekoski. With no prior experience in painting, I was able to learn the required skills to provide valuable help for the project, which was completed in a month and on schedule. With the work being conducted outdoors and as a group effort, the considerably different work environment gave me valuable variety in my work experience early on. My active participation also gave me an opportunity to appear on the news:',
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
        description: 'My first paid summer job, my worked consisted of cleaning, and assisting in guiding customers. As a first experience in work life, it instilled a strong sense of work ethic and a dedication to quality in my work, that I still value today.',
        geometry: {
            type: 'point',
            at: { year: 2018, month: 6 },
        },
    },
]

export const educationAndWorkTimeline: readonly TimelineEntry[] = [...educationTimeline, ...workTimeline]
