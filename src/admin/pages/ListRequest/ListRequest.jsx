import React, { useEffect, useState } from 'react'
import { useQuery, QueryClient } from '@tanstack/react-query'
import { useConvertDate } from '@/utils/useConvertDate'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getRequest } from '@/admin/apiEndpoints/dataRequest.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'

export default function List() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  if (searchParamsObject.page === undefined) {
    searchParamsObject.page = 1
  }

  if (searchParamsObject.limit === undefined) {
    searchParamsObject.limit = 1
  }

  const { data: RequestResponse, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['request/getall'],
    queryFn: async () => {
      const data = await getRequest(searchParamsObject)
      return data
    }
  })

  return (
    <div className=' container shadow-md sm:rounded-lg bg-white mt-12 mb-12'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              ID
            </th>
            <th scope='col' className='px-6 py-3'>
              Description
            </th>
            <th scope='col' className='px-6 py-3'>
              Several Level
            </th>
            <th scope='col' className='px-6 py-3'>
              Reason
            </th>
            <th scope='col' className='px-6 py-3'>
              Created At
            </th>
            <th scope='col' className='px-6 py-3'>
              Request Status
            </th>
            <th scope='col' className='px-6 py-3'>
              Assignee
            </th>
          </tr>
        </thead>
        <tbody>
          {RequestResponse &&
            RequestResponse.data.data.items.map((item) => (
              <tr
                key={item.id}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <td className='px-6 py-4'>{item.id}</td>
                <td className='px-6 py-4'>{item.description}</td>
                <td className='px-6 py-4'>{item.severalLevel}</td>
                <td className='px-6 py-4'>{item.reason}</td>
                <td className='px-6 py-4'> {useConvertDate(item.createdAt)}</td>
                <td className='px-6 py-4'>{item.requestStatus.statusName}</td>
                <td className='px-6 py-4'>{item.processByAssignees[0]?.account.fullName}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <nav
        className='flex items-center flex-column flex-wrap md:flex-row justify-between pt-4'
        aria-label='Table navigation'
      >
        <span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
          Showing <span className='font-semibold text-gray-900 dark:text-white'>1-10</span> of{' '}
          <span className='font-semibold text-gray-900 dark:text-white'>1000</span>
        </span>
        <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700'
            >
              Previous
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
            >
              1
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              2
            </a>
          </li>
          <li>
            <a
              href='#'
              aria-current='page'
              className='flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
            >
              3
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              4
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              5
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
