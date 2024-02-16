import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { getListAssignee } from '@/admin/apiEndpoints/dataAssignee.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'

export default function List() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(2)
  const [searchTerm, setSearchTerm] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])

  useEffect(() => {
    searchParams.set('page', page)
    searchParams.set('limit', limit)

    if (searchTerm) {
      searchParams.set('searchTerm', searchTerm)
    } else {
      searchParams.delete('searchTerm')
    }

    setSearchParams(searchParams)
  }, [searchTerm, page, limit])

  const { data: accountResponse, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['request/listAssignees', searchParamsObject],
    queryFn: async () => {
      const data = await getListAssignee(searchParamsObject)
      return data
    }
  })
  console.log(accountResponse)
  // console.log(searchParamsObject)

  const totalPage = calculateTotalPages(accountResponse?.data?.data.totalCount, limit)
  const totalPageArray = Array.from({ length: totalPage }, (_, index) => index + 1)

  const nextPage = () => {
    if (page === 5) return

    setPage(page + 1)
  }

  const previousPage = () => {
    if (page === 1) return

    setPage(page - 1)
  }

  const handleIncrement = () => {
    setLimit(limit + 5)
  }

  const handleDecrement = () => {
    if (limit > 0 && limit - 5 > 0) {
      setLimit(limit - 5)
    }
  }

  // const totalRequestCount = Number(accountResponse?.data?.data?.data?.totalCount) || 0
  // const limit = Number(accountResponse?.data?.data?.data?.limit)
  // const totalPage = Math.ceil(totalRequestCount / limit)

  return (
    <div className='max-w-7xl py-7 mx-auto px-5'>
      <div className='mb-3 py-2 xl:w-96'>
        <div className='relative mb-4 flex w-full flex-wrap items-stretch'>
          <input
            className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 '
            placeholder='Search here'
            type='text'
          />
          <span
            className='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200'
            id='basic-addon2'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
              <path
                fillRule='evenodd'
                d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
      </div>

      <div className='relative shadow-md sm:rounded-lg bg-white my-5'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
            <tr>
              <th scope='col' className='px-6 py-3 '>
                <span>STT</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>FullName</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Email</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Status</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {accountResponse?.data?.data?.items.map((assignee, index) => (
              <tr key={assignee.accountId} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                <th scope='row' className=' px-6 py-4'>
                  {' '}
                  {index + 1}
                </th>
                <th scope='row' className=' px-6 py-4 '>
                  {assignee.fullName}
                </th>
                <td className=' px-6 py-4'>{assignee.email}</td>
                <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                  {assignee.statusAccount}
                </td>
                <td className='max-w-[200px] min-w-[150px]'>
                  <div className='flex items-center'>
                    <Link
                      to={`/admin/facility-header/DetailsAssignee/${assignee.accountId}`}
                      className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                    >
                      View Detail
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <nav
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
            {!accountResponse &&
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
        </nav> */}
      </div>
    </div>
  )
}
