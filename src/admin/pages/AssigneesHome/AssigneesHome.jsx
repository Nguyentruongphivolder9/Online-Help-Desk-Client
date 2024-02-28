import React, { useEffect, useMemo, useRef, useState } from 'react'
import HeaderAdmin from '@/admin/components/HeaderAdmin'
import useAuthRedirect from '@/hooks/useAuthRedirect'
import LoadingOverlay from '@/common/components/LoadingOverlay'
import LobbyChat from '@/common/components/LobbyChat/LobbyChat'
import SkeletonLoaderRequest from '@/common/components/SkeletonLoaderRequest'
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useGetInfoFromJWT from '@/hooks/useGetInfoFromJWT'
import { Outlet, useParams } from 'react-router-dom'
import { getAllRequestOfAssigneeProcessing } from '@/admin/apiEndpoints/dataRequest.api'
import { UpdateUnwatchsSeenOnNotifiRemark, getListNotifiRemarkByAccountId } from '@/client/apiEndpoints/remark.api'
import useDebounce from '@/hooks/useDebounce'

export default function AssigneesHome({ children }) {
  const queryClient = useQueryClient()
  const { accountId, isLoading } = useAuthRedirect('Assignees')
  const { id: accountAssigneeId, roleTypes } = useGetInfoFromJWT()
  const [accountdIdState, setAccountdIdState] = useState(useAuthRedirect('Assignees'))
  const { id } = useParams() //requestId
  const [requestIdState, setRequestIdState] = useState(id)
  const [showLobby, setShowLobby] = useState('Request')
  const [isShowResultSearch, setIsShowResultSearch] = useState(false)
  const [listRemarkState, setListRemarkState] = useState([])
  const [infoConnectState, setInfoConnectState] = useState({})
  const [connect, setConnection] = useState()
  const [listNotifiRemark, setListNotifiRemark] = useState([])
  const [dateSearchState, setDateSearchState] = useState(null)
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef();

  const debouncedValue = useDebounce(searchValue, 500);

  const handleSearchChange = (e) => {
    let value;
    if (e.target.value.trim().length < 1) {
      value = e.target.value.trim();
      setSearchResult([])
    } else {
      value = e.target.value.replace(/\s\s+/g, ' ');
    }

    setSearchValue(value);
  }

  const getRequestRelatetoAssigneeQuery = useQuery({
    queryKey: ['getRequestRelatetoAssigneeQuery'],
    queryFn: async () => {
      const data = await getAllRequestOfAssigneeProcessing(accountId, { page: 1, limit: 10 })
      return data
    }
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
      console.log('hello')
      connectHub()
    }
    queryClient.invalidateQueries({ queryKey: ['listNotifiRemarkQueries'] })
  }, [accountId])

  const { data: getSearchRequest } = useQuery({
    queryKey: ['getSearchRequestOfAssignee', debouncedValue],
    queryFn: async () => {
      const data = await getAllRequestOfAssigneeProcessing(accountId, { searchTerm: debouncedValue, page: 1, limit: 10 })
      return data
    },
    enabled: debouncedValue != ''
  })

  useEffect(() => {
    if (getSearchRequest?.data?.data) {
      setSearchResult(getSearchRequest?.data?.data?.items)
    }
  }, [debouncedValue, getSearchRequest])

  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputRef.current.focus();
  }

  return (
    <>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <div>
          <HeaderAdmin urlLogo='/admin/assignees' container='container' accountId={accountId} urlProfile={'/admin/assignees/myProfile/'} />
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
                      ref={inputRef}
                      className='peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-slate-200'
                      type='text'
                      placeholder='Search something..'
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={() => {
                        setIsShowResultSearch(true)
                      }}
                    />
                    {!!searchValue && (
                      <button
                        className='absolute right-2'
                        onClick={handleClear}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
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
                    <div className='flex flex-row w-full p-[15px] items-center justify-between border-b gap-2 border-solid text-gray-700'>
                      <div className='flex flex-row gap-1'>
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
                      <button
                        onClick={() => {
                          setSearchValue('');
                          setSearchResult([]);
                          setIsShowResultSearch(false)
                        }}
                        className='flex flex-row items-center gap-1 py-1 px-3 border rounded-md border-gray-600 text-xs'
                      >
                        <span>Closed</span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </button>
                    </div>

                    {(isShowResultSearch && searchResult.length > 0) ? (
                      <LobbyChat
                        dataItem={searchResult}
                        joinSpecificChatRoom={joinSpecificChatRoom}
                        roleTypes={roleTypes}
                        listNotifiRemark={listNotifiRemark}
                        setListNotifiRemark={setListNotifiRemark}
                        setIsShowResultSearch={setIsShowResultSearch}
                        setSearchValue={setSearchValue}
                      />
                    ) : (
                      <div className='w-full h-full'>
                        <SkeletonLoaderRequest />
                        <SkeletonLoaderRequest />
                        <SkeletonLoaderRequest />
                        <SkeletonLoaderRequest />
                        <SkeletonLoaderRequest />
                      </div>
                    )}
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
                      dataItem={getRequestRelatetoAssigneeQuery?.data?.data?.data.items}
                      joinSpecificChatRoom={joinSpecificChatRoom}
                      roleTypes={roleTypes}
                      listNotifiRemark={listNotifiRemark}
                      setListNotifiRemark={setListNotifiRemark}
                      setIsShowResultSearch={setIsShowResultSearch}
                    />
                  </div>
                )}
              </div>

              <div
                id='main-content'
                className='h-full w-3/5 p-[10px] overflow-y-scroll hide-scrollbar relative border-x border-x-gray-300'
              >
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

              <div className='relative text-gray-700 z-20 h-full top-0 flex lg:flex flex-shrink-0 flex-col w-1/5 transition-width duration-75'>
                <div className='w-full h-1/2 pt-[10px] border-y border-solid'>
                  <div className='h-7 px-[10px] text-lg font-semibold text-gray-600'>Notification</div>
                  <div className='relative w-full px-[5px] h-64 overflow-y-scroll hide-scrollbar'>
                    <div className='w-full flex flex-row gap-2 border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className='w-2/12'>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-9 w-9 !rounded-full object-cover object-center'
                        />
                      </div>
                      <div className='h-full w-10/12'>
                        <div className='flex h-1/2 w-full'>
                          <div className='w-4/5 text-sm font-semibold text-gray-700 truncate'>Nguyen Truong Phi</div>
                          <div className='w-1/5 text-xs italic text-gray-500 text-center'>5m</div>
                        </div>
                        <div className='h-1/2 w-full text-gray-500 text-xs truncate'>
                          da thay doi trang thaidfsd sdgsdfs sdfsdfsfgdfgd sdfsdfs
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='text-blue-600 h-8 text-sm flex flex-row justify-center items-center'>
                    <button className='hover:decoration-sky-500 hover:underline '>See also</button>
                  </div>
                </div>

                <div className='w-full h-1/2 p-[10px] border-y border-solid overflow-y-scroll hide-scrollbar'>
                  <div className='h-7 px-[10px] text-lg font-semibold text-gray-600'>Statistics</div>
                  <div className='relative w-full px-[5px] h-64 overflow-y-scroll hide-scrollbar'>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                    <div className='w-full flex flex-row border border-solid rounded-lg border-gray-300 p-[10px] mb-[3px]'>
                      <div className=''>
                        <img
                          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
                          alt='John Michael'
                          className='relative inline-block h-10 w-10 !rounded-full object-cover object-center'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='text-blue-600 h-8 text-sm flex flex-row justify-center items-center'>
                    <button className='hover:decoration-sky-500 hover:underline '>Detail</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
