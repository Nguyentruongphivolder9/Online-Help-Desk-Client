import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'
import { TESelect } from 'tw-elements-react'

export default function SingleRequestById() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  const requestQuery = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const data = await getSingleRequestById(id.toUpperCase())
      return data
    }
  })
  console.log(requestQuery.data?.data?.data)

  useEffect(() => {
    setData(requestQuery.data?.data?.data)
  }, [])

  return (
    <>
      {data && (
        <div>
          <div className='px-3 sm:px-0'>
            <h1 className='text-l font-semibold leading-7 text-gray-900 py-2'>Ticket</h1>
          </div>
          <div className='mt-5  border-t border-gray-100'>
            <dl className='divide-y divide-gray-100'>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Name of End-User : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.account.fullName}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Email of End-User : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.account.email}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Department : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.room.departments.departmentName}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Room of Department : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.room.roomNumber}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Description : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.description}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'> Level : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.severalLevel}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'> CreateAt : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={data.createdAt}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'> CreateAt : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                  type='text'
                  value={2}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'> ProcessByAssignees : </dt>
                <div className='flex justify-center'>
                  {/* <div className='relative mb-3 md:w-96 pt-5'>
                    <TESelect
                      data={data.processByAssignees?.account?.fullName}
                      placeholder='Example placeholder'
                      preventFirstSelection
                    />
                  </div> */}
                </div>
              </div>
            </dl>
          </div>
        </div>
      )}
    </>
  )
}
