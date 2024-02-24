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
  const [connect, joinSpecificChatRoom, infoConnectState, listRemarkState, setListRemarkState] = useOutletContext()
  const queryClient = useQueryClient()
  const { accountId, userName } = useGetInfoFromJWT()
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
      joinSpecificChatRoom(requestbyIdQuery?.data?.data?.data.id, requestbyIdQuery?.data?.data?.data.account.fullName)
    }
  }, [id, listRemarkRequestId.data])

  const handleChangeInputMessage = (commentInput) => {
    setMessageObjState((prev) => ({ ...prev, accountId: accountId, requestId: id, comment: commentInput }))
  }

  const handleSubmitSendmessage = () => {
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
    <div className='chat-area flex-1 flex flex-col relative'>
      <div className='flex-3'>
        <h2 className='flex justify-between text-xl py-1 mb-8 border-b-2 border-gray-200'>
          <p className='font-semibold'>
            {requestbyIdQuery.isSuccess
              ? `Chatting on - Department: ${requestbyIdQuery?.data?.data?.data.room.departments.departmentName} - Room: ${requestbyIdQuery?.data?.data?.data.room.roomNumber}`
              : ''}
          </p>
          <p
            className={`text-end border-b-4 
                        ${getColorClas(requestbyIdQuery?.data?.data?.data.requestStatus.statusName).borderColor}`}
          >
            Status ({requestbyIdQuery?.data?.data?.data.requestStatus.statusName})
          </p>
        </h2>
      </div>

      {/* box chat */}
      <div className='messages overflow-auto'>
        {listRemarkState.length > 0 || listRemarkState.length == undefined ? (
          listRemarkState.map((item) => (
            <div key={item.id} className={`message mb-4 flex ${accountId === item.accountId ? 'text-right' : ''}`}>
              {/* <div className='flex-2'>
                <div className='w-12 h-12 relative'>
                  <img className='w-12 h-12 rounded-full mx-auto' src='../resources/profile-image.png' alt='chat-user' />
                  <span className='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white' />
                </div>
              </div> */}
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

        {/* <div className='message mb-4 flex'>
          <div className='flex-2'>
            <div className='w-12 h-12 relative'>
              <img className='w-12 h-12 rounded-full mx-auto' src='../resources/profile-image.png' alt='chat-user' />
              <span className='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white' />
            </div>
          </div>
          <div className='flex-1 px-2'>
            <div className='inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700'>
              <span>Hey there. We would like to invite you over to our office for a visit. How about it?</span>
            </div>
            <div className='pl-4'>
              <small className='text-gray-500'>15 April</small>
            </div>
          </div>
        </div>
        <div className='message mb-4 flex'>
          <div className='flex-2'>
            <div className='w-12 h-12 relative'>
              <img className='w-12 h-12 rounded-full mx-auto' src='../resources/profile-image.png' alt='chat-user' />
              <span className='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white' />
            </div>
          </div>
          <div className='flex-1 px-2'>
            <div className='inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700'>
              <span>All travel expenses are covered by us of course :D</span>
            </div>
            <div className='pl-4'>
              <small className='text-gray-500'>15 April</small>
            </div>
          </div>
        </div>
        <div className='message me mb-4 flex text-right'>
          <div className='flex-1 px-2'>
            <div className='inline-block bg-blue-600 rounded-full p-2 px-6 text-white'>
              <span>It's like a dream come true</span>
            </div>
            <div className='pr-4'>
              <small className='text-gray-500'>15 April</small>
            </div>
          </div>
        </div>
        <div className='message me mb-4 flex text-right'>
          <div className='flex-1 px-2'>
            <div className='inline-block bg-blue-600 rounded-full p-2 px-6 text-white'>
              <span>I accept. Thank you very much.</span>
            </div>
            <div className='pr-4'>
              <small className='text-gray-500'>15 April</small>
            </div>
          </div>
        </div>
        <div className='message mb-4 flex'>
          <div className='flex-2'>
            <div className='w-12 h-12 relative'>
              <img className='w-12 h-12 rounded-full mx-auto' src='../resources/profile-image.png' alt='chat-user' />
              <span className='absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white' />
            </div>
          </div>
          <div className='flex-1 px-2'>
            <div className='inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700'>
              <span>You are welome. We will stay in touch.</span>
            </div>
            <div className='pl-4'>
              <small className='text-gray-500'>15 April</small>
            </div>
          </div>
        </div> */}
      </div>

      {/* Text area */}
      <div className='flex-2 pt-4 mt-auto'>
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
            <input
              name='message'
              className='w-full block outline-none py-4 px-4 bg-transparent focus:border-sky-500'
              rows={1}
              placeholder='Type a message...'
              autoFocus
              value={messageObjState.comment}
              onChange={(e) => handleChangeInputMessage(e.target.value)}
            />
          </div>
          <div className='p-2 flex items-center' onClick={() => handleSubmitSendmessage()}>
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
