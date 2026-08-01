import type { ReactNode } from 'react'

const openingCardProfiles = {
    portfolio: {
        fadeClass: 'Opening-card-fade',
        mediaClass: 'col-sm-8',
        spacerClass: 'col-sm-4',
    },
    bio: {
        fadeClass: 'Opening-card-fade-100',
        mediaClass: 'col-sm-11',
        spacerClass: 'col-sm-1',
    },
    ai: {
        fadeClass: 'Opening-card-fade-100',
        mediaClass: 'col-sm-11',
        spacerClass: 'col-sm-1',
    },
    hobbies: {
        fadeClass: 'Opening-card-fade-60',
        mediaClass: 'col-sm-8',
        spacerClass: 'col-sm-4',
    },
    webserver: {
        fadeClass: 'Opening-card-fade',
        mediaClass: 'col-md-8',
        spacerClass: 'col-md-4',
    },
} as const

export type OpeningCardProfile = keyof typeof openingCardProfiles

type OpeningCardProps = {
    profile: OpeningCardProfile
    children: ReactNode
}

export default function OpeningCard({ profile, children }: OpeningCardProps) {
    const { fadeClass, mediaClass, spacerClass } = openingCardProfiles[profile]

    return (
        <header className={`card border-0 mh-10 bg-black opening-card opening-card--${profile}`}>
            <div className='row g-0 gap-0 row-gab-0'>
                <div className={`${fadeClass} position-absolute h-100 p-0 z-1`}></div>
                <div className={`opening-card-background ${mediaClass} p-0 z-0`}></div>
                <div className={spacerClass}></div>
            </div>
            <div className='Opening-card-text-block position-absolute rounded-1 p-2 z-1'>
                {children}
            </div>
        </header>
    )
}
