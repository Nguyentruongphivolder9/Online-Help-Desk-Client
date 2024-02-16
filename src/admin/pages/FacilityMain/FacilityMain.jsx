import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getRequestByStatusOfFacility } from '@/admin/apiEndpoints/dataRequest.api'

export default function facilityMain() {
  const { data: requestStatusResponse, isLoading } = useQuery({
    queryKey: ['request/getRequestByStatusOfFacility'],
    queryFn: async () => {
      const data = await getRequestByStatusOfFacility()
      return data
    }
  })
  console.log(requestStatusResponse?.data?.data)
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:py-10 lg:px-8'>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl px-24 py-7'>
          Summary of Facility Header
        </h2>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4'>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Total Request </dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>1.6M</dd>
                <Link
                  to='/admin/facility-header/ListRequest'
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Open Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>19.2K</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[0].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Assigned Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>4.9K</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[1].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Work in progress</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>166.7K</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[2].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4'>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Rejected </dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>1.6M</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[4].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Completed</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>19.2K</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[5].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Need more info</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>4.9K</dd>
                <Link
                  to={`/admin/facility-header/ListRequest/${requestStatusResponse?.data?.data?.[3].id}`}
                  className='text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                >
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
                </Link>
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
