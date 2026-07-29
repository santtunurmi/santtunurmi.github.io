import { Link, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'

type SiteRoute = '/' | '/bio' | '/webserver' | '/ai' | '/hobbies'

type NavLinkProps = {
    to: SiteRoute
    children: string
    className?: string
    disabled?: boolean
    active?: boolean
}

function NavLink({ to, children, className = 'nav-link', disabled = false, active = false }: NavLinkProps) {
    const activeClassName = `${className}${active ? ' active' : ''}`

    if (disabled) {
        return (
            <Link
                to={to}
                className={`${activeClassName} disabled`}
                aria-disabled='true'
                aria-current={active ? 'page' : undefined}
                tabIndex={-1}
                onClick={(event) => event.preventDefault()}
            >
                {children}
            </Link>
        )
    }

    return (
        <Link to={to} className={activeClassName} aria-current={active ? 'page' : undefined}>
            {children}
        </Link>
    )
}

export default function SiteNav() {
    const { pathname } = useLocation()
    const mobileNavToggleRef = useRef<HTMLButtonElement>(null)
    const homeActive = pathname === '/' || pathname === '/index.html'
    const bioActive = pathname === '/bio' || pathname === '/bio.html'
    const webserverActive = pathname === '/webserver' || pathname === '/webserver.html'
    const aiActive = pathname === '/ai' || pathname === '/ai.html'
    const hobbiesActive = pathname === '/hobbies' || pathname === '/hobbies.html'

    useEffect(() => {
        if (mobileNavToggleRef.current?.getAttribute('aria-expanded') === 'true') {
            mobileNavToggleRef.current.click()
        }
    }, [pathname])

    return (
        <div className='position-fixed min-wv-25 h-100 end-0 z-2'>
            <nav className='nav flex-column p-2 m-3 text-bg-primary rounded-1' aria-orientation='vertical'>
                <button
                    ref={mobileNavToggleRef}
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
                    <NavLink to='/' active={homeActive}>
                        Portfolio
                    </NavLink>
                    <div className='nav-item dropdown'>
                        <a
                            className={`nav-link dropdown-toggle${bioActive || webserverActive ? ' active' : ''}`}
                            data-bs-toggle='dropdown'
                            href='#'
                            role='button'
                            aria-expanded='false'
                        >
                            Bio
                        </a>
                        <ul className='dropdown-menu text-bg-primary'>
                            <li>
                                <NavLink to='/bio' className='dropdown-item' active={bioActive}>
                                    Main Bio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/webserver' className='dropdown-item' disabled active={webserverActive}>
                                    Webserver (Coming Soon)
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink to='/ai' active={aiActive}>AI</NavLink>
                    <NavLink to='/hobbies' active={hobbiesActive}>Hobbies</NavLink>
                    <a className='nav-link' href='/content/CV.pdf' target='_blank' rel='noopener noreferrer'>
                        Download CV
                    </a>
                </div>
            </nav>
        </div>
    )
}
