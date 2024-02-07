import React from 'react'
import { Link } from 'react-router-dom'

import useLogout from '@/hooks/useLogout'

export default function HeaderAdmin() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="flex items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="w-full flex items-center justify-between">
          <div className="w-64 items-center justify-start">
            <Link to='/admin/home' className="flex justify-center cursor-pointer py-1.5 font-sans leading-relaxed antialiased">
              <img
                src='https://www.shorttermprograms.com/images/cache/600_by_314/uploads/institution-logos/harvard-university.png'
                className='sm:h-9'
                alt='Harvard Logo'
              />
            </Link>
          </div>
          <div className="flex items-center gap-x-3 mr-[30px]">
            <span className='text-sm text-gray-700'>Nguyen Phi</span>
            <div className="avatar dropdown dropdown-bottom dropdown-end">
              <div className="w-10 rounded-full" tabIndex={0} role="button">
                <img src="https://avatars3.githubusercontent.com/u/72724639?s=400&u=964a4803693899ad66a9229db55953a3dbaad5c6&v=4" />
              </div>
              <div tabIndex={0} className="dropdown-content w-44 h-24 px-5 py-3 bg-gray-100 rounded-lg shadow border mt-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="font-medium">
                    <button className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent ">
                      <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                      Account
                    </button>
                  </li>
                  <li className="font-medium ">
                    <button onClick={useLogout()} className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent">
                      <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                        </svg>
                      </div>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
