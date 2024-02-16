import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById, createProcessByAssignees } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'
import { Link, useSearchParams } from 'react-router-dom'

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
  })

  return (
    <>
      {data && (
        <div className='max-w-7xl py-7 mx-auto px-5'>
          <div className=''>
            <h1 className='text-l font-semibold leading-7 text-gray-900 py-5'>Ticket</h1>
            <p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
              Warning : Please check carefully full information of user before update anymore
            </p>
          </div>
          <form>
            <input
              className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
              type='hidden'
              value={data.id}
              readOnly
            />
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
                  <dt className='text-sm font-medium leading-6 text-gray-900'> Status Ticket : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                    type='text'
                    id='statusName'
                    value={data.requestStatus.statusName}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> Processing By AssigneesID : </dt>
                  <div>
                    {data.processByAssignees[0]?.account?.fullName != null ? (
                      <div className='flex items-center'>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                          type='text'
                          value={data.processByAssignees[0]?.account?.fullName}
                          readOnly
                        />
                      </div>
                    ) : (
                      <input
                        className='mt-1  text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'
                        type='text'
                        id='assigneeID'
                        placeholder='N/A - Assignee'
                      />
                    )}
                  </div>
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> </dt>
                  <div>
                    {data.processByAssignees[0]?.account?.fullName != null ? (
                      <div className='flex items-center'></div>
                    ) : (
                      <div className='flex items-center'>
                        <button className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'>
                          Update Process
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </dl>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
