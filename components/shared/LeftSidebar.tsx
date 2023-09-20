'use client'

import React from 'react'
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { SignOutButton, SignedIn } from '@clerk/clerk-react'

const LeftSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
          // if (link.route === '/profile') link.route = `${link.route}/${userId}`

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link hover:bg-primary-500 ${isActive && 'bg-primary-500'}`}
            >
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className='cursor-pointer hover:bg-primary-500 relative flex justify-start gap-4 rounded-lg p-4'>
              <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />

              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar
