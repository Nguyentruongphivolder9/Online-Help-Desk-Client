import { getDepartments, getRequestStatus, getRequests, upateRequest } from '@/client/apiEndpoints/request.api'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import getColorClass from '@/hooks/useGetColorRequestStatus'
import useAuthRedirect from '@/hooks/useAuthRedirect'
export default function ListRequest() {
  const { accountId, isLoading } = useAuthRedirect('End-Users')
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchParamsObjectState, setSearchParamsObjectState] = useState(Object.fromEntries([...searchParams]))

  if (searchParamsObjectState.page === undefined) {
    searchParamsObjectState.page = 1
  }

  if (searchParamsObjectState.limit === undefined) {
    searchParamsObjectState.limit = 2
  }
  const requestsQuery = useQuery({
    queryKey: ['requests', searchParamsObjectState],
    queryFn: () => getRequests(searchParamsObjectState),
    placeholderData: keepPreviousData
  })

  console.log(requestsQuery?.data?.data?.data)

  const departmentQuery = useQuery({
    queryKey: ['departmentClientRequest'],
    queryFn: async () => {
      const data = await getDepartments()
      console.log('department', data)
      return data
    }
  })

  const requestStatusQuery = useQuery({
    queryKey: ['requestStatusClientQuery'],
    queryFn: async () => {
      const data = await getRequestStatus()
      console.log('status', data)
      return data
    }
  })

  useEffect(() => {
    const currentSearchParams = Object.fromEntries([...searchParams])
    setSearchParamsObjectState((prev) => ({ ...prev, ...currentSearchParams }))
  }, [searchParams])

  const totalRequestCount = Number(requestsQuery?.data?.data?.data.totalCount) || 0
  const limit = Number(requestsQuery?.data?.data?.data.limit)
  const totalPage = Math.ceil(totalRequestCount / limit)

  const updateRequestMutation = useMutation({
    mutationFn: (body) => upateRequest(body)
  })

  const handleUpdateRequest = (objectData) => {
    updateRequestMutation.mutate(objectData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['requests', searchParamsObjectState] })
        setSearchParamsObjectState((prev) => ({ ...prev }))
        console.log('Update successfully')
      },
      onError: () => {
        console.log('Failed')
      }
    })
  }

  const addParams = (ArrayObSearchParams) => {
    setSearchParams((searchParams) => {
      ArrayObSearchParams.forEach((objSearchParam, index) => {
        let keyCondition = Object.keys(objSearchParam)[0]
        let valueCondition = Object.values(objSearchParam)[0]

        if (keyCondition === 'sortOrder') {
          if (searchParams.get('sortOrder') == null || searchParams.get('sortOrder') == undefined) {
            searchParams.delete('sortOrder')
          } else if (searchParams.get('sortOrder') === 'asc') {
            valueCondition = 'desc'
          } else {
            valueCondition = 'asc'
          }
        }

        // check case empty on search input and delete url params
        if (keyCondition === 'searchTerm' && valueCondition === '') {
          searchParams.delete('searchTerm')
          setSearchParamsObjectState((prev) => ({ ...prev, searchTerm: '' }))
          return searchParams
        }

        if (keyCondition === 'fCondition' && valueCondition === '') {
          searchParams.delete('fCondition')
          setSearchParamsObjectState((prev) => ({ ...prev, fCondition: '' }))
          return searchParams
        }
        if (keyCondition === 'sCondition' && valueCondition === '') {
          searchParams.delete('sCondition')
          setSearchParamsObjectState((prev) => ({ ...prev, sCondition: '' }))
          return searchParams
        }
        if (keyCondition === 'tCondition' && valueCondition === '') {
          searchParams.delete('tCondition')
          setSearchParamsObjectState((prev) => ({ ...prev, tCondition: '' }))
          return searchParams
        }

        // chuyển về trang đầu tiên khi sort search filter, nhấn paginated button thì không (bug trống trang)
        if (keyCondition == 'page' && valueCondition) {
          searchParams.set(keyCondition, valueCondition)
          return searchParams
        }

        console.log(keyCondition, valueCondition)

        searchParams.set('page', 1)
        searchParams.set(keyCondition, valueCondition)
      })
      return searchParams
    })
  }
  return (
    <div className='max-w-7xl mx-auto p-5 my-10 border border-slate-100 shadow-lg bg-white rounded-lg'>
      <Link
        className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:ring-4 focus:ring-blue-200'
        to={'/client/request/archived'}
      >
        View archived requests
      </Link>
      <h1 className='text-gray-900 text-xl font-bold capitalize text-center mb-4'>List Requests</h1>
      <div className='flex items-center justify-end mt-4'>
        {/* Limit section */}
        <div className='flex items-center flex-1'>
          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn min-h-10 h-10 focus:border-sky-500 hover:bg-sky-500 hover:text-white 
            ${searchParamsObjectState.limit ? 'bg-sky-500 text-white' : ''}`}
            >
              Show
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                />
              </svg>
            </div>
            <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black'>
              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ limit: 5 }])}
                >
                  Default (5)
                </div>
              </li>
              <li>
                <div onClick={() => addParams([{ limit: 7 }])}>Show 7</div>
              </li>

              <li>
                <div onClick={() => addParams([{ limit: 9 }])}>Show 9</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Filter section */}
        <div className='flex items-center'>
          {/* Icon  */}
          <div className='relative inline-block tooltip tooltip-top' data-tip='Filter'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 text-sky-500'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
              />
            </svg>
          </div>

          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn m-1 min-h-10 h-10 focus:border-sky-500 hover:bg-sky-500 hover:text-white 
              ${searchParamsObjectState.fCondition ? 'bg-sky-500 text-white' : ''}`}
            >
              Department
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2  shadow bg-base-100 rounded-box w-52 text-black'
            >
              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ fCondition: '' }])}
                >
                  None
                </div>
              </li>
              {departmentQuery?.data &&
                departmentQuery?.data?.data?.data.map((item) => (
                  <li key={item.id}>
                    <div
                      className='border border-white hover:bg-sky-500 hover:text-white'
                      onClick={() => addParams([{ fCondition: item.departmentName }])}
                    >
                      {item.departmentName}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn m-1 min-h-10 h-10 focus:border-sky-500 hover:bg-sky-500 hover:text-white 
            ${searchParamsObjectState.sCondition ? 'bg-sky-500 text-white' : ''}`}
            >
              Level
            </div>
            <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black'>
              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ sCondition: '' }])}
                >
                  None
                </div>
              </li>
              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ sCondition: 'Normal' }])}
                >
                  Normal
                </div>
              </li>

              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ sCondition: 'Important' }])}
                >
                  Important
                </div>
              </li>
            </ul>
          </div>
          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn m-1 min-h-10 h-10 focus:border-sky-500 hover:bg-sky-500 hover:text-white 
            ${searchParamsObjectState.tCondition ? 'bg-sky-500 text-white' : ''}`}
            >
              Status
            </div>
            <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black'>
              <li>
                <div
                  className='border border-white hover:bg-sky-500 hover:text-white'
                  onClick={() => addParams([{ tCondition: '' }])}
                >
                  None
                </div>
              </li>

              {requestStatusQuery?.data &&
                requestStatusQuery?.data?.data?.data.map((item) => (
                  <li key={item.id}>
                    <div
                      className='border border-white hover:bg-sky-500 hover:text-white'
                      onClick={() => addParams([{ tCondition: item.statusName }])}
                    >
                      {item.statusName}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Search input */}
        <div className='relative ml-8'>
          <div className='absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none'>
            <svg
              className='w-5 h-5 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              ></path>
            </svg>
          </div>
          <input
            type='text'
            id='table-search'
            className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none'
            placeholder='Search for items'
            value={searchParamsObjectState.searchTerm ?? ''}
            onChange={(e) => addParams([{ searchTerm: e.target.value }])}
          />
        </div>
      </div>

      <div className='relative shadow-md sm:rounded-lg bg-white mt-12'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3 max-w-[300px] select-none'>
                <div
                  // to={`/client/request/?sortColumn=department&sortOrder=asc`}
                  onClick={() => addParams([{ sortColumn: 'department' }, { sortOrder: 'asc' }])}
                  className='flex justify-between cursor-pointer'
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
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 select-none'>
                <div
                  className='flex justify-between cursor-pointer'
                  onClick={() => addParams([{ sortColumn: 'level' }, { sortOrder: 'asc' }])}
                >
                  <span>Severity Level</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 select-none'>
                <div
                  className='flex justify-between cursor-pointer'
                  onClick={() => addParams([{ sortColumn: 'description' }, { sortOrder: 'asc' }])}
                >
                  <span>Description</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 select-none'>
                <div
                  className='flex justify-between cursor-pointer'
                  onClick={() => addParams([{ sortColumn: 'reason' }, { sortOrder: 'asc' }])}
                >
                  <span>Reason</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 select-none'>
                <div
                  className='flex justify-between cursor-pointer'
                  onClick={() => addParams([{ sortColumn: 'status' }, { sortOrder: 'asc' }])}
                >
                  <span>Status</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                    />
                  </svg>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 select-none'>
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
                    className='py-4 font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis uppercase'
                  >
                    <span className='ml-6'>
                      {request.room.departments.departmentName} ({request.room.roomNumber})
                    </span>
                  </th>
                  <td className='py-4'>{request.severalLevel}</td>
                  <td className='py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>{request.description}</td>
                  <td className='py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>{request.reason}</td>
                  <td className='py-4'>
                    <span
                      className={`grid items-center max-w-[150px] p-1 justify-center font-sans text-xs font-bold 
                      ${request?.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(request?.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                    >
                      {request?.requestStatus?.statusName}
                    </span>
                  </td>
                  <td className=''>
                    <div className='flex items-center justify-evenly'>
                      <Link
                        to={`/client/request/${request.id}`}
                        className='items-center px-5 py-2 text-sm font-medium text-center text-white bg-sky-500 hover:bg-sky-600 rounded-lg focus:ring-4 focus:ring-primary-200'
                      >
                        View
                      </Link>
                      <div
                        className={`tooltip tooltip-right before:translate-y-[-80%] after:translate-y-[-120%] cursor-pointer
                        ${
                          ['Completed', 'Rejected', 'Closed'].includes(request?.requestStatus?.statusName)
                            ? 'visible'
                            : 'invisible'
                        }`}
                        data-tip='Archive'
                        onClick={() =>
                          handleUpdateRequest({
                            id: request?.id,
                            accountId: request?.account?.accountId,
                            requestStatusId: null,
                            enable: !request?.enable
                          })
                        }
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6 text-sky-500'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                          />
                        </svg>
                      </div>
                    </div>
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
            Showing{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>1-{searchParamsObjectState.limit}</span> of{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>{totalRequestCount}</span>
          </span>
          <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
            <li>
              {searchParamsObjectState.page == 1 ? (
                <span
                  href='#'
                  className='cursor-not-allowed select-none flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700'
                >
                  Previous
                </span>
              ) : (
                <button
                  href='#'
                  className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700'
                  onClick={() => addParams([{ page: +searchParamsObjectState.page - 1 }])}
                >
                  Previous
                </button>
              )}
            </li>
            {!requestsQuery.isLoading &&
              Array(totalPage)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1
                  const isActive = Number(searchParamsObjectState.page) == pageNumber
                  return (
                    <li key={pageNumber}>
                      <button
                        className={` ${isActive ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-500'} flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                        onClick={() => addParams([{ page: pageNumber }])}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}

            <li>
              {searchParamsObjectState.page == totalPage ? (
                <span
                  href='#'
                  className=' cursor-not-allowed select-none flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
                >
                  Next
                </span>
              ) : (
                <button
                  href='#'
                  className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
                  onClick={() => addParams([{ page: +searchParamsObjectState.page + 1 }])}
                >
                  Next
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
