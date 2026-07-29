import { motion } from 'motion/react'
import { useInViewReveal } from './motion'

export type TimelineEntry = {
    id: string
    title: string
    organization: string
    location: string
    period: string
    description?: string
}

export const educationTimeline: readonly TimelineEntry[] = [
    {
        id: 'jamk-ict-2022',
        title: "Bachelor's Degree Programme in Information and Communication Technology",
        organization: 'JAMK University of Applied Sciences',
        location: 'Jyväskylä',
        period: 'Aug 2022 – thesis planned for autumn 2026',
    },
    {
        id: 'aanekoski-upper-secondary-2019',
        title: 'High School Diploma',
        organization: 'Äänekoski Upper Secondary School',
        location: 'Äänekoski',
        period: 'Aug 2019 – Jun 2022',
    },
]

export const workTimeline: readonly TimelineEntry[] = [
    {
        id: 'exen-intern-2026',
        title: 'Software Development Intern',
        organization: 'EXEN esports Oy',
        location: 'Jyväskylä / Hybrid',
        period: 'Jan – May 2026',
        description: 'Worked across application development, technical auditing, WordPress/PHP improvements, cloud-hosting and CI/CD research, and partner project support.',
    },
    {
        id: 'nuke-liiga-production-manager-2025',
        title: 'Production Manager',
        organization: 'NUKE-Liiga',
        location: 'Hybrid',
        period: 'Jun 2025 – May 2026',
        description: 'Handled broadcast preparation, technical execution, and in-game camerawork.',
    },
    {
        id: 'abc-hirvaskangas-retail-2022',
        title: 'Retail Store Worker (summer job)',
        organization: 'ABC Hirvaskangas',
        location: 'Hirvaskangas',
        period: 'Summer 2022',
        description: 'Worked mainly on shelving, storage and dishes.',
    },
    {
        id: 'k-citymarket-trainee-2019',
        title: 'Trainee (summer job)',
        organization: 'K-Citymarket Äänekoski',
        location: 'Äänekoski',
        period: 'Jul – Aug 2019',
    },
    {
        id: 'aanekoski-youth-counsellor-2019',
        title: "Youth counsellor's assistant (summer job)",
        organization: 'City of Äänekoski',
        location: 'Äänekoski',
        period: 'Jun – Jul 2019',
    },
    {
        id: 'huvikumpu-summer-trainee-2018',
        title: 'Summer trainee (summer job)',
        organization: 'Pienryhmäkoti Huvikumpu',
        location: 'Äänekoski',
        period: 'Jun 2018',
    },
]

type BioTimelineProps = {
    entries: readonly TimelineEntry[]
}

export default function BioTimeline({ entries }: BioTimelineProps) {
    return (
        <ol className='bio-timeline'>
            {entries.map((entry, index) => (
                <TimelineItem entry={entry} index={index} key={entry.id} />
            ))}
        </ol>
    )
}

type TimelineItemProps = {
    entry: TimelineEntry
    index: number
}

function TimelineItem({ entry, index }: TimelineItemProps) {
    const reveal = useInViewReveal(index * 0.03)

    return (
        <motion.li className='bio-timeline-item' {...reveal}>
            <div className='bio-timeline-marker' aria-hidden='true'></div>
            <div className='bio-timeline-content'>
                <h3 className='h5 fw-semibold'>{entry.title}</h3>
                <p className='mb-1'>{entry.organization} · {entry.location}</p>
                <p className='bio-timeline-date mb-0'>{entry.period}</p>
                {entry.description && <p className='mb-0 mt-2'>{entry.description}</p>}
            </div>
        </motion.li>
    )
}
