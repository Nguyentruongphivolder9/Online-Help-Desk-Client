import React from 'react'
import { Link, NavLink } from 'react-router-dom'
export default function Navbar() {
  return (
    <nav className='border-gray-200 h-full px-4 lg:px-6 py-2.5 flex-1'>
      <div
        className='hidden justify-between items-center h-full w-full lg:flex lg:w-auto lg:order-1'
        id='mobile-menu-2'
      >
        <ul className='flex flex-col h-full items-center mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0'>
          <li className='h-full flex items-center'>
            <NavLink
              to={'/'}
              end
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500' : 'text-gray-700'}`
              }
              aria-current='page'
            >
              Home
            </NavLink>
          </li>
          <li className='h-full flex items-center'>
            <NavLink
              end
              to={'/client/request'}
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500 hover:text-black' : 'text-gray-700'} `
              }
            >
              List Request
            </NavLink>
          </li>
          <li className='h-full flex items-center'>
            <NavLink
              to={'/client/request/add'}
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500 hover:text-black' : 'text-gray-700'} `
              }
            >
              Make a Request
            </NavLink>
          </li>
          <li className='h-full flex items-center'>
            <NavLink
              to={'/messages'}
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500 hover:text-black' : 'text-gray-700'} `
              }
            >
              Messages
            </NavLink>
          </li>

          <li className='h-full flex items-center'>
            <NavLink
              to={'/client/about'}
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500 hover:text-black' : 'text-gray-700'} `
              }
            >
              About
            </NavLink>
          </li>
          <li className='h-full flex items-center'>
            <NavLink
              to={'/client/contact'}
              className={({ isActive }) =>
                `h-full flex items-center py-2 pr-4 pl-3 rounded hover:text-black hover:bg-sky-200 ${isActive ? 'text-white bg-sky-500 hover:text-black' : 'text-gray-700'} `
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
