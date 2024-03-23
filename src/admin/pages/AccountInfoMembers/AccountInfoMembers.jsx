import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'react-toastify';
import { activeAccount, banAccount, deleteAccount, getAccountById } from '@/admin/apiEndpoints/account.api';

export default function AccountInfoMembers() {
  const { id: accountId } = useParams();
  const [dataMyProfile, setDataMyProfile] = useState(null);
  const [reloadArrayAccounts, setReloadArrayAccounts] = useState(null);
  const navigate = useNavigate()

  const { data: myProfileAccount } = useQuery({
    queryKey: ['account/myProfile', accountId, reloadArrayAccounts],
    queryFn: async () => {
      const data = await getAccountById(accountId);
      return data;
    },
    placeholderData: keepPreviousData
  });

  const deleteAccountId = useMutation({
    mutationFn: (body) => {
      return deleteAccount(body)
    }
  });

  const banAccountId = useMutation({
    mutationFn: (body) => {
      return banAccount(body)
    }
  });

  const activeAccountId = useMutation({
    mutationFn: (body) => {
      return activeAccount(body)
    }
  });

  useEffect(() => {
    setDataMyProfile(myProfileAccount?.data?.data);
  }, [myProfileAccount])

  const handleDeleteAccount = (accountId, enable) => {
    if (!enable) {
      deleteAccountId.mutate(accountId, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            navigate('/admin')
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
          } else {
            toast.error(`${result.statusMessage}`, {
              position: "top-right",
              autoClose: 3000,
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

  const handleBanAccount = (accountId, enable, isBanned) => {
    if (enable) {
      if (isBanned) {
        activeAccountId.mutate(accountId, {
          onSuccess: (response) => {
            const result = response.data
            if (result.isSuccess) {
              setReloadArrayAccounts(new Date());
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
            } else {
              toast.error(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 3000,
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
      } else {
        banAccountId.mutate(accountId, {
          onSuccess: (response) => {
            const result = response.data
            if (result.isSuccess) {
              setReloadArrayAccounts(new Date());
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
            } else {
              toast.error(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 3000,
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
  }

  const handleColorStatus = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-400"
      case "Banned":
        return "bg-orange-400"
      case "Verifying":
        return "bg-blue-400"
      default:
        return;
    }
  }

  return (
    <>
      {dataMyProfile && (
        <div className="relative mt-6 flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
          <div className='p-3 border-b border-solid mb-4 px-6'>
            <div className='text-2xl font-semibold'>
              Member's information
            </div>
            <div className='text-sm text-gray-600'>
              Account banning or opening activity for the member's account
            </div>
          </div>
          <div className="bg-gray-100 flex flex-row px-20">
            <div className='h-full w-60 flex py-10'>
              <div className='w-60 h-80 rounded-md focus:shadow-outline bg-gray-100 shadow-sm'>
                {dataMyProfile.avatarPhoto != null ? (
                  <img
                    src={`https://storeimageohd.blob.core.windows.net/images/${dataMyProfile.avatarPhoto}`}
                    alt={dataMyProfile.fullName}
                    className='relative inline-block h-full w-full rounded-md object-cover object-center'
                  />
                ) : (
                  <div className="flex w-full h-full bg-gray-300 overflow-hidden relative rounded items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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
                <div className='w-7/12'>
                  {dataMyProfile.accountId}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Full name</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.fullName}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Birthday</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.birthday}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Gender</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.gender}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Role</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.role.roleName}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Account status</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  <div className={`w-28 rounded-md py-1 px-2 text-center ${handleColorStatus(dataMyProfile.statusAccount)}`}>
                    {dataMyProfile.statusAccount}
                  </div>
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Email Address</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.email}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Phone number</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.phoneNumber}
                </div>
              </div>
              <div className='flex flex-row py-2 border-b border-solid'>
                <div className='w-5/12 flex justify-between'>
                  <span>Address</span>
                  <span className='mr-6'>:</span>
                </div>
                <div className='w-7/12'>
                  {dataMyProfile.address}
                </div>
              </div>

              <div className='flex justify-between items-center mt-5'>
                <div className='flex flex-row gap-2'>
                  <button
                    onClick={() => handleDeleteAccount(dataMyProfile.accountId, dataMyProfile.enable)}
                    className={`${dataMyProfile.enable ? "text-gray-500 opacity-30 bg-red-200" : "bg-red-300 hover:bg-slate-200 hover:text-red-300"} flex items-center p-[10px] rounded-md transform transition-colors duration-200 border-r-4 border-transparent`}
                  >
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    Delete
                  </button>
                  <button
                    onClick={() => handleBanAccount(dataMyProfile.accountId, dataMyProfile.enable, dataMyProfile.isBanned)}
                    className={`${dataMyProfile.enable ? "hover:bg-slate-200" : "text-gray-500 opacity-30 bg-red-200"} ${dataMyProfile.isBanned ? "hover:text-green-600 bg-green-400" : "hover:text-orange-400 bg-orange-400"} flex items-center p-[10px] rounded-md transform transition-colors duration-200 border-r-4 border-transparent`}
                  >
                    <div className="mr-3">
                      {dataMyProfile.isBanned ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21" />
                        </svg>
                      )}
                    </div>
                    {dataMyProfile.isBanned ? "Active" : "Banned"}
                  </button>
                </div>
                <div className='w-32 text-center mr-20 p-3 bg-sky-600 text-white text-sm rounded-md'>
                  <Link to={`/admin/accounts/edit/${accountId}`}>
                    Edit account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
