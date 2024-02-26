import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTotalRequestByAssignee, getDetailAssignee } from '@/admin/apiEndpoints/dataAssignee.api'
import { useParams, Link } from 'react-router-dom'

export default function DetailsAss() {
  const { id } = useParams()

  const { data: getAssigneeId } = useQuery({
    queryKey: ['request/getAssigneeId'],
    queryFn: async () => {
      const data = await getDetailAssignee(id)
      return data
    }
  })

  const { data: totalResponse } = useQuery({
    queryKey: ['request/getTotalRequestAssignee'],
    queryFn: async () => {
      const data = await getTotalRequestByAssignee(id)
      return data
    }
  })

  return (
    <div className=' overflow-hidden bg-white px-80  w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:py-10 lg:px-8'>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-500 sm:text-4xl px-60 py-7'>
          Details Of the Assignee
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
                    value={getAssigneeId?.data?.data?.fullName || ''}
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
                    value={getAssigneeId?.data?.data?.email || ''}
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
                    value={getAssigneeId?.data?.data?.phoneNumber || ''}
                    readOnly
                  />
                </div>
                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='price' className='text-sm font-medium text-gray-900 block mb-2'>
                    AccountId :
                  </label>
                  <input
                    type='text'
                    name='price'
                    id='price'
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                    value={getAssigneeId?.data?.data?.accountId || ''}
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
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {totalResponse?.data?.data?.all}
                </dd>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Assigned Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {' '}
                  {totalResponse?.data?.data?.assigned}
                </dd>
                <input type='hidden' value={'Assigned'} readOnly />
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Work In Process</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {totalResponse?.data?.data?.workInProgress}
                </dd>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Complete</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {' '}
                  {totalResponse?.data?.data?.complete}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4'>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Need more info </dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {' '}
                  {totalResponse?.data?.data?.needMoreInfo}
                </dd>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>Rejected Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-indigo-600'>
                  {' '}
                  {totalResponse?.data?.data?.rejected}
                </dd>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-rose-600 truncate'>Pending Request</dt>
                <dd className='mt-1 text-3xl leading-9 font-semibold text-rose-600'>
                  {' '}
                  {totalResponse?.data?.data?.pending}
                  <Link
                    to={`/admin/facility-header/AllPendingRequestOfAssignee/${id}`}
                    className='text-xs text-rose-600 font-normal  flex   '
                  >
                    See more
                    <svg
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      className='w-4 h-4 ml-3'
                    >
                      <path d='M14 5l7 7m0 0l-7 7m7-7H3 flex'></path>
                    </svg>
                  </Link>
                </dd>
              </dl>
            </div>
          </div>
          <div className='bg-white overflow-hidden shadow sm:rounded-lg '>
            <div className=' sm:p-9 bg-gray-200'>
              <dl>
                <dt className='text-sm leading-5 font-medium text-gray-500 truncate'>
                  <Link
                    to={`/admin/facility-header/ListRequestOfAssignees/${getAssigneeId?.data?.data?.accountId}`}
                    className='text-base text-gray-900 font-bold rounded-lg flex items-center p-2 hover:bg-gray-00 group'
                  >
                    See more
                    <svg
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      className='w-4 h-4 ml-3'
                    >
                      <path d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
                    </svg>
                  </Link>
                </dt>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
