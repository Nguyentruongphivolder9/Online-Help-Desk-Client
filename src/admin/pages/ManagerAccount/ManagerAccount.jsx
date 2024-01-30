import React, { useEffect, useState } from 'react'
import { useQuery, QueryClient } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useConvertDate } from '@/utils/useConvertDate'
import { getRoleType } from '@/admin/apiEndpoints/dataRoleType.api'
import { getAccount } from '@/admin/apiEndpoints/dataAccount.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'

export default function ManagerAccount() {
  const navigate = useNavigate()
  const [activeButton, setActiveButton] = useState('All')
  // const [accountData, setAccountData] = useState({});
  // const [roleTypeData, setRoleTypeData] = useState({});

  // const handleButtonClick = () => {
  //   navigate('/admin?page=1&limit=2');
  // };

  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('All');


  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  if (searchParamsObject.page === undefined) {
    searchParamsObject.page = 1
  }

  if (searchParamsObject.limit === undefined) {
    searchParamsObject.limit = 1
  }

  console.log(searchParamsObject);

  const { data: accountResponse, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['accounts/get-all'],
    queryFn: async () => {
      const data = await getAccount(searchParamsObject);
      return data;
    },
    // enabled: true
  });

  const { data: roleTypeResponse, isLoading: isLoadingRoleType } = useQuery({
    queryKey: ['roleTypes/get-all'],
    queryFn: async () => {
      const data = await getRoleType()
      return data
    }
  })

  const handleButtonClick = (roleType) => {
    setActiveButton(roleType)
  }

  return (
    <div className='container relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
      <div className='relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border'>
        <div className='flex items-center justify-between gap-8 mb-8'>
          <div>
            <h5 className='block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900'>
              Manager Account
            </h5>
            <p className='block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700'>
              See information about all members
            </p>
          </div>
          {/* <div className */}
        </div>
        {/* <div className="flex flex-col items-center justify-between gap-4 md:flex-row p-[10px]"> */}
        <div className='flex w-full overflow-hidden md:w-max items-center'>
          <button
            type="button"
            onClick={() => handleButtonClick("All")}
            className={`${activeButton === 'All' ? 'text-blue-700 z-10 ring-4 ring-gray-200' : 'text-gray-900'} py-2.5 my-2 ml-2 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 `}
          >
            All
          </button>
          {roleTypeResponse && roleTypeResponse?.data?.data.map(item => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleButtonClick(item.roleTypeName)}
              className={`${activeButton == item.roleTypeName ? 'text-blue-700 z-10 ring-4 ring-gray-200' : 'text-gray-900'} py-2.5 my-2 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700`}
            >
              {item.roleTypeName}
            </button>
          ))}
        </div>
        {/* </div> */}
      </div>
      <div className='p-6 px-0'>
        <table className='w-full mt-4 text-left table-auto min-w-max'>
          <thead>
            <tr>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                  Member
                </p>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                  Account number
                </p>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                  Role name
                </p>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                  Status
                </p>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                  Create date
                </p>
              </th>
              <th className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'></p>
              </th>
            </tr>
          </thead>
          <tbody>
            {accountResponse &&
              accountResponse?.data?.data.items.map((item) => (
                <tr key={item.accountId}>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <div className='flex items-center gap-3'>
                      <img
                        src='https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg'
                        alt='John Michael'
                        className='relative inline-block h-9 w-9 !rounded-full object-cover object-center'
                      />
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
                      <div className='relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20'>
                        <span className=''>{item.statusAccount}</span>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
                      {useConvertDate(item.createdAt)}
                    </p>
                  </td>
                  <td className='p-4 border-b border-blue-gray-50'>
                    <button
                      className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                      type='button'
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
          Page 1 of {calculateTotalPages(accountResponse?.data?.data.totalCount, accountResponse?.data?.data.limit)}
        </p>
        <div className='flex gap-2'>
          <button
            className='select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            Previous
          </button>
          <button
            className='select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
