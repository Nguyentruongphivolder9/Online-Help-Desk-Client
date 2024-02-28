import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import { toast } from 'react-toastify';

import { useConvertDate } from '@/hooks/useConvertDate';
import { deleteAccount, getAccount, banAccount, activeAccount } from '@/admin/apiEndpoints/account.api';
import { calculateTotalPages } from '@/utils/calculateTotalPages';
import { getRole } from '@/admin/apiEndpoints/role.api';

export default function ManagerAccount() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchParamsObjectState, setSearchParamsObjectState] = useState(Object.fromEntries([...searchParams]))
  const [arrayAccounts, setArrayAccounts] = useState([]);
  const [reloadArrayAccounts, setReloadArrayAccounts] = useState(null);

  const navigate = useNavigate();

  if (searchParamsObjectState.page === undefined) {
    searchParamsObjectState.page = 1
  }

  if (searchParamsObjectState.limit === undefined) {
    searchParamsObjectState.limit = 2
  }

  const { data: accountResponse } = useQuery({
    queryKey: ['accounts/get-all', searchParamsObjectState, reloadArrayAccounts],
    queryFn: async () => {
      const data = await getAccount(searchParamsObjectState)
      return data
    },
    placeholderData: keepPreviousData
  })

  const { data: roleResponse, isLoading: isLoadingRoleType } = useQuery({
    queryKey: ['role/get-all'],
    queryFn: async () => {
      const data = await getRole()
      return data
    },
    placeholderData: keepPreviousData
  })

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
    setArrayAccounts(accountResponse?.data?.data.items);
    const currentSearchParams = Object.fromEntries([...searchParams])
    setSearchParamsObjectState((prev) => ({ ...prev, ...currentSearchParams }))
  }, [searchParams, accountResponse])

  const totalRequestCount = Number(accountResponse?.data?.data.totalCount) || 0;
  const limit = Number(accountResponse?.data?.data.limit);
  const totalPage = calculateTotalPages(totalRequestCount, limit);

  const addParams = (arrayObSearchParams) => {
    setSearchParams((searchParams) => {
      arrayObSearchParams.forEach((objSearchParam, index) => {
        let keyCondition = Object.keys(objSearchParam)[0]
        let valueCondition = Object.values(objSearchParam)[0]


        if (keyCondition === 'sortOrder') {
          if (searchParams.get('sortOrder') == null || searchParams.get('sortOrder') == undefined) {
            searchParams.delete('sortOrder')
          } else if (searchParams.get('sortOrder') === 'asc') {
            valueCondition = 'desc'
          } else {
            valueCondition = 'asc'
          }
        }

        if (keyCondition === 'searchTerm' && valueCondition === '') {
          searchParams.delete('searchTerm')
          setSearchParamsObjectState((prev) => ({ ...prev, searchTerm: '' }))
          return searchParams
        }

        if (keyCondition === 'sortColumn' && valueCondition === '') {
          searchParams.delete('sortColumn')
          setSearchParamsObjectState((prev) => ({ ...prev, sortColumn: '' }))
          return searchParams
        }

        if (keyCondition === 'roleName' && valueCondition === '') {
          searchParams.delete('roleName')
          setSearchParamsObjectState((prev) => ({ ...prev, roleName: '' }))
          return searchParams
        }

        if (keyCondition === 'accountStatus' && valueCondition === '') {
          searchParams.delete('accountStatus')
          setSearchParamsObjectState((prev) => ({ ...prev, accountStatus: '' }))
          return searchParams
        }

        if (keyCondition == 'page' && valueCondition) {
          searchParams.set(keyCondition, valueCondition)
          return searchParams
        }

        searchParams.set('page', 1)
        searchParams.set(keyCondition, valueCondition)
      })
      return searchParams
    })
  }

  const handleDeleteAccount = (accountId, enable) => {
    if (!enable) {
      deleteAccountId.mutate(accountId, {
        onSuccess: (response) => {
          const result = response.data
          setReloadArrayAccounts("deleted");
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
              setReloadArrayAccounts("active" + accountId);
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
              setReloadArrayAccounts("banner" + accountId);
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
    <div className='container mt-6 relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
      <div className='relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border'>
        <div className='flex flex-row items-center justify-between gap-8 mb-4'>
          <div>
            <h5 className='block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900'>
              Manager Account
            </h5>
            <p className='block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700'>
              See information about all members
            </p>
          </div>
          <div className=''>
            <Link
              to={'/admin/create-account'}
              className='text-sm rounded-lg py-4 px-5 bg-blue-500 text-white mr-10'
            >
              Add members
            </Link>
          </div>
        </div>
      </div>
      <div className='flex justify-end px-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none'>
            <svg
              className='w-5 h-5 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <input
            type='text'
            id='table-search'
            className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 '
            placeholder='Search accountId, email and name'
            onChange={(e) => addParams([{ searchTerm: e.target.value }])}

          />
        </div>
      </div>
      <div className='flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between p-4'>
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className={`btn min-h-9 h-9 border border-solid border-gray-300 bg-slate-100 focus:border-gray-800 focus:bg-sky-200 hover:bg-sky-200 text-gray-500 hover:text-gray-700 focus:text-gray-700 `}
          // ${searchParamsObjectState.limit ? 'bg-sky-500 text-white' : ''}`}
          >
            Show
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
                d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
              />
            </svg>
          </div>
          <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow  bg-slate-100 rounded-box w-40 text-black'>
            <li>
              <div
                className='border border-white focus:border-sky-300 hover:bg-sky-200'
                onClick={() => addParams([{ limit: 5 }])}
              >
                5 items
              </div>
            </li>
            <li>
              <div
                onClick={() => addParams([{ limit: 7 }])}
                className='focus:border-sky-300 hover:bg-sky-200'
              >7 items</div>
            </li>

            <li>
              {/* <div onClick={() => addParams([{ limit: 9 }])}>Show 9</div> */}
              <div onClick={() => addParams([{ limit: 9 }])} className='focus:border-sky-300 hover:bg-sky-200'>9 items</div>
            </li>
          </ul>
        </div>

        <div className='relative flex gap-2'>
          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn min-h-9 h-9 w-44 flex justify-between border border-solid border-gray-300 bg-slate-100 focus:border-gray-800 focus:bg-sky-200 hover:bg-sky-200 text-gray-500 hover:text-gray-700 focus:text-gray-700 `}
            // ${searchParamsObjectState.limit ? 'bg-sky-500 text-white' : ''}`}
            >
              {searchParamsObjectState.roleName ? searchParamsObjectState.roleName : "All Role"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow  bg-slate-100 rounded-box w-40 text-black'>
              <li>
                <div
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.roleName ? '' : 'border-sky-300 bg-sky-200'}`}
                  onClick={() => addParams([{ roleName: '' }])}
                >
                  All Role
                </div>
              </li>
              {roleResponse &&
                roleResponse?.data?.data.map((item) => (
                  <li key={item.id}>
                    <div
                      className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.roleName === item.roleName ? 'border-sky-300 bg-sky-200' : ''}`}
                      onClick={() => addParams([{ roleName: item.roleName }])}
                    >
                      {item.roleName}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className='dropdown'>
            <div
              tabIndex={0}
              role='button'
              className={`btn min-h-9 h-9 w-44 flex justify-between border border-solid border-gray-300 bg-slate-100 focus:border-gray-800 focus:bg-sky-200 hover:bg-sky-200 text-gray-500 hover:text-gray-700 focus:text-gray-700 `}
            // ${searchParamsObjectState.limit ? 'bg-sky-500 text-white' : ''}`}
            >
              {searchParamsObjectState.accountStatus ? searchParamsObjectState.accountStatus : "All Status"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>

            </div>
            <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow  bg-slate-100 rounded-box w-40 text-black'>
              <li>
                <div
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.accountStatus ? '' : 'border-sky-300 bg-sky-200'}`}
                  onClick={() => addParams([{ accountStatus: '' }])}
                >
                  All Status
                </div>
              </li>
              <li>
                <div
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.accountStatus === 'Verifying' ? 'border-sky-300 bg-sky-200' : ''}`}
                  onClick={() => addParams([{ accountStatus: 'Verifying' }])}
                >
                  Verifying
                </div>
              </li>
              <li>
                <div
                  onClick={() => addParams([{ accountStatus: 'Active' }])}
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.accountStatus === 'Active' ? 'border-sky-300 bg-sky-200' : ''}`}
                >
                  Active
                </div>
              </li>
              <li>
                <div
                  onClick={() => addParams([{ accountStatus: 'InActive' }])}
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.accountStatus === 'InActive' ? 'border-sky-300 bg-sky-200' : ''}`}
                >
                  InActive
                </div>
              </li>
              <li>
                <div
                  onClick={() => addParams([{ accountStatus: 'Banned' }])}
                  className={`focus:border-sky-300 hover:bg-sky-200 ${searchParamsObjectState.accountStatus === 'Banned' ? 'border-sky-300 bg-sky-200' : ''}`}
                >
                  Banned
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='pb-6 px-0'>
        <table className='w-full mt-4 text-left table-auto min-w-max'>
          <thead>
            <tr>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='flex items-center gap-1'>
                  <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Member
                  </div>
                  <button type='button' onClick={() => addParams([{ sortColumn: 'fullName' }, { sortOrder: 'asc' }])}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='flex items-center gap-1'>
                  <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Account number
                  </div>
                  <button type='button' onClick={() => addParams([{ sortColumn: 'accountId' }, { sortOrder: 'asc' }])}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='flex items-center gap-1'>
                  <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Role name
                  </div>
                  <button type='button' onClick={() => addParams([{ sortColumn: 'roleName' }, { sortOrder: 'asc' }])}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='flex items-center gap-1'>
                  <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Status
                  </div>
                  <button type='button' onClick={() => addParams([{ sortColumn: 'statusAccount' }, { sortOrder: 'asc' }])}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='flex items-center gap-1'>
                  <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Create date
                  </div>
                  <button type='button' onClick={() => addParams([{ sortColumn: 'createdAt' }, { sortOrder: 'asc' }])}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                      />
                    </svg>
                  </button>
                </div>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <div className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {arrayAccounts &&
              arrayAccounts.map((item) => (
                <tr key={item.accountId} className='hover:bg-sky-50 hover:cursor-pointer'>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <div className='flex items-center gap-3'>
                      {item.avatarPhoto != null ? (
                        <img
                          src={`https://storeimageohd.blob.core.windows.net/images/${item.avatarPhoto}`}
                          alt='John Michael'
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
                      <div className='flex flex-col'>
                        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                          {item.fullName}
                        </p>
                        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70'>
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                      {item.accountId}
                    </p>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                      {item.role.roleName}
                    </p>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <div className='w-max'>
                      <div className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-700 uppercase rounded-md select-none whitespace-nowrap ${handleColorStatus(`${item.statusAccount}`)}`}>
                        <span className=''>{item.statusAccount}</span>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                      {useConvertDate(item.createdAt)}
                    </p>
                  </td>
                  <td className='p-1 border-b border-blue-gray-50'>
                    <button
                      className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                      type='button'
                      onClick={() => navigate(`/admin/accounts/info/members/${item.accountId}`)}
                    >
                      <span className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </span>
                    </button>
                    <button
                      className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                      type='button'
                      onClick={() => navigate(`/admin/create-account/${item.accountId}`)}
                    >
                      <span className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          aria-hidden='true'
                          className='w-4 h-4'
                        >
                          <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z'></path>
                        </svg>
                      </span>
                    </button>
                    <div className='dropdown dropdown-bottom dropdown-end'>
                      <button
                        className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                        type='button'
                        tabIndex={3}
                      >
                        <span className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                          </svg>

                        </span>
                      </button>
                      <div tabIndex={3} className="dropdown-content z-10 p-1 w-36 bg-gray-100 rounded-lg shadow border right-0">
                        <ul className="space-y-1 text-gray-700">
                          <li className="font-medium text-sm">
                            <button
                              onClick={() => handleDeleteAccount(item.accountId, item.enable)}
                              className={`${item.enable ? "text-gray-500 opacity-30 bg-red-200" : "bg-red-300 hover:bg-slate-200 hover:text-red-300"} flex items-center w-full p-[5px] rounded-md transform transition-colors duration-200 border-r-4 border-transparent`}
                            >
                              <div className="mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </div>
                              Delete
                            </button>
                          </li>
                          <li className="font-medium text-sm">
                            <button
                              onClick={() => handleBanAccount(item.accountId, item.enable, item.isBanned)}
                              className={`${item.enable ? "hover:bg-slate-200" : "text-gray-500 opacity-30 bg-red-200"} ${item.isBanned ? "hover:text-green-600 bg-green-400" : "hover:text-orange-400 bg-orange-400"} flex items-center w-full p-[5px] rounded-md transform transition-colors duration-200 border-r-4 border-transparent`}
                            >
                              <div className="mr-3">
                                {item.isBanned ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21" />
                                  </svg>
                                )}
                              </div>
                              {item.isBanned ? "Active" : "Banned"}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
        <nav
          className='w-full flex items-center justify-between flex-column flex-wrap md:flex-row pt-4 gap-3'
          aria-label='Table navigation'
        >
          <div className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
            Page
            <span className='font-semibold text-gray-700 '>
              {' '}
              {searchParamsObjectState.page}/{totalPage}{' '}
            </span>
          </div>
          <div aria-label='Page navigation example'>
            {totalPage > 1 && (
              <div className='flex items-center gap-1'>
                <Button
                  variant='text'
                  className='flex items-center gap-1 border border-solid'
                  onClick={() => addParams([{ page: 1 }])}
                  disabled={searchParamsObjectState.page == 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                  </svg>
                </Button>
                <Button
                  variant='text'
                  className='flex items-center gap-1 border border-solid'
                  onClick={() => addParams([{ page: +searchParamsObjectState.page - 1 }])}
                  disabled={searchParamsObjectState.page == 1}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
                  </svg>
                  PreviousPage
                </Button>
                {/* <div className='flex items-center gap-2'>
                  {totalPageArray.map((page) => (
                    <IconButton {...getItemProps(page)} className='text-gray-700' key={page}>
                      {page}
                    </IconButton>
                  ))}
                </div> */}
                <Button
                  variant='text'
                  className='flex items-center gap-1 border border-solid'
                  onClick={() => addParams([{ page: +searchParamsObjectState.page + 1 }])}
                  disabled={searchParamsObjectState.page == totalPage}
                >
                  NextPage
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
                  </svg>
                </Button>
                <Button
                  variant='text'
                  className='flex items-center gap-1 border border-solid'
                  onClick={() => addParams([{ page: totalPage }])}
                  disabled={searchParamsObjectState.page == totalPage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                  </svg>

                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
