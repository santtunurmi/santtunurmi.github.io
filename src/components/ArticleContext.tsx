import { Link } from 'react-router'
import { siteRoutes } from '../routes'

type ArticleContextProps = {
    label: string
}

export default function ArticleContext({ label }: ArticleContextProps) {
    return (
        <div className='article-context'>
            <Link to={siteRoutes.blog} className='article-return-link site-control btn btn-primary'>Return to blog</Link>
            <p className='article-type-label'>{label}</p>
        </div>
    )
}
