import { getAllRequestStatus, getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import React, { useEffect, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useParams, useNavigate, Outlet, useOutletContext } from 'react-router-dom'

export default function CenterAssigneesHome() {
  const [connect, joinSpecificChatRoom, infoConnectState, setInfoConnectState, listRemarkState, setListRemarkState] = useOutletContext()
  const [requestObjectById, setRequestObjectById] = useState(null);
  const [showPage, setShowPage] = useState("Details");
  const { id: requestId } = useParams();
  const navigate = useNavigate()

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
  }, [getRequestById])

  const handleShowPage = (page) => {
    if (page == "Remark") {
      setShowPage(page)
      navigate(`/admin/assignees/requests/${requestObjectById.id}/remark`);
    } else if (page == "Details") {
      setShowPage(page)
      navigate(`/admin/assignees/requests/${requestObjectById.id}`);
    }
  }

  return (
    <>
      {requestObjectById && (
        <div className='w-full h-full'>
          <div className='flex flex-row justify-between items-center border-b border-solid border-gray-300 p-3'>
            <div>
              <div className='text-2xl text-gray-600 font-semibold'>
                Request Details
              </div>
              <div className='flex flex-row'>
                <div onClick={() => handleShowPage("Details")} className={`text-sm p-2 border-b cursor-pointer  ${showPage == "Details" ? "text-blue-500 border-blue-300" : "text-gray-500"}`}>
                  Details
                </div>
                <div onClick={() => handleShowPage("Remark")} className={`text-sm p-2 border-b cursor-pointer  ${showPage == "Remark" ? "text-blue-500 border-blue-300" : "text-gray-500"}`}>
                  Remark
                </div>
              </div>
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
          <div>
            <Outlet
              context={[
                connect,
                joinSpecificChatRoom,
                infoConnectState,
                setInfoConnectState,
                listRemarkState,
                setListRemarkState,
                requestObjectById
              ]}
            ></Outlet>
          </div>
        </div>
      )}
    </>
  )
}
