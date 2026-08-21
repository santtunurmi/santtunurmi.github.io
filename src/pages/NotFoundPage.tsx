import { Link } from 'react-router'
import PageMetadata from '../components/PageMetadata'
import SiteNav from '../components/SiteNav'
import { siteRoutes } from '../routes'

export default function NotFoundPage() {
    return (
        <>
            <PageMetadata title='Page Not Found | Santtu Nurmi' description='The requested page was not found.' />
            <SiteNav />
            <div className='page-without-opening-card container-fluid'>
                <h1 className='fw-semibold'>Page Not Found</h1>
                <p>The page you requested does not exist.</p>
                <Link to={siteRoutes.home} className='site-control btn btn-primary'>Return To The Portfolio</Link>
            </div>
        </>
    )
}
