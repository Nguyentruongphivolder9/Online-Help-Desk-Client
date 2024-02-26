import { getAllRequestStatus } from '@/admin/apiEndpoints/dataRequest.api'
import React, { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import { convertDateHourAndMinute } from '@/utils/convertDateHourAndMinute'

export default function RequestDetails() {
  const [
    connect,
    joinSpecificChatRoom,
    infoConnectState,
    setInfoConnectState,
    listRemarkState,
    setListRemarkState,
    requestObjectById
  ] = useOutletContext();
  const [requestStatusArray, setRequestStatusArray] = useState(null);

  const { data: requestStatusResponse } = useQuery({
    queryKey: ['getAllRequestStatus'],
    queryFn: async () => {
      const data = await getAllRequestStatus()
      return data
    },
    placeholderData: keepPreviousData
  })

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

  useEffect(() => {
    setRequestStatusArray(requestStatusResponse?.data?.data)
  }, [requestStatusResponse])

  return (
    <div className='text-gray-600'>
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
            <div className='text-gray-600 w-2/6 px-3'>
              Department:
            </div>
            <div className='w-3/6'>
              {requestObjectById.room.departments.departmentName}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6 px-3'>
              Room:
            </div>
            <div className='w-4/6'>
              {requestObjectById.room.roomNumber}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6 px-3'>
              Description:
            </div>
            <div className='w-4/6'>
              {requestObjectById.description} kjhdfkjdsf kdjhfkjs kjhdkfjbsk  kjdfkjsk dkfjhkjsdfb kdhkfjhsk kdjhfksj kbkdjfkjs
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6 px-3'>
              SeveralLevel:
            </div>
            <div className='w-4/6'>
              {requestObjectById.severalLevel}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6 px-3'>
              Create Request:
            </div>
            <div className='w-4/6'>
              {convertDateHourAndMinute(requestObjectById.createdAt)}
            </div>
          </div>
          <div className='flex flex-row py-2 border-y border-solid'>
            <div className='text-gray-600 w-2/6 px-3'>
              Update Request:
            </div>
            <div className='w-4/6'>
              {convertDateHourAndMinute(requestObjectById.updateAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
