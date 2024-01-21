import React from 'react'
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 flex-1'>
      <div className='hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1' id='mobile-menu-2'>
        <ul className='flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0'>
          <li>
            <Link
              to={'/'}
              className='block py-2 pr-4 pl-3 text-gray-700 rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white'
              aria-current='page'
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={'/client/request'}
              className='block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
            >
              List Request
            </Link>
          </li>
          <li>
            <Link
              to={'/client/request/add'}
              className='block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
            >
              Make a Request
            </Link>
          </li>

          <li>
            <Link
              to={'/client/about'}
              className='block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={'/client/contact'}
              className='block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
