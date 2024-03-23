import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById, createProcessByAssignees } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { convertDateHourAndMinute } from '@/utils/convertDateHourAndMinute'
import { getAllAssignee } from '@/admin/apiEndpoints/dataAssignee.api'

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
  const [requestData, setRequestData] = useState(null)
  const [accountIdAssignees, setAccountIdAssignees] = useState(null)
  const [reloadThenSubmitSuccess, setReloadThenSubmitSuccess] = useState(null)

  const { data: allAssignee } = useQuery({
    queryKey: ['assignee/getAll'],
    queryFn: async () => {
      const data = await getAllAssignee()
      return data
    }
  })

  const { data: requestQuery } = useQuery({
    queryKey: ['request', id, reloadThenSubmitSuccess],
    queryFn: async () => {
      const data = await getSingleRequestById(id)
      return data
    }
  })

  useEffect(() => {
    setRequestData(requestQuery?.data?.data)
  }, [requestQuery])

  const handleSubmit = () => {
    const formRequest = {
      requestId: requestData.id,
      AccountId: accountIdAssignees
    }
    if (formRequest.AccountId) {
      createAssignee.mutate(formRequest, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            setReloadThenSubmitSuccess(new Date())
            toast.success(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          } else {
            toast.error(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          }
        }
      })
    } else {
      toast.error('This space cannot be blank or empty', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
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
      {requestData && (
        <div className='container mt-1 justify-center relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
          <div className='p-6 bg-gray-100 flex items-center justify-center'>
            <div className='max-w-7xl py-7 px-5'>
              <div>
                <div className=''>
                  <h1 className='text-4xl font-semibold leading-7 text-gray-900 py-1'>Ticket</h1>
                  <p className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                    Warning : Please check carefully full information of user before update anymore
                  </p>
                </div>
                <form>
                  <input
                    className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                    type='hidden'
                    value={requestData.id}
                    readOnly
                  />
                  <div className='mt-5  border-t border-gray-100'>
                    <dl className='divide-y divide-gray-100'>
                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'>Name of End-User : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.account.fullName}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'>Email of End-User : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.account.email}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'>Department : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.room.departments.departmentName}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'>Room of Department : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.room.roomNumber}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'>Description : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.description}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> Level : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={requestData.severalLevel}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> CreateAt : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={convertDateHourAndMinute(requestData.createdAt)}
                          readOnly
                        />
                      </div>
                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> Update At : </dt>
                        <input
                          className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                          type='text'
                          value={convertDateHourAndMinute(requestData.updateAt)}
                          readOnly
                        />
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> Status Ticket : </dt>
                        <div
                          className={`grid items-center max-w-[150px] p-1 justify-center font-sans text-xs font-bold 
                      ${requestData?.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(requestData?.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                        >
                          {requestData.requestStatus.statusName}
                        </div>
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> Processing By AssigneesID : </dt>
                        <div>
                          {requestData.processByAssignees[0]?.account?.accountId != null ? (
                            <div className='flex items-center'>
                              <input
                                className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                                type='text'
                                value={requestData.processByAssignees[0]?.account?.accountId}
                                readOnly
                              />
                            </div>
                          ) : (
                            <select
                              className='w-60 bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block p-2.5 transition delay-500 outline-none'
                              onChange={(e) => setAccountIdAssignees(e.target.value)}
                            >
                              <option
                                className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-gray-200 px-3 rounded-md border border-solid'
                                value=''
                              >
                                Select Assignee here
                              </option>
                              {allAssignee &&
                                allAssignee?.data?.data.map((item) => (
                                  <option key={item.accountId} value={item.accountId} className='hover:bg-slate-400'>
                                    {item.fullName}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>

                      <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                        <dt className='text-sm font-medium leading-6 text-gray-900'> </dt>
                        <div>
                          {requestData.processByAssignees[0]?.account?.fullName != null ? (
                            <div className='flex items-center'></div>
                          ) : (
                            <div className='flex items-center'>
                              <button
                                type='button'
                                onClick={handleSubmit}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
