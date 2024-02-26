import { getAllRequestStatus, getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import React, { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'


export default function RequestDetail() {
  const [requestStatusArray, setRequestStatusArray] = useState([]);
  const [requestObjectById, setRequestObjectById] = useState({});
  const [currentStatus, setCurrentStatus] = useState(null);
  const { id: requestId } = useParams();

  const { data: requestStatusResponse } = useQuery({
    queryKey: ['getAllRequestStatus'],
    queryFn: async () => {
      const data = await getAllRequestStatus()
      return data
    },
    placeholderData: keepPreviousData
  })

  const { data: getRequestById } = useQuery({
    queryKey: ['getRequestById', requestId],
    queryFn: async () => {
      const data = await getSingleRequestById(requestId)
      return data
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    setRequestObjectById(getRequestById?.data?.data);
    setRequestStatusArray(requestStatusResponse?.data?.data)
  }, [requestStatusResponse, getRequestById])

  const handlerShowRequestStatus = (id) => {
    if (id == 1) {
      return "rounded-l-md"
    } else if (id == requestStatusArray.length - 1) {
      return "rounded-r-md"
    }
  }

  const handlerShowColorRequestStatus = (id, color) => {
    if (requestObjectById) {
      if (id <= requestObjectById.requestStatusId) {
        return `bg-[${color}]`
      } else {
        return "";
      }
    }
  }

  console.log(requestObjectById);

  return (
    <div className='w-full h-full'>
      <div className='flex flex-row justify-between items-center border-b border-solid border-gray-300 p-3'>
        <div className='text-2xl text-gray-600 font-semibold'>
          Request Details
        </div>
        <div className='flex flex-row gap-3 items-center'>
          <div className='flex flex-col text-end'>
            <div className='text-gray-600 text-xl'>
              {requestObjectById.account.fullName}
            </div>
            <div className='text-gray-600 text-md '>
              {requestObjectById.account.role.roleName}
            </div>
          </div>
          <div>
            {requestObjectById.account.avatarPhoto != null ? (
              <img
                src={`https://storeimageohd.blob.core.windows.net/images/${requestObjectById.account.avatarPhoto}`}
                alt={requestObjectById.account.fullName}
                className='relative inline-block h-16 w-16 !rounded-full object-cover object-center'
              />
            ) : (
              <div className="relative flex h-16 w-16 bg-gray-200 rounded-full object-cover object-center shadow justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex justify-center mt-10'>
        <div className='relative w-10/12 h-16'>
          <div className='w-full flex flex-row h-full relative'>
            {requestStatusArray &&
              requestStatusArray.map((status) => (
                ((status.statusName != "Closed" && status.statusName != "Rejected") && (
                  <div key={status.id} className='flex flex-col w-1/5 h-4/5 relative items-center'>
                    <div className='text-xs h-full text-gray-500 text-center'>
                      {status.statusName}
                    </div>
                    <div className='h-1/5'>
                      <div className={`absolute bottom-0 z-10 left-0 h-1 w-full ${handlerShowColorRequestStatus(status.id, status.colorCode)} ${handlerShowRequestStatus(status.id)}`}></div>
                    </div>
                  </div>
                ))
              ))
            }
          </div>
          <div className='absolute z-0 bottom-3 left-0 h-1 w-full bg-slate-300 rounded-md'></div>
        </div>
      </div>
      <div className='flex justify-center mt-4 text-md text-gray-600 '>
        <div className='flex flex-col w-7/12'>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              Department:
            </div>
            <div className='w-3/6'>
              {requestObjectById.room.departments.departmentName}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              Room:
            </div>
            <div className='w-4/6'>
              {requestObjectById.room.roomNumber}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              Description:
            </div>
            <div className='w-4/6'>
              {requestObjectById.description} kjhdfkjdsf kdjhfkjs kjhdkfjbsk  kjdfkjsk dkfjhkjsdfb kdhkfjhsk kdjhfksj kbkdjfkjs
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              SeveralLevel:
            </div>
            <div className='w-4/6'>
              {requestObjectById.severalLevel}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              Create Request:
            </div>
            <div className='w-4/6'>
              {requestObjectById.createdAt}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6'>
              Update Request:
            </div>
            <div className='w-4/6'>
              {requestObjectById.updateAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
