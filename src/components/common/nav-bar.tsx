'use client'
import { ROUTES_VARIABLES } from '@/config/constants/route-variables'
import Image from 'next/image'
import VALKYRIELOGOLIGHT from '../../../public/svg/logo-valkyrie-light.svg'
import VALKYRIELOGOLDARK from '../../../public/svg/valkyrie-logo-dark.svg'
import { NavLink } from './nav-link'
import { useTheme } from 'next-themes'
import { ChooseTheme } from './choose-theme'
import { Profile } from '../modules/auth/profile'

export const Navbar = () => {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme || 'light'

  const links = [
    { name: 'Dashboard', href: ROUTES_VARIABLES.DASHBOARD },
    { name: 'Ficha Técnica', href: ROUTES_VARIABLES.DATASHEET },
    { name: 'Estruturas', href: ROUTES_VARIABLES.STRUCTURES }
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between ml-10 mr-10">
        <div className="flex items-center space-x-5">
          <Image
            priority
            src={currentTheme === 'light' ? VALKYRIELOGOLIGHT : VALKYRIELOGOLDARK}
            alt="LOGOTIPO DA APLICAÇÃO"
            width={120}
          />
          <nav className="flex items-center space-x-5">
            {links.map((link, index) => (
              <NavLink key={index} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-1">
          <ChooseTheme />
          <Profile />
        </div>
      </div>
    </header>
  )
}
