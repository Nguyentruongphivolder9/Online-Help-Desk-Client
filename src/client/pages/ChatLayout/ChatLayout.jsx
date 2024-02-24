import { getRemarksbyAccountId } from '@/client/apiEndpoints/remark.api'
import { getRequests, getRequestsWithoutSsfp } from '@/client/apiEndpoints/request.api'
import CheckBox from '@/common/components/ChatBox'
import getCookie from '@/hooks/getCookie'
import { useConvertDate } from '@/hooks/useConvertDate'
import getColorClas from '@/hooks/useGetColorRequestStatus'
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'

export default function ChatLayout() {
  const queryClient = useQueryClient()
  const [connect, setConnection] = useState()
  const [requestsQueryState, setRequestsQueryState] = useState([]) //  purpose for searching
  const [infoConnectState, setInfoConnectState] = useState({}) // info for joinSpecificChatRoom
  const [searchState, setSearchState] = useState('')
  const [listRemarkState, setListRemarkState] = useState([])

  const listRemarkByAcountId = useQuery({
    queryKey: ['remarkByAccountId'],
    queryFn: () => getRemarksbyAccountId(), // lay remark moi nhat tren moi request
    placeholderData: keepPreviousData
  })

  const requestsQuery = useQuery({
    queryKey: ['getRequestsWithoutSsfp'],
    queryFn: () => getRequestsWithoutSsfp(),
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    return () => {
      // disconnect before switch to another room (or unmounted component)
      if (connect) {
        connect.stop()
      }
    }
  }, [connect])

  const joinSpecificChatRoom = async (requestId, username) => {
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
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(listRemarkState)

  const searching = (searchTerrm) => {
    setSearchState(searchTerrm)
  }

  return (
    <div className='w-full h-[800px] container mx-auto my-8'>
      <div className='flex h-full'>
        <div className='flex-1 bg-gray-100 w-full h-full'>
          <div className='main-body container m-auto w-11/12 h-full flex flex-col'>
            {/* <div className='py-4 flex-2 flex flex-row'>
              <div className='flex-1'>
                <span className='xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom'>
                  <span className='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                  </span>
                </span>
                <span className='lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom'>
                  <span className='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                    </svg>
                  </span>
                </span>
              </div>
              <div className='flex-1 text-right'>
                <span className='inline-block text-gray-700'>
                  Status:{' '}
                  <span className='inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white' />{' '}
                  <b>Online</b>
                  <span className='inline-block align-text-bottom'>
                    <svg
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                      className='w-4 h-4'
                    >
                      <path d='M19 9l-7 7-7-7' />
                    </svg>
                  </span>
                </span>
                <span className='inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom'>
                  <span className='block h-6 w-6 p-1 rounded-full hover:bg-gray-400'>
                    <svg
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                      className='w-4 h-4'
                    >
                      <path d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                    </svg>
                  </span>
                </span>
              </div>
            </div> */}

            <div className='main flex-1 flex flex-col'>
              <div className='hidden lg:block heading flex-2'>
                <h1 className='text-3xl text-gray-700 my-4'>Chat</h1>
              </div>
              <div className='flex h-[calc(750px-56px)]'>
                {/* list chat request */}
                <div className='sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6'>
                  {/* search bar */}
                  <div className='search flex-2 pb-6 px-2'>
                    <input
                      type='text'
                      className='outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200'
                      placeholder='Search'
                      value={searchState}
                      onChange={(e) => searching(e.target.value)}
                    />
                  </div>

                  <div className='overflow-auto px-2 '>
                    {requestsQuery?.data?.data?.data.map((item) => (
                      <Link
                        to={`/messages/${item.id}`}
                        key={item.id}
                        className={`cursor-pointer transform hover:scale-95 hover:bg-sky-300 duration-500 transition-all bg-white mb-4 rounded p-4 flex shadow-md 
                        ${getColorClas(item.requestStatus.statusName).borderColor} border-l-4`}
                        onClick={() => joinSpecificChatRoom(item.id, item.account.fullName)}
                      >
                        <div className='flex-1 px-2'>
                          <div className='truncate'>
                            <span className='text-gray-800 font-bold'>
                              Department: {item.room.departments.departmentName}
                            </span>
                          </div>
                          <div>
                            <small className='text-gray-600'>Room-{item.room.roomNumber}</small>
                          </div>
                        </div>
                        <div className='flex-2 text-right'>
                          <div>
                            <small className='text-gray-500'>{useConvertDate(item.createdAt)}</small>
                          </div>
                          <div>
                            <small className='text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block'>
                              23
                            </small>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <Outlet
                  context={[connect, joinSpecificChatRoom, infoConnectState, listRemarkState, setListRemarkState]}
                ></Outlet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
