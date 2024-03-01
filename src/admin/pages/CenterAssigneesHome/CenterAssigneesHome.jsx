import { getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import React, { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useParams, Outlet, useOutletContext, NavLink } from 'react-router-dom'

export default function CenterAssigneesHome() {
  const [connect, joinSpecificChatRoom, infoConnectState, setInfoConnectState, listRemarkState, setListRemarkState] =
    useOutletContext()
  const [requestObjectById, setRequestObjectById] = useState(null)
  const [reloadRequest, setReloadRequest] = useState(null)
  const { id: requestId } = useParams()

  const { data: getRequestById } = useQuery({
    queryKey: ['getRequestById', requestId, reloadRequest],
    queryFn: async () => {
      const data = await getSingleRequestById(requestId)
      return data
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    setRequestObjectById(getRequestById?.data?.data)
  }, [getRequestById])

  return (
    <>
      {requestObjectById && (
        <div className='w-full h-full'>
          <div className='flex flex-row justify-between items-center border-b border-solid border-gray-300 p-2'>
            <div>
              <div className='flex flex-row justify-center items-center border border-solid rounded-sm'>
                <NavLink
                  end
                  to={`/admin/assignees/requests/${requestObjectById.id}`}
                  className={({ isActive }) =>
                    `text-md px-4 py-1 rounded-sm cursor-pointer ${isActive ? 'text-white bg-blue-500' : 'text-gray-500'}`
                  }
                  aria-current='page'
                >
                  Details
                </NavLink>
                <NavLink
                  to={`/admin/assignees/requests/${requestObjectById.id}/remark`}
                  className={({ isActive }) =>
                    `text-md px-4 py-1 rounded-sm cursor-pointer ${isActive ? 'text-white bg-blue-500' : 'text-gray-500'}`
                  }
                >
                  Remark
                </NavLink>
              </div>
            </div>
            <div className='flex flex-row gap-3 items-center'>
              <div className='flex flex-col text-end'>
                <div className='text-gray-600 text-md'>{requestObjectById.account.fullName}</div>
                <div className='text-gray-600 text-sm '>{requestObjectById.account.role.roleName}</div>
              </div>
              <div>
                {requestObjectById.account.avatarPhoto != null ? (
                  <img
                    src={`https://storeimageohd.blob.core.windows.net/images/${requestObjectById.account.avatarPhoto}`}
                    alt={requestObjectById.account.fullName}
                    className='relative inline-block h-11 w-11 !rounded-full object-cover object-center'
                  />
                ) : (
                  <div className='relative flex h-11 w-11 bg-gray-200 rounded-full object-cover object-center shadow justify-center items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='h-[calc(100%-61px)] overflow-y-scroll hide-scrollbar'>
            <Outlet
              context={[
                connect,
                joinSpecificChatRoom,
                infoConnectState,
                setInfoConnectState,
                listRemarkState,
                setListRemarkState,
                requestObjectById,
                setReloadRequest
              ]}
            ></Outlet>
          </div>
        </div>
      )}
    </>
  )
}
