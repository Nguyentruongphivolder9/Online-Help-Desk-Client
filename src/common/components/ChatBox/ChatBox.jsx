import { addRemark, getRemarksByRequestId } from '@/client/apiEndpoints/remark.api'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useConvertDate } from '@/hooks/useConvertDate'
import { getRequest } from '@/client/apiEndpoints/request.api'
import getColorClas from '@/hooks/useGetColorRequestStatus'
import isObjectEmpty from '@/utils/CheckEmptyObject'
import useGetInfoFromJWT from '@/hooks/useGetInfoFromJWT'

const initialMessageObjState = {
  accountId: '',
  requestId: '',
  comment: '',
  enable: true
}

export default function ChatBox() {
  const [connect, joinSpecificChatRoom, infoConnectState, setInfoConnectState, listRemarkState, setListRemarkState] =
    useOutletContext()
  const queryClient = useQueryClient()
  const { accountId, roleTypes, userName } = useGetInfoFromJWT()
  const { id } = useParams() //requestId
  const [requestIdState, setRequestIdState] = useState(id)
  const [messageObjState, setMessageObjState] = useState(initialMessageObjState)
  const [errorMessageState, setErrorMessageState] = useState()

  const listRemarkRequestId = useQuery({
    queryKey: ['remarkByRequestId', requestIdState],
    queryFn: () => getRemarksByRequestId(requestIdState),
    placeholderData: keepPreviousData
  })

  const requestbyIdQuery = useQuery({
    queryKey: ['requestbyIdQuery', requestIdState],
    queryFn: async () => {
      const data = await getRequest(requestIdState)
      return data
    },
    enabled: id !== undefined // có id trên URl thì queryFn mới được gọi
  })

  const addRemarkMutate = useMutation({
    mutationFn: (body) => {
      return addRemark(body)
    }
  })

  useEffect(() => {
    setRequestIdState(id)
    if (listRemarkRequestId.isSuccess) {
      setListRemarkState((prev) => [...listRemarkRequestId.data?.data?.data])
    }

    if (isObjectEmpty(infoConnectState)) {
      console.log('Hello- ', infoConnectState)
      if (roleTypes == 'End-Users') {
        joinSpecificChatRoom(requestbyIdQuery?.data?.data?.data.id, requestbyIdQuery?.data?.data?.data.account.fullName)
      } else if (roleTypes == 'Assignees') {
        joinSpecificChatRoom(
          requestbyIdQuery?.data?.data?.data.id,
          requestbyIdQuery?.data?.data?.data.processByAssignees[0].account.fullName
        )
      }
    }
  }, [id, listRemarkRequestId.data])

  const handleChangeInputMessage = (commentInput) => {
    setMessageObjState((prev) => ({ ...prev, accountId: accountId, requestId: id, comment: commentInput }))
  }

  const handleSubmitSendmessage = (e) => {
    e.preventDefault()
    addRemarkMutate.mutate(messageObjState, {
      onSuccess: (data) => {
        console.log(data)
        if (!data?.data.validationsErrors && !data?.data?.error) {
          setMessageObjState(initialMessageObjState)
        } else if (data?.data.validationsErrors && data?.data?.error.code === 'ValidationError') {
          setErrorMessageState(data?.data?.validationsErrors)
        }
      }
    })
  }

  return (
    <div className='h-full w-full p-[10px] flex flex-col relative overflow-hidden border-x border-x-gray-300'>
      <div className='flex-3 '>
        <h2 className='flex justify-between text-lg py-1 mb-8 border-b-2 border-gray-200'>
          <p className='font-semibold'>
            {requestbyIdQuery.isSuccess
              ? `Chatting on - Department: ${requestbyIdQuery?.data?.data?.data.room.departments.departmentName} - Room: ${requestbyIdQuery?.data?.data?.data.room.roomNumber}`
              : ''}
          </p>
          <p
            className={`text-end border-b-2 
                        ${getColorClas(requestbyIdQuery?.data?.data?.data.requestStatus.statusName).borderColor}`}
          >
            Status ({requestbyIdQuery?.data?.data?.data.requestStatus.statusName})
          </p>
        </h2>
      </div>

      {/* box chat */}
      <div className='flex-1 messages overflow-auto overflow-y-scroll hide-scrollbar'>
        {listRemarkState.length > 0 && listRemarkState.length !== undefined ? (
          listRemarkState.map((item) => (
            <div key={item.id} className={`message mb-4 flex ${accountId === item.accountId ? 'text-right' : ''}`}>
              {accountId !== item.accountId ? (
                <div className='flex-2'>
                  <div className='w-12 h-12 relative'>
                    {item?.avatarPhoto != null ? (
                      <img
                        src={`https://storeimageohd.blob.core.windows.net/images/${item?.avatarPhoto}`}
                        alt={item?.fullName}
                        className='relative inline-block h-9 w-9 !rounded-full object-cover object-center'
                      />
                    ) : (
                      <div className='relative flex h-9 w-9 bg-gray-200 rounded-full object-cover object-center shadow justify-center items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6 text-gray-400'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}

              <div className='flex-1 px-2'>
                <div
                  className={`inline-block ${accountId === item.accountId ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}  rounded-full p-2 px-6 `}
                >
                  <span>{item.comment}</span>
                </div>
                <div className='pl-4'>
                  <small className='text-gray-500'>{useConvertDate(item.createAt)}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-2xl absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4'>
            You haven't sent any messages yet
          </div>
        )}
      </div>

      {/* Text area */}
      <div className='pt-4 mt-auto mb-10'>
        <div className='write bg-white shadow flex rounded-lg'>
          <div className='flex-3 flex content-center items-center text-center p-4 pr-0'>
            <span className='block text-center text-gray-400 hover:text-gray-800'>
              <svg
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                stroke='currentColor'
                viewBox='0 0 24 24'
                className='h-6 w-6'
              >
                <path d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </span>
          </div>
          <div className='flex-1'>
            <form action='' onSubmit={(e) => handleSubmitSendmessage(e)}>
              <input
                name='message'
                className='w-full block outline-none py-4 px-4 bg-transparent focus:border-sky-500'
                rows={1}
                placeholder='Type a message...'
                autoFocus
                value={messageObjState.comment}
                onChange={(e) => handleChangeInputMessage(e.target.value)}
              />
            </form>
          </div>
          <div className='p-2 flex items-center' onClick={(e) => handleSubmitSendmessage(e)}>
            <div className='flex-1 text-end'>
              <button className='bg-blue-400 w-10 h-10 rounded-full inline-block'>
                <span className='inline-block align-text-bottom'>
                  <svg
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    className='w-4 h-4 text-white'
                  >
                    <path d='M5 13l4 4L19 7' />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
