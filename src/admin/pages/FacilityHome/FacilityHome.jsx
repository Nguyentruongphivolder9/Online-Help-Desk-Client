import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function FacilityHome({ children }) {
  return (
    <div>
      <nav className='bg-white border-b border-gray-200 fixed z-30 w-full '>
        <div className='flex items-center px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='w-full flex items-center justify-between'>
            <div className='w-64 items-center justify-start'>
              <Link
                to='/admin/home'
                className='flex justify-center cursor-pointer py-1.5 font-sans leading-relaxed antialiased'
              >
                <img
                  src='https://www.shorttermprograms.com/images/cache/600_by_314/uploads/institution-logos/harvard-university.png'
                  className='sm:h-9'
                  alt='Harvard Logo'
                />
              </Link>
            </div>
            <div className='flex items-center gap-x-3 mr-[30px]'>
              <span className='text-sm text-gray-700'>Facility -Header Page </span>
            </div>
          </div>
        </div>
      </nav>
      <div className='flex overflow-hidden w-full bg-white pt-16 justify-center '>{children}</div>
    </div>
  )
}
