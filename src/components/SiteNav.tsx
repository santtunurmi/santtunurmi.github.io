import { Link } from 'react-router'

type SiteRoute = '/' | '/bio' | '/webserver' | '/ai' | '/hobbies'

type NavLinkProps = {
    to: SiteRoute
    children: string
    className?: string
    disabled?: boolean
}

function NavLink({ to, children, className = 'nav-link', disabled = false }: NavLinkProps) {
    if (disabled) {
        return (
            <Link
                to={to}
                className={`${className} disabled`}
                aria-disabled='true'
                tabIndex={-1}
                onClick={(event) => event.preventDefault()}
            >
                {children}
            </Link>
        )
    }

    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    )
}

export default function SiteNav() {
    return (
        <div className='position-fixed min-wv-25 h-100 end-0 z-2'>
            <nav className='nav flex-column p-2 m-3 text-bg-primary rounded-1' aria-orientation='vertical'>
                <button
                    className='navbar-toggler p-2'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#mobile-nav'
                    aria-controls='mobile-nav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse nav-pills navbar-collapse' id='mobile-nav'>
                    <h2 className='text-center fs-4'>Santtu Nurmi</h2>
                    <Link to='/' className='nav-link active' aria-current='page'>
                        Portfolio
                    </Link>
                    <div className='nav-item dropdown'>
                        <a className='nav-link dropdown-toggle' data-bs-toggle='dropdown' href='#' role='button' aria-expanded='false'>
                            Bio
                        </a>
                        <ul className='dropdown-menu text-bg-primary'>
                            <li>
                                <NavLink to='/bio' className='dropdown-item'>
                                    Main Bio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/webserver' className='dropdown-item' disabled>
                                    Webserver (Coming Soon)
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink to='/ai'>AI</NavLink>
                    <NavLink to='/hobbies'>Hobbies</NavLink>
                    <a className='nav-link' href='/content/CV.pdf' target='_blank'>
                        Download CV
                    </a>
                </div>
            </nav>
        </div>
    )
}
