import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAccountById } from '@/admin/apiEndpoints/account.api'

export default function AccountInfo({ isUser }) {
  const { id: accountId } = useParams()
  const [dataMyProfile, setDataMyProfile] = useState(null)
  const navigate = useNavigate()

  const { data: myProfileAccount } = useQuery({
    queryKey: ['account/myProfile', accountId],
    queryFn: async () => {
      const data = await getAccountById(accountId)
      return data
    }
  })

  useEffect(() => {
    setDataMyProfile(myProfileAccount?.data?.data)
  }, [myProfileAccount])

  const handleColorStatus = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-400'
      case 'Banned':
        return 'bg-orange-400'
      case 'Verifying':
        return 'bg-blue-400'
      default:
        return
    }
  }

  return (
    <>
      {dataMyProfile && (
        <div
          className={`relative ${isUser ? 'mt-20' : 'mt-6'} flex  flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border`}
        >
          <div className='p-3 border-b border-solid mb-4 px-6'>
            <div className='text-2xl font-semibold'>My Profile</div>
            <div className='text-sm text-gray-600'>Manage profile information for account security</div>
          </div>
          <div className='bg-gray-100 flex flex-row px-20'>
            <div className='h-full w-60 flex py-10'>
              <div className='w-60 h-80 rounded-md focus:shadow-outline overflow-hidden bg-gray-100 shadow-sm'>
                {dataMyProfile.avatarPhoto != null ? (
                  <img
                    src={`https://storeimageohd.blob.core.windows.net/images/${dataMyProfile.avatarPhoto}`}
                    alt={dataMyProfile.fullName}
                    className='relative inline-block h-full w-full object-cover object-center'
                  />
                ) : (
                  <div className='flex w-full h-full bg-gray-300 overflow-hidden relative rounded items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-16 h-16 text-gray-400'
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
            <div className='h-full w-2/3 py-7 px-10'>
              <div className='flex flex-row py-2 border-b border-t border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Account Code</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.accountId}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Full name</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.fullName}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Birthday</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.birthday}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Gender</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.gender}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Role</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.role.roleName}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Account status</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  <div
                    className={`w-28 rounded-md py-1 px-2 text-center ${handleColorStatus(dataMyProfile.statusAccount)}`}
                  >
                    {dataMyProfile.statusAccount}
                  </div>
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Email Address</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.email}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Phone number</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.phoneNumber}</div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Address</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>{dataMyProfile.address}</div>
              </div>

              <div className='text-end'>
                <button
                  onClick={() => navigate('/users/send-mail')}
                  className='mr-20 p-4 bg-sky-600 mt-5 text-white text-sm rounded-md'
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
