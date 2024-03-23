import { getAllRequestStatus, updateRequestStatus } from '@/admin/apiEndpoints/dataRequest.api'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify';
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
    requestObjectById,
    setReloadRequest
  ] = useOutletContext();
  const queryClient = useQueryClient();
  const [requestStatusArray, setRequestStatusArray] = useState(null);
  const [updateStatusRequest, setUpdateStatusRequest] = useState(null);
  const [isShowReason, setIsShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState('');
  const [errorReason, setErrorReason] = useState(null);

  const { data: requestStatusResponse } = useQuery({
    queryKey: ['getAllRequestStatus'],
    queryFn: async () => {
      const data = await getAllRequestStatus()
      return data
    },
    placeholderData: keepPreviousData
  })

  const updateRequest = useMutation({
    mutationFn: (body) => {
      return updateRequestStatus(body)
    }
  });

  const handlerShowRequestStatus = (id) => {
    if (id == 1) {
      return "rounded-l-md"
    } else if (id == requestStatusArray.length - 1) {
      return "rounded-r-md"
    }
  }

  const handlerShowColorRequestStatus = (id, color) => {
    if (requestObjectById) {
      if (requestObjectById.requestStatus.statusName == "Rejected" || requestObjectById.requestStatus.statusName == "Closed") {
        return `bg-red-500`
      } else {
        if (id <= requestObjectById.requestStatusId) {
          return `bg-[${color}]`
        } else {
          return "";
        }
      }
    }
  }

  useEffect(() => {
    if (requestObjectById) {
      if (requestObjectById.requestStatusId == 2) {
        setUpdateStatusRequest(3);
      } else if (requestObjectById.requestStatusId == 3) {
        setUpdateStatusRequest(6);
      }
    }
    setRequestStatusArray(requestStatusResponse?.data?.data)
  }, [requestStatusResponse, requestObjectById]);

  const handleSubmitUpdateStatus = () => {
    let object = null;

    if (updateStatusRequest == 5) {
      if (reasonValue == '' || reasonValue == null) {
        setErrorReason("Please enter the reason for the rejection");
      } else {
        object = {
          requestId: `${requestObjectById.id}`,
          requestStatusId: `${updateStatusRequest}`,
          reason: reasonValue
        }
      }
    } else {
      object = {
        requestId: `${requestObjectById.id}`,
        requestStatusId: `${updateStatusRequest}`
      }
    }

    if (object) {
      updateRequest.mutate(object, {
        onSuccess: (response) => {
          setIsShowReason(false);
          setErrorReason('');
          setReasonValue('');
          const result = response.data
          queryClient.invalidateQueries({ queryKey: ['getRequestRelatetoAssigneeQuery'] });
          queryClient.invalidateQueries({ queryKey: ['request/getTotalRequestAssignee'] });
          if (result.isSuccess) {
            toast.success(`${result.statusMessage}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored"
            });
            setReloadRequest(Math.floor(Math.random() * (100000 - 999999 + 1)) + 100000);
          } else {
            toast.error(`${result.statusMessage}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored"
            });
          }
        }
      });
    }
  }

  return (
    <div className='text-gray-600'>
      <div className='flex justify-center mt-10'>
        <div className='relative w-10/12 h-16'>
          <div className='w-full flex flex-row h-full relative'>
            {requestStatusArray &&
              requestStatusArray.map((status) => (
                (status.statusName != "Closed" && status.statusName != "Rejected") && (
                  <div key={status.id} className='flex flex-col w-1/5 h-4/5 relative items-center'>
                    <div className='text-xs h-full text-gray-500 text-center'>
                      {status.statusName}
                    </div>
                    <div className='h-1/5'>
                      <div className={`absolute bottom-0 z-10 left-0 h-1 w-full ${handlerShowColorRequestStatus(status.id, status.colorCode)} ${handlerShowRequestStatus(status.id)}`}></div>
                    </div>
                  </div>
                ))
              )
            }
          </div>
          <div className='absolute z-0 bottom-3 left-0 h-1 w-full bg-slate-300 rounded-md'></div>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-4 text-md text-gray-600 '>
        <div className='flex flex-col w-8/12'>
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
              {requestObjectById.description}
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
              Status:
            </div>
            <div className='w-4/6 flex flex-row gap-1'>
              <div className={`w-32 flex items-center justify-center text-gray-900 text-xs rounded-lg px-4 py-1 bg-[${requestObjectById.requestStatus.colorCode}]`}>
                {requestObjectById.requestStatus.statusName}
              </div>
              {(requestObjectById.requestStatus.statusName != "Closed" && requestObjectById.requestStatus.statusName != "Rejected" && requestObjectById.requestStatus.statusName != "Completed") && (
                <div className='flex flex-row gap-1'>
                  <div onClick={handleSubmitUpdateStatus} className='px-2 py-1 text-gray-400 rounded-lg cursor-pointer bg-gray-200'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                    </svg>
                  </div>
                  <select
                    id='role'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-36 px-2 transition delay-500 outline-none'
                    value={updateStatusRequest ? updateStatusRequest : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value == 5) {
                        setIsShowReason(true);
                      } else {
                        setReasonValue('');
                        setErrorReason('');
                        setIsShowReason(false);
                      }
                      setUpdateStatusRequest(e.target.value)
                    }}
                  >
                    {requestStatusArray &&
                      requestStatusArray.map((status) => (
                        ((requestObjectById.requestStatus.statusName != "Closed" && requestObjectById.requestStatus.statusName != "Rejected") &&
                          ((status.id > requestObjectById.requestStatusId && status.statusName != "Closed") &&
                            <option key={status.id} value={status.id} className='hover:bg-slate-400' > {status.statusName}</option>
                          )
                        )
                      ))
                    }
                  </select>
                </div>
              )}
            </div>
          </div>
          {isShowReason && (
            <div className='flex flex-row py-2 border-y border-solid'>
              <div className='text-gray-600 w-2/6 px-3'>
                Reason:
              </div>
              <div className='w-4/6'>
                <textarea
                  id='description'
                  rows={4}
                  className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border transition delay-100 outline-none ${errorReason ? 'border-red-500' : 'border-gray-300'} border-gray-300 focus:border-blue-300`}
                  placeholder='Your description here'
                  value={reasonValue}
                  onChange={(e) => {
                    let value;
                    if (e.target.value.trim().length < 1) {
                      value = e.target.value.trim();
                      setErrorReason("Don't start with spaces");
                    } else {
                      setErrorReason('');
                      value = e.target.value.replace(/\s\s+/g, ' ');
                    }
                    setReasonValue(value)
                  }}
                />
                {errorReason && (
                  <div className='text-red-400 text-xs'>
                    {errorReason}
                  </div>
                )}
              </div>
            </div>
          )}
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
    </div >
  )
}
