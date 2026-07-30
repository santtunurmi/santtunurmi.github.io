import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useInViewReveal } from './motion'

export type LinkDestination =
    | {
          type: 'internal'
          to: string
      }
    | {
          type: 'external'
          href: string
      }

export type PortfolioCardProps = {
    image: string
    alt: string
    title: string
    description: string
    destination: LinkDestination
    revealDelay?: number
}

export default function PortfolioCard({ image, alt, title, description, destination, revealDelay = 0 }: PortfolioCardProps) {
    const reveal = useInViewReveal(revealDelay)

    return (
        <motion.div className='col-sm-6 col-lg-4 p-0 d-flex' {...reveal}>
            <div className='portfolio-card card bg-black h-100 w-100'>
                <div className='portfolio-card-image'>
                    <img src={image} className='card-img-top' alt={alt} />
                </div>
                <div className='card-body bg-black d-flex flex-column flex-grow-1'>
                    <h5 className='card-title mb-4'>{title}</h5>
                    <p className='card-text'>{description}</p>
                    {destination.type === 'internal' ? (
                        <Link to={destination.to} className='btn btn-primary mt-auto align-self-start'>
                            Read more
                        </Link>
                    ) : (
                        <a href={destination.href} target='_blank' rel='noopener noreferrer' className='btn btn-primary mt-auto align-self-start'>
                            Read more
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
