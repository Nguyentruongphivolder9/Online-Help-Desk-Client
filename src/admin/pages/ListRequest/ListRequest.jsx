import { getRequests, upateRequest } from '@/client/apiEndpoints/request.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const getColorClass = (statusName) => {
  switch (statusName) {
    case 'Open':
      return {
        background: 'bg-[#3300FF]',
        text: 'text-[#3300FF]', // Màu chữ trắng khi nền màu xanh
        borderColor: 'border-[#3300FF]'
      }
    case 'Assigned':
      return {
        background: 'bg-[#FFFF00]',
        text: 'text-[#FFFF00]',
        borderColor: 'border-[#FFFF00]'
      }
    case 'Work in progress':
      return {
        background: 'bg-[#FF6600]',
        text: 'text-[#FF6600]',
        borderColor: 'border-[#FF6600]'
      }
    case 'Need more info':
      return {
        background: 'bg-[#FF0033]',
        text: 'text-[#FF0033]',
        borderColor: 'border-[#FF0033]'
      }
    case 'Rejected':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    case 'Completed':
      return {
        background: 'bg-[#33FF33]',
        text: 'text-[#33FF33]',
        borderColor: 'border-[#33FF33]'
      }
    case 'Closed':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    default:
      return {
        background: 'bg-[#808080]',
        text: 'text-[#808080]',
        borderColor: 'border-[#808080]'
      }
  }
}

export default function ListRequest() {
  const queryClient = useQueryClient()
  // const [searchParamsObject, setSearchParamsObject] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()

  const searchParamsObject = Object.fromEntries([...searchParams])

  if (searchParamsObject.page === undefined) {
    searchParamsObject.page = 1
  }

  if (searchParamsObject.limit === undefined) {
    searchParamsObject.limit = 2
  }
  console.log(searchParamsObject)
  const requestsQuery = useQuery({
    queryKey: ['requests', searchParamsObject],
    queryFn: () => getRequests(searchParamsObject)
  })

  console.log(requestsQuery?.data)

  const totalRequestCount = Number(requestsQuery?.data?.data?.data?.totalCount) || 0
  const limit = Number(requestsQuery?.data?.data?.data?.limit)
  const totalPage = Math.ceil(totalRequestCount / limit)
  console.log(totalPage)

  const updateRequestMutation = useMutation({
    mutationFn: (body) => upateRequest(body)
  })

  const handleUpdateRequest = (objectData) => {
    updateRequestMutation.mutate(objectData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['requests'] })
        console.log('Update successfully')
      },
      onError: () => {
        console.log('Failed')
      }
    })
  }

  // const handleSort = (e) => {
  //   let sortColumn = searchParams.get('sortColumn')
  //   let sortOrder = searchParams.get('sortOrder') || 'asc'
  //   sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  //   setSearchParamsObject((prev) => ({ ...prev, sortColumn: sortColumn, sortOrder: sortOrder }))
  //   console.log({ ...searchParamsObject, sortColumn, sortOrder })
  //   console.log(searchParamsObject)
  //   setSearchParams({ ...searchParamsObject, sortColumn, sortOrder })
  // }

  return (
    <div className='max-w-7xl mx-auto px-5'>
      <Link
        className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
        to={'/client/request/archived'}
      >
        View archived requests
      </Link>
      <div className='relative shadow-md sm:rounded-lg bg-white my-5'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-3 max-w-[300px]'>
                <Link
                  to={`/client/request/?sortColumn=department&sortOrder=asc`}
                  onClick={() => handleSort()}
                  className='flex justify-between'
                >
                  <span>Department (Room)</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' />
                  </svg>
                </Link>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Level</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Description</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Reason</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Status</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3' />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Action</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {requestsQuery.data?.data?.data.items
              .filter((request) => request.enable)
              .map((request) => (
                <tr
                  key={request.id}
                  className={`border-l-4 ${getColorClass(request?.requestStatus?.statusName).borderColor}  hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  <th
                    scope='row'
                    className=' px-6 py-4 font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis uppercase'
                  >
                    {request.room.departments.departmentName} ({request.room.roomNumber})
                  </th>
                  <td className=' px-6 py-4'>{request.severalLevel}</td>
                  <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    {request.description}
                  </td>
                  <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>{request.reason}</td>
                  <td>
                    <div
                      className={`relative  grid items-center p-1 justify-center font-sans text-xs font-bold 
                      ${request?.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(request?.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                    >
                      {request?.requestStatus?.statusName}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis '>
                    {request?.processByAssignees[0]?.account?.fullName != null
                      ? request?.processByAssignees[0]?.account?.fullName
                      : 'N/A'}
                  </td>
                  <td className='max-w-[200px] min-w-[150px]'>
                    {request?.requestStatus?.statusName === 'Open' &&
                      request?.processByAssignees[0]?.account?.fullName == null ? (
                      <div className='flex items-center'>
                        <Link
                          to={`/client/request/${request.id}`}
                          className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                        >
                          View
                        </Link>
                        {['Completed', 'Rejected', 'Closed'].includes(request?.requestStatus?.statusName) ? (
                          <button
                            onClick={() =>
                              handleUpdateRequest({
                                id: request?.id,
                                accountId: request?.account?.accountId,
                                requestStatusId: null,
                                enable: !request?.enable
                              })
                            }
                            className='inline-flex items-center px-2 py-2 ml-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                          >
                            Archive
                          </button>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <nav
          className='flex items-center flex-column flex-wrap md:flex-row justify-between p-4 mt-2'
          aria-label='Table navigation'
        >
          <span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
            Showing <span className='font-semibold text-gray-900 dark:text-white'>1-10</span> of{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>1000</span>
          </span>
          <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
            <li>
              {page === 1 ? (
                <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                  Previous
                </span>
              ) : (
                <Link
                  className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                  to={`/admin/facility-header/ListRequest?page=${page - 1}&limit=${searchParamsObject.limit}`}
                >
                  Previous
                </Link>
              )}
            </li>
            {!requestsQuery.isLoading &&
              Array(totalPage)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <li key={pageNumber}>
                      <Link
                        to={`/admin/facility-header/ListRequest?page=${pageNumber}&limit=${searchParamsObject.limit}`}
                        className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      >
                        {pageNumber}
                      </Link>
                    </li>
                  )
                })}

            <li>
              {page === totalPage ? (
                <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                  Next
                </span>
              ) : (
                <Link
                  className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                  to={`/admin/facility-header/ListRequest?page=${page + 1}&limit=${searchParamsObject.limit}`}
                >
                  Next
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}