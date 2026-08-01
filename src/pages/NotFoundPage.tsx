import { Link } from 'react-router'
import PageMetadata from '../components/PageMetadata'

export default function NotFoundPage() {
    return (
        <div className='container-fluid pt-3'>
            <PageMetadata title='Page Not Found | Santtu Nurmi' description='The requested page was not found.' />
            <h1 className='fw-semibold'>Page Not Found</h1>
            <p>The page you requested does not exist.</p>
            <Link to='/' className='btn btn-primary'>Return To The Portfolio</Link>
        </div>
    )
}
