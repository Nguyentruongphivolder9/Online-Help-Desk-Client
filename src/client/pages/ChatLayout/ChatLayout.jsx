import {
  UpdateUnwatchsSeenOnNotifiRemark,
  getListNotifiRemarkByAccountId,
  getRemarksbyAccountId
} from '@/client/apiEndpoints/remark.api'
import { getRequests, getRequestsWithoutSsfp } from '@/client/apiEndpoints/request.api'
import CheckBox from '@/common/components/ChatBox'
import LobbyChat from '@/common/components/LobbyChat/LobbyChat'
import MessageSvg from '@/common/components/MessageSvg'
import SkeletonLoaderRequest from '@/common/components/SkeletonLoaderRequest'
import getCookie from '@/hooks/getCookie'
import useAuthRedirect from '@/hooks/useAuthRedirect'
import { useConvertDate } from '@/hooks/useConvertDate'
import getColorClas from '@/hooks/useGetColorRequestStatus'
import useGetInfoFromJWT from '@/hooks/useGetInfoFromJWT'
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'

export default function ChatLayout() {
  const { accountId, isLoading } = useAuthRedirect('End-Users')
  const { id: accountUserId, roleTypes } = useGetInfoFromJWT()
  const queryClient = useQueryClient()
  const [connect, setConnection] = useState()
  const [requestsQueryState, setRequestsQueryState] = useState([]) //  purpose for searching
  const [infoConnectState, setInfoConnectState] = useState({}) // info for joinSpecificChatRoom
  const [searchState, setSearchState] = useState('')
  const [listRemarkState, setListRemarkState] = useState([])
  const [listNotifiRemark, setListNotifiRemark] = useState([])
  const [isShowResultSearch, setIsShowResultSearch] = useState(false)

  const listRemarkByAcountId = useQuery({
    queryKey: ['remarkByAccountId'],
    queryFn: () => getRemarksbyAccountId(), // lay remark moi nhat tren moi request
    placeholderData: keepPreviousData
  })

  const requestsQuery = useQuery({
    queryKey: ['getRequestsWithoutSsfp'],
    queryFn: async () => await getRequestsWithoutSsfp(),
    placeholderData: keepPreviousData
  })

  const listNotifiRemarkQueries = useQuery({
    queryKey: ['listNotifiRemarkQueries'],
    queryFn: () => getListNotifiRemarkByAccountId(),
    placeholderData: keepPreviousData
  })

  const UpdateUnwatchsSeenOnNotifiRemarkMutation = useMutation({
    mutationFn: (body) => UpdateUnwatchsSeenOnNotifiRemark(body)
  })

  const handleUpdateUnwatchsSeenOnNotifiRemark = (objectData) => {
    UpdateUnwatchsSeenOnNotifiRemarkMutation.mutate(objectData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listNotifiRemarkQueries'] })
        console.log('Update successfully')
      },
      onError: () => {
        console.log('Failed')
      }
    })
  }

  useEffect(() => {
    if (listNotifiRemarkQueries.isSuccess) {
      setListNotifiRemark((prev) => [...listNotifiRemarkQueries?.data?.data?.data])
    }

    // return () => {
    //   // disconnect before switch to another room (or unmounted component)
    //   if (connect) {
    //     connect.stop()
    //   }
    // }
  }, [connect, listNotifiRemarkQueries.isSuccess, listNotifiRemarkQueries.data])

  // console.log(listNotifiRemark)

  useEffect(() => {
    const connectHub = async () => {
      try {
        const connect = new HubConnectionBuilder()
          .withUrl('https://localhost:7279/hubs/notificationRemark', {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
          })
          .configureLogging(LogLevel.Information)
          .build()

        connect.on('ReceiveNotificationRemark', (message) => {
          const parseMessageFromServer = JSON.parse(message)
          const notifiRelateToAccount = parseMessageFromServer.find((item) => {
            return item.accountId == accountId
          })
          setListNotifiRemark((prev) => {
            const existingIndex = prev.findIndex((existingItem) => existingItem.id === notifiRelateToAccount.id)

            if (existingIndex !== -1) {
              const updatedList = [...prev]
              updatedList[existingIndex] = notifiRelateToAccount
              return updatedList
            } else {
              return [...prev, notifiRelateToAccount]
            }
          })
        })

        await connect.start()
        await connect.invoke('JoinToMultipleRoom', accountId)
      } catch (error) {
        console.log(error)
      }
    }
    if (accountId) {
      connectHub()
    }
    queryClient.invalidateQueries({ queryKey: ['listNotifiRemarkQueries'] })
  }, [accountId])

  const joinSpecificChatRoom = async (requestId, username, remarkId) => {
    if (connect != undefined || connect != null) {
      connect.stop()
    }
    try {
      const connect = new HubConnectionBuilder()
        .withUrl('https://localhost:7279/hubs/chat', {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets
        })
        .configureLogging(LogLevel.Information)
        .build()

      connect.on('JoinSpecificChatRoom', (username, message) => {
        console.log('message', message)
      })

      connect.on('ReceiveMessage', (message) => {
        const parseMessageFromServer = JSON.parse(message)
        setListRemarkState((prev) => [...prev, parseMessageFromServer])
        console.log(parseMessageFromServer)
      })

      await connect.start()
      await connect.invoke('JoinSpecificChatRoom', requestId, username)

      setInfoConnectState((prev) => ({ ...prev, requestId, username }))
      setConnection(connect)
      handleUpdateUnwatchsSeenOnNotifiRemark({ id: remarkId })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    if (value !== null && value !== '') {
      setIsShowResultSearch(true)
    } else {
      setIsShowResultSearch(false)
    }
  }

  // console.log(listRemarkState)

  const searching = (searchTerrm) => {
    setSearchState(searchTerrm)
  }

  return (
    <>
      {(requestsQuery && requestsQuery?.data?.data?.data.length) > 0 ? (
        <div className='flex flex-row w-full h-full fixed justify-center overflow-hidden bg-white pt-[72px]'>
          <div className='flex h-full flex-row w-full border border-x-gray-300'>
            <div className='h-full w-1/5 overflow-hidden'>
              <div className='w-full h-2/12 flex flex-row justify-between items-center p-[10px]'>
                <div className='relative flex items-center w-11/12 h-[35px] rounded-lg border focus-within:border-gray-500 bg-slate-200 overflow-hidden'>
                  <div className='grid place-items-center h-full w-12 text-gray-300'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </div>
                  <input
                    className='peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-slate-200'
                    type='text'
                    id='search'
                    placeholder='Search something..'
                    onChange={handleSearchChange}
                  />
                </div>
                <div className='grid place-items-center h-full w-12 text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5'
                    />
                  </svg>
                </div>
              </div>

              {isShowResultSearch ? (
                <div className='h-10/12 relative w-full text-sm'>
                  <div className='flex flex-row w-full p-[15px] items-center border-b gap-2 border-solid text-gray-700'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
                      />
                    </svg>
                    <div className='p-[10px]text-base font-medium'>Request search results</div>
                  </div>

                  <div className='w-full h-full'>
                    <SkeletonLoaderRequest />
                    <SkeletonLoaderRequest />
                    <SkeletonLoaderRequest />
                    <SkeletonLoaderRequest />
                    <SkeletonLoaderRequest />
                    <SkeletonLoaderRequest />
                  </div>
                </div>
              ) : (
                <div className='h-10/12 relative w-full text-sm'>
                  <div className='flex flex-row justify-center gap-2 w-full p-[10px] border-b-4 border-solid border-blue-500 text-blue-700'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z'
                      />
                    </svg>
                    <span>Requests</span>
                  </div>

                  {/* lobby */}
                  <LobbyChat
                    dataItem={requestsQuery?.data?.data?.data}
                    isLoading={requestsQuery.isLoading}
                    joinSpecificChatRoom={joinSpecificChatRoom}
                    roleTypes={roleTypes}
                    listNotifiRemark={listNotifiRemark}
                    setListNotifiRemark={setListNotifiRemark}
                  />
                </div>
              )}
            </div>
            <div className='h-full w-4/5'>
              <Outlet
                context={[
                  connect,
                  joinSpecificChatRoom,
                  infoConnectState,
                  setInfoConnectState,
                  listRemarkState,
                  setListRemarkState
                ]}
              ></Outlet>
            </div>
          </div>
        </div>
      ) : (
        <div className='h-[600px] mt-20 flex justify-center items-center mx-auto p-5 my-24 border border-slate-100 shadow-lg bg-white rounded-lg'>
          <div className='text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-[30rem] h-[15rem] mx-auto text-sky-300'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
              />
            </svg>
            <p className='mt-2 text-lg font-semibold text-gray-800'>There are no chat Messages</p>
            <div className=' mt[5px]'>
              <span className='text-gray-600 flex items-center justify-center'>
                You can chat by&nbsp;
                <Link
                  to={'/client/request/add'}
                  className='flex items-center justify-center gap-2 underline hover:text-sky-500'
                >
                  submitting a request
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8 text-sky-500'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                    />
                  </svg>
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
