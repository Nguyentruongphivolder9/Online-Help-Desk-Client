import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById, createProcessByAssignees } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'
import { Link, useSearchParams } from 'react-router-dom'

const getColorClass = (statusName) => {
  switch (statusName) {
    case 'Open':
      return {
        background: 'bg-[#3300FF]',
        text: 'text-[#3300FF]',
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

export default function SingleRequestById() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [accountIdAssignees, setAccountIdAssignees] = useState(null)

  const requestQuery = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const data = await getSingleRequestById(id.toUpperCase())
      return data
    }
  })

  useEffect(() => {
    setData(requestQuery.data?.data?.data)
  })

  const handleSubmit = () => {
    const re = {
      requestId: data.id,
      AccountId: accountIdAssignees,
      requestStatusId: data.requestStatusId
    }
    if (re.AccountId) {
      createAssignee.mutate(re, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            setSuccessMessage('Process updated successfully.')
            setError(null)
          } else {
            setError(result.statusMessage)
            setSuccessMessage(null)
          }
        },
        onError: (error) => {
          setError('An error occurred while updating the process.')
          setSuccessMessage(null)
        }
      })
    }
  }

  const createAssignee = useMutation({
    mutationFn: (body) => {
      return createProcessByAssignees(body)
    }
  })
  return (
    <>
      {data && (
        <div className='max-w-7xl py-7 mx-auto px-5'>
          <div className=''>
            <h1 className='text-4xl font-semibold leading-7 text-gray-900 py-5'>Ticket</h1>
            <p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
              Warning : Please check carefully full information of user before update anymore
            </p>
          </div>
          <form>
            <input
              className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
              type='hidden'
              value={data.id}
              readOnly
            />
            <div className='mt-5  border-t border-gray-100'>
              <dl className='divide-y divide-gray-100'>
                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'>Name of End-User : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.account.fullName}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'>Email of End-User : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.account.email}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'>Department : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.room.departments.departmentName}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'>Room of Department : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.room.roomNumber}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'>Description : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.description}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> Level : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.severalLevel}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> CreateAt : </dt>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='text'
                    value={data.createdAt}
                    readOnly
                  />
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> Status Ticket : </dt>
                  <div
                    className={`grid items-center max-w-[150px] p-1 justify-center font-sans text-xs font-bold 
                      ${data?.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(data?.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                  >
                    {data.requestStatus.statusName}
                  </div>
                </div>

                <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm font-medium leading-6 text-gray-900'> Processing By AssigneesID : </dt>
                  <div>
                    {data.processByAssignees[0]?.account?.accountId != null ? (
                      <div className='flex items-center'>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={data.processByAssignees[0]?.account?.accountId}
                          readOnly
                        />
                      </div>
                    ) : (
                      <input
                        className='mt-1  text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                        type='text'
                        id='assigneeID'
                        placeholder='N/A - Assignee'
                        onChange={(e) => setAccountIdAssignees(e.target.value)}
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
                        <button
                          type='button'
                          onClick={handleSubmit} // Fixed onClick handler
                          className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                        >
                          Update Process
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </dl>
            </div>
          </form>
          {error && <h2 className='text-l font-medium leading-6 text-red-600'>Error: {error}</h2>}
          {successMessage && <h2 className='text-l font-medium leading-6 text-green-600'>Success: {successMessage}</h2>}
        </div>
      )}
    </>
  )
}
