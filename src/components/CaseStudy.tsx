import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { ContentImage, ContentLink } from '../models/content'
import ArticleContext from './ArticleContext'

type CaseStudyProps = {
    title: string
    role: string
    organization: string
    location: string
    period: string
    responsibilities: string
    outcome: string
    articleTitle: string
    children?: ReactNode
    images: readonly ContentImage[]
    links: readonly ContentLink[]
}

export default function CaseStudy({ title, role, organization, location, period, responsibilities, outcome, articleTitle, children, images, links }: CaseStudyProps) {
    return (
        <article className='case-study page-without-opening-card container-fluid'>
            <ArticleContext label='Case study' />
            <h1 className='fw-semibold'>{title}</h1>
            <div className='case-study-sections row g-4 mt-2'>
                <div className='col-md-5'>
                    <section className='case-study-context h-100' aria-labelledby='case-study-context-heading'>
                        <h2 id='case-study-context-heading' className='h4'>Context</h2>
                        <dl className='case-study-facts'>
                            <div>
                                <dt>Role</dt>
                                <dd>{role}</dd>
                            </div>
                            <div>
                                <dt>Organization</dt>
                                <dd>{organization}</dd>
                            </div>
                            <div>
                                <dt>Location</dt>
                                <dd>{location}</dd>
                            </div>
                            <div>
                                <dt>Period</dt>
                                <dd>{period}</dd>
                            </div>
                        </dl>
                    </section>
                </div>
                <div className='col-md-7'>
                    <section aria-labelledby='case-study-responsibilities-heading'>
                        <h2 id='case-study-responsibilities-heading' className='h4'>Responsibilities and delivery</h2>
                        <p>{responsibilities}</p>
                    </section>
                    <section className='mt-4' aria-labelledby='case-study-outcome-heading'>
                        <h2 id='case-study-outcome-heading' className='h4'>Outcome and learning</h2>
                        <p>{outcome}</p>
                    </section>
                </div>
            </div>
            <section className='case-study-prose mt-5' aria-labelledby='case-study-prose-heading'>
                <h2 id='case-study-prose-heading' className='h4'>{articleTitle}</h2>
                {children}
                {links.length > 0 && (
                    <ul className='case-study-links mt-4'>
                        {links.map((link) => (
                            <li key={link.text}>
                                {link.type === 'internal' ? (
                                    <Link to={link.to} title={link.title}>{link.text}</Link>
                                ) : (
                                    <a href={link.href} title={link.title} target='_blank' rel='noopener noreferrer'>{link.text}</a>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <section className='mt-5' aria-labelledby='case-study-evidence-heading'>
                <h2 id='case-study-evidence-heading' className='h4'>Images</h2>
                <div className='case-study-gallery'>
                    {images.map((image) => (
                        <img src={image.src} alt={image.alt} key={image.src} />
                    ))}
                </div>
            </section>
        </article>
    )
}
