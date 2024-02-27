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
        <LoadingOverlay opacity={1} />
      ) : (
        <div>
          <HeaderAdmin urlLogo='/admin/assignees' container='container' accountId={accountId} />
          <aside
            id='sidebar'
            className='fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75'
            aria-label='Sidebar'
          >
            <div className='relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0'>
              <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
                <div className='flex-1 px-3 bg-white divide-y space-y-1'>
                  <ul className='space-y-2 pb-2'>
                    <li>
                      <NavLink
                        to='/admin/facility-header'
                        className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group'
                      >
                        <svg
                          className='w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75'
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
                        className='text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group '
                      >
                        <svg
                          className='w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75'
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
                        <span className='ml-3 flex-1 whitespace-nowrap'>Assignee Management</span>
                      </NavLink>
                    </li>
                    <div className='space-y-2 pt-2 w-full'>
                      <ButtonLogout />
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
          <div className='flex overflow-hidden w-full bg-white pt-16 justify-center '>{children}</div>
        </div>
      )}
    </>
  )
}
