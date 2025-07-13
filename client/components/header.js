import React from 'react'
import Link from "next/link"
const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Sign Up", href: '/auth/signup' },
        !currentUser && { label: "Sign In", href: '/auth/signin' },
        currentUser && { label: "Sell Tickets", href: '/tickets/new' },
        currentUser && { label: "My Orders", href: '/orders' },
        currentUser && { label: "Sign Out", href: '/auth/signout' }
    ].filter(link => link != false).map((link) => {
        return <li key={link.href} className='nav-item'>
            <Link className='navbar-brand' href={link.href}>
                {link.label}
            </Link>
        </li>
    })
    return (
        <nav className='navbar navbar-light bg-light'>
            <Link className='navbar-brand' href='/'>
                PIA
            </Link>

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>

                </ul>
            </div>
        </nav>
    )
}

export default Header