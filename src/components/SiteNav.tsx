import { useEffect, useRef, useState } from 'react'
import { NavLink as RouterNavLink } from 'react-router'
import { siteRoutes, type SiteRoute } from '../routes'

type NavLinkProps = {
    to: SiteRoute
    children: string
    onClick: () => void
    end?: boolean
}

function NavLink({ to, children, onClick, end = true }: NavLinkProps) {
    return (
        <RouterNavLink
            to={to}
            end={end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={onClick}
        >
            {children}
        </RouterNavLink>
    )
}

export default function SiteNav() {
    const navRef = useRef<HTMLElement>(null)
    const mobileNavToggleRef = useRef<HTMLButtonElement>(null)
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    function closeMobileNav() {
        setMobileNavOpen(false)
    }

    useEffect(() => {
        if (!mobileNavOpen) {
            return
        }

        function closeOnOutsideClick(event: PointerEvent) {
            if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
                closeMobileNav()
            }
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                closeMobileNav()
                mobileNavToggleRef.current?.focus()
            }
        }

        document.addEventListener('pointerdown', closeOnOutsideClick)
        document.addEventListener('keydown', closeOnEscape)

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [mobileNavOpen])

    return (
        <header className='site-navigation position-fixed top-0 start-0 w-100 z-2'>
            <nav ref={navRef} className='site-nav nav-pills m-3 text-bg-primary rounded-1' aria-label='Primary navigation'>
                <div className='site-nav-heading'>
                    <span className='site-nav-name'>Santtu Nurmi</span>
                    <button
                        ref={mobileNavToggleRef}
                        className='site-nav-toggle navbar-toggler p-2'
                        type='button'
                        aria-controls='primary-navigation-links'
                        aria-expanded={mobileNavOpen}
                        aria-label='Toggle navigation'
                        onClick={() => setMobileNavOpen((open) => !open)}
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                </div>
                <div className={`site-nav-links nav${mobileNavOpen ? ' site-nav-links--open' : ''}`} id='primary-navigation-links'>
                    <NavLink to={siteRoutes.home} onClick={closeMobileNav}>Portfolio</NavLink>
                    <NavLink to={siteRoutes.educationAndWork} onClick={closeMobileNav}>Education &amp; Work</NavLink>
                    <NavLink to={siteRoutes.blog} onClick={closeMobileNav} end={false}>Blog</NavLink>
                    <NavLink to={siteRoutes.hobbies} onClick={closeMobileNav}>Hobbies</NavLink>
                    <a className='nav-link' href='/content/CV.pdf' target='_blank' rel='noopener noreferrer' onClick={closeMobileNav}>
                        Download CV
                    </a>
                </div>
            </nav>
        </header>
    )
}
