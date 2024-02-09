import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTotalRequest, getAssignee } from '@/admin/apiEndpoints/dataAssignee.api'
import { useParams } from 'react-router-dom'
import { useConvertDate } from '@/hooks/useConvertDate'

export default function List() {
  const { id } = useParams()
  const { data: totalResponse } = useQuery({
    queryKey: ['request/getTotalRequestAssignee'],
    queryFn: async () => {
      const data = await getTotalRequest(id)
      return data
    }
  })

  const { data: getAssigneeId } = useQuery({
    queryKey: ['request/getAssigneeId'],
    queryFn: async () => {
      const data = await getAssignee(id)
      return data
    }
  })

  console.log(getAssigneeId?.data)

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:py-10 lg:px-8'>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl px-24 py-7'>
          All Detail Ticket of Assignee
        </h2>

        <div className='bg-white border border-4 rounded-lg shadow m-1'>
          <div className='p-6 space-y-6'>
            <form action='#'>
              <div className='grid grid-cols-6 gap-6'>
                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                    Full Name :
                  </label>
                  <input
                    type='text'
                    name='product-name'
                    id='product-name'
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                    value={getAssigneeId?.data?.data?.fullName}
                    readOnly
                  />
                </div>
                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='category' className='text-sm font-medium text-gray-900 block mb-2'>
                    Email :
                  </label>
                  <input
                    type='text'
                    name='category'
                    id='category'
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                    value={getAssigneeId?.data?.data?.email}
                    readOnly
                  />
                </div>
                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='brand' className='text-sm font-medium text-gray-900 block mb-2'>
                    Phone :
                  </label>
                  <input
                    type='text'
                    name='brand'
                    id='brand'
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                    value={getAssigneeId?.data?.data?.phoneNumber}
                    readOnly
                  />
                </div>
                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='price' className='text-sm font-medium text-gray-900 block mb-2'>
                    Worked Experience :
                  </label>
                  <input
                    type='text'
                    name='price'
                    id='price'
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                    value={useConvertDate(getAssigneeId?.data?.data?.createdAt)}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4'>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Total Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>{totalResponse?.data?.data}</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Assigned Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>19.2K</dd>
                <input type='hidden' value={'Assigned'} readOnly />
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Work In Process</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>4.9K</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Complete</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>166.7K</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4'>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Need more info </dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>1.6M</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Rejected Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>19.2K</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Closed Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>4.9K</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-rose-600 truncate'>Pending Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-rose-600'>166.7K</dd>
                <a href='' class='text-indigo-500 border border-indigo-200 py-1 px-2 rounded inline-flex items-right'>
                  View
                  <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    class='w-4 h-4 ml-3'
                  >
                    <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                  </svg>
                </a>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
