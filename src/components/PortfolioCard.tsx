import { Link } from 'react-router'

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
}

export default function PortfolioCard({ image, alt, title, description, destination }: PortfolioCardProps) {
    return (
        <div className='col-sm-6 col-lg-4 card bg-black p-0'>
            <div className='portfolio-card-image'>
                <img src={image} className='card-img-top' alt={alt} />
            </div>
            <div className='card-body bg-black'>
                <h5 className='card-title mb-4'>{title}</h5>
                <p className='card-text'>{description}</p>
                {destination.type === 'internal' ? (
                    <Link to={destination.to} className='btn btn-primary'>
                        Read more
                    </Link>
                ) : (
                    <a href={destination.href} target='_blank' className='btn btn-primary'>
                        Read more
                    </a>
                )}
            </div>
        </div>
    )
}
