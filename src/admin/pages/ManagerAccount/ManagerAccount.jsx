import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button, IconButton } from '@material-tailwind/react'

import { useConvertDate } from '@/utils/useConvertDate'
import { getRoleType } from '@/admin/apiEndpoints/dataRoleType.api'
import { getAccount } from '@/admin/apiEndpoints/dataAccount.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'

export default function ManagerAccount() {
  const [activeRoleType, setActiveRoleType] = useState('All')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(2)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])

  useEffect(() => {
    searchParams.set('page', page)
    searchParams.set('limit', limit)

    if (activeRoleType !== 'All' && activeRoleType) {
      searchParams.set('roleType', activeRoleType)
    } else {
      searchParams.delete('roleType')
    }

    if (searchTerm) {
      searchParams.set('searchTerm', searchTerm)
    } else {
      searchParams.delete('searchTerm')
    }

    if (sortColumn) {
      searchParams.set('sortColumn', sortColumn)
    } else {
      searchParams.delete('sortColumn')
    }

    if (sortOrder) {
      searchParams.set('sortOrder', sortOrder)
    } else {
      searchParams.delete('sortOrder')
    }

    setSearchParams(searchParams)
  }, [sortColumn, sortOrder, searchTerm, activeRoleType, page, limit])

  const { data: accountResponse, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['accounts/get-all', searchParamsObject],
    queryFn: async () => {
      const data = await getAccount(searchParamsObject)
      return data
    }
  })

  const { data: roleTypeResponse, isLoading: isLoadingRoleType } = useQuery({
    queryKey: ['roleTypes/get-all'],
    queryFn: async () => {
      const data = await getRoleType()
      return data
    }
  })

  const totalPage = calculateTotalPages(accountResponse?.data?.data.totalCount, limit)
  const totalPageArray = Array.from({ length: totalPage }, (_, index) => index + 1)

  const handleButtonClick = (roleType) => {
    setActiveRoleType(roleType)
  }

  const getItemProps = (index) => ({
    variant: page === index ? 'gradient' : 'outlined',
    color: 'gray',
    onClick: () => setPage(index)
  })

  const nextPage = () => {
    if (page === 5) return

    setPage(page + 1)
  }

  const previousPage = () => {
    if (page === 1) return

    setPage(page - 1)
  }

  const handleSortColumn = (column) => {
    if (sortColumn == column) {
      if (sortOrder == 'asc') {
        setSortOrder('desc')
      } else {
        setSortOrder('asc')
      }
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleIncrement = () => {
    setLimit(limit + 5)
  }

  const handleDecrement = () => {
    if (limit > 0 && limit - 5 > 0) {
      setLimit(limit - 5)
    }
  }

  return (
    <div className='container relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
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
            type='button'
            onClick={() => handleButtonClick('All')}
            className={`${activeRoleType === 'All' ? 'text-blue-700 z-10 ring-4 ring-gray-200' : 'text-gray-900'} py-2.5 my-2 ml-2 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 `}
          >
            All
          </button>
          {roleTypeResponse &&
            roleTypeResponse?.data?.data.map((item) => (
              <button
                type='button'
                key={item.id}
                onClick={() => handleButtonClick(item.roleTypeName)}
                className={`${activeRoleType == item.roleTypeName ? 'text-blue-700 z-10 ring-4 ring-gray-200' : 'text-gray-900'} py-2.5 my-2 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700`}
              >
                {item.roleTypeName}
              </button>
            ))}
        </div>
        {/* </div> */}
      </div>
      <div className='flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between p-4'>
        <div className='dropdown'>
          <div className='flex flex-row items-center custom-number-input  h-10 w-36'>
            <label htmlFor='custom-input-number' className='w-full text-gray-700 text-xs font-semibold'>
              Items
            </label>
            <div className='flex flex-row items-center  h-7 w-24 border-solid border-2 border-sky-500 rounded-l relative bg-transparent mt-1'>
              <button
                data-action='decrement'
                className=' text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-16 cursor-pointer outline-none'
                onClick={handleDecrement}
              >
                <span className='m-auto text-sm font-thin'>−</span>
              </button>
              <input
                type='number'
                className='focus:outline-none text-center w-full bg-gray-300 font-semibold text-sm hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none'
                name='custom-input-number'
                value={limit}
                readOnly
              />
              <button
                data-action='increment'
                className=' text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-16 cursor-pointer'
                onClick={handleIncrement}
              >
                <span className='m-auto text-sm font-thin'>+</span>
              </button>
            </div>
          </div>
        </div>

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
            placeholder='Search for items'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <button type='button' onClick={() => handleSortColumn('fullName')}>
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
                  <button type='button' onClick={() => handleSortColumn('accountId')}>
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
                  <button type='button' onClick={() => handleSortColumn('roleName')}>
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
                  <button type='button' onClick={() => handleSortColumn('statusAccount')}>
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
                  <button type='button' onClick={() => handleSortColumn('createdAt')}>
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
        <nav
          className='w-full flex items-center justify-between flex-column flex-wrap md:flex-row pt-4 gap-3'
          aria-label='Table navigation'
        >
          <div className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
            Page
            <span className='font-semibold text-gray-700 '>
              {' '}
              {page}/{totalPage}{' '}
            </span>
          </div>
          <div aria-label='Page navigation example'>
            {totalPage > 1 && (
              <div className='flex items-center gap-4'>
                <Button variant='text' className='flex items-center gap-2' onClick={previousPage} disabled={page === 1}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
                  </svg>
                  PreviousPage
                </Button>
                <div className='flex items-center gap-2'>
                  {totalPageArray.map((page) => (
                    <IconButton {...getItemProps(page)} className='text-gray-700' key={page}>
                      {page}
                    </IconButton>
                  ))}
                </div>
                <Button
                  variant='text'
                  className='flex items-center gap-2'
                  onClick={nextPage}
                  disabled={page === totalPage}
                >
                  NextPage
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
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
