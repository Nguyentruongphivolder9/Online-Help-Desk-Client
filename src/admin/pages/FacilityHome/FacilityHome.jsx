import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import useLogout from '@/hooks/useLogout'
import HeaderAdmin from '@/admin/components/HeaderAdmin'
import useAuthRedirect from '@/hooks/useAuthRedirect'
import LoadingOverlay from '@/common/components/LoadingOverlay'
import ButtonLogout from '@/common/components/ButtonLogout'

export default function FacilityHome({ children }) {
  const { accountId, isLoading } = useAuthRedirect('Facility-Heads')

  return (
    <>
      {isLoading ? (
        <LoadingOverlay opacity={'opacity-100'} />
      ) : (
        <div>
          <HeaderAdmin urlLogo='/admin/assignees' container='container' accountId={accountId} urlProfile={'/admin/facility-header/myProfile/'} />
          <div className='flex overflow-hidden bg-white'>
            <aside
              id='sidebar'
              className='fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75'
              aria-label='Sidebar'
            >
              <div className='relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0'>
                <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
                  <div className='flex-1 px-3 bg-white divide-y space-y-1'>
                    <ul className='space-y-2 pb-2'>
                      <li>
                        <NavLink
                          end
                          to='/admin/facility-header'
                          className={({ isActive }) => `${isActive ? 'text-white bg-sky-500' : 'text-gray-700'} text-base font-normal rounded-lg flex items-center py-2 px-2 hover:bg-blue-100 hover:text-gray-900 group`}
                          aria-current='page'
                        >
                          <svg
                            className='w-6 h-6 flex-shrink-0 group-hover:text-gray-900 transition duration-75'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              fillRule='evenodd'
                              d='M8 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2 1 1 0 1 0 0-2Zm2 5c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z'
                              clipRule='evenodd'
                            />
                          </svg>

                          <span className='ml-3'> Dashboard</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/admin/facility-header/listAssignee'
                          className={({ isActive }) => `${isActive ? 'text-white bg-sky-500' : 'text-gray-700'} text-base font-normal rounded-lg flex items-center py-2 px-2 hover:bg-blue-100 hover:text-gray-900 group`}
                        >
                          <svg
                            className='w-6 h-6flex-shrink-0 group-hover:text-gray-900 transition duration-75'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              fillRule='evenodd'
                              d='M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1c0-.6.4-1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <span className='ml-3 flex-1 whitespace-nowrap'>List Assignees</span>
                        </NavLink>
                      </li>
                      <div className='space-y-2 pt-2 w-full'>
                        <NavLink
                          to={`/admin/facility-header/myProfile/${accountId}`}
                          className={({ isActive }) => `${isActive ? 'text-white bg-sky-500' : 'text-gray-700'} text-base font-normal rounded-lg flex items-center py-2 px-2 hover:bg-blue-100 hover:text-gray-900 group`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0 group-hover:text-gray-900 transition duration-75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          <span className='ml-3 flex-1 whitespace-nowrap'>My Profile</span>
                        </NavLink>
                        <ButtonLogout />
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
            <div id='main-content' className='min-h-dvh pt-[72px] w-full bg-gray-50 relative overflow-y-auto ml-64 p-[20px]'>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
