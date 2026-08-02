import { NavLink as RouterNavLink, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'
import { educationAndWorkRouteGroup, siteRoutes, type SiteRoute } from '../routes'

type NavLinkProps = {
    to: SiteRoute
    children: string
    className?: string
    disabled?: boolean
}

function NavLink({ to, children, className = 'nav-link', disabled = false }: NavLinkProps) {
    return (
        <RouterNavLink
            to={to}
            end
            className={({ isActive }) => `${className}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
            {children}
        </RouterNavLink>
    )
}

export default function SiteNav() {
    const { pathname } = useLocation()
    const mobileNavToggleRef = useRef<HTMLButtonElement>(null)
    const educationAndWorkActive = educationAndWorkRouteGroup.some((route) => pathname === route)

    useEffect(() => {
        if (mobileNavToggleRef.current?.getAttribute('aria-expanded') === 'true') {
            mobileNavToggleRef.current.click()
        }
    }, [pathname])

    return (
        <div className='position-fixed h-100 end-0 z-2'>
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
                    <NavLink to={siteRoutes.home}>
                        Portfolio
                    </NavLink>
                    <div className='nav-item dropdown'>
                        <button
                            className={`nav-link dropdown-toggle${educationAndWorkActive ? ' active' : ''}`}
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            Education &amp; Work
                        </button>
                        <ul className='dropdown-menu text-bg-primary'>
                            <li>
                                <NavLink to={siteRoutes.educationAndWork} className='dropdown-item'>
                                    Education &amp; Work
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={siteRoutes.webserver} className='dropdown-item' disabled>
                                    Webserver (Coming Soon)
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <NavLink to={siteRoutes.ai}>AI</NavLink>
                    <NavLink to={siteRoutes.hobbies}>Hobbies</NavLink>
                    <a className='nav-link' href='/content/CV.pdf' target='_blank' rel='noopener noreferrer'>
                        Download CV
                    </a>
                </div>
            </nav>
        </div>
    )
}
