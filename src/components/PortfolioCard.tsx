import { Link } from 'react-router'
import { motion } from 'motion/react'
import type { LinkTarget } from '../models/content'
import { useInViewReveal } from './motion'

export type PortfolioCardProps = {
    image: string
    alt: string
    title: string
    description: string
    destination: LinkTarget
    actionLabel: string
    externalIcon?: boolean
    columnClassName?: string
    revealDelay?: number
}

function ExternalLinkIcon() {
    return (
        <svg className='portfolio-card-link-icon' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
            <path d='M9 2h5v5M14 2 7.5 8.5M12 9.5V14H2V4h4.5' />
        </svg>
    )
}

export default function PortfolioCard({ image, alt, title, description, destination, actionLabel, externalIcon = false, columnClassName = 'col-sm-6', revealDelay = 0 }: PortfolioCardProps) {
    const reveal = useInViewReveal(revealDelay)

    return (
        <motion.div className={`${columnClassName} d-flex`} {...reveal}>
            <div className='portfolio-card card bg-black h-100 w-100'>
                <div className='portfolio-card-image'>
                    <img src={image} className='card-img-top' alt={alt} />
                </div>
                <div className='card-body bg-black d-flex flex-column flex-grow-1'>
                    <h5 className='card-title mb-4'>{title}</h5>
                    <p className='card-text'>{description}</p>
                    {destination.type === 'internal' ? (
                        <Link to={destination.to} className='btn btn-primary mt-auto align-self-center'>
                            {actionLabel}
                        </Link>
                    ) : (
                        <a href={destination.href} target='_blank' rel='noopener noreferrer' className='btn btn-primary mt-auto align-self-center'>
                            {actionLabel}
                            {externalIcon && <ExternalLinkIcon />}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
