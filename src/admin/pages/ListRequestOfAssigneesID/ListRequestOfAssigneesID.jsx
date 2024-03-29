import React, { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getListRequestOfAssignee, getRequestStatus } from '@/admin/apiEndpoints/dataRequest.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { useConvertDate } from '@/hooks/useConvertDate'
import { Button, IconButton } from '@material-tailwind/react'

const getColorClass = (statusName) => {
  switch (statusName) {
    case 'Open':
      return {
        background: 'bg-[#3300FF]',
        text: 'text-[#3300FF]',
        borderColor: 'border-[#3300FF]'
      }
    case 'Assigned':
      return {
        background: 'bg-[#FFFF00]',
        text: 'text-[#FFFF00]',
        borderColor: 'border-[#FFFF00]'
      }
    case 'Work in progress':
      return {
        background: 'bg-[#FF6600]',
        text: 'text-[#FF6600]',
        borderColor: 'border-[#FF6600]'
      }
    case 'Need more info':
      return {
        background: 'bg-[#FF0033]',
        text: 'text-[#FF0033]',
        borderColor: 'border-[#FF0033]'
      }
    case 'Rejected':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    case 'Completed':
      return {
        background: 'bg-[#33FF33]',
        text: 'text-[#33FF33]',
        borderColor: 'border-[#33FF33]'
      }
    case 'Closed':
      return {
        background: 'bg-[#FF0000]',
        text: 'text-[#FF0000]',
        borderColor: 'border-[#FF0000]'
      }
    default:
      return {
        background: 'bg-[#808080]',
        text: 'text-[#808080]',
        borderColor: 'border-[#808080]'
      }
  }
}

export default function ListRequestOfAssigneesId() {
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [sortStatus, setSortStatus] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  const [statusName, setStatusName] = useState('')

  useEffect(() => {
    searchParams.set('page', page)
    searchParams.set('limit', limit)

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
    if (sortStatus) {
      searchParams.set('sortStatus', sortStatus)
    } else {
      searchParams.delete('sortStatus')
    }

    setSearchParams(searchParams)
  }, [sortColumn, sortOrder, searchTerm, sortStatus, page, limit])

  const { data: requestQuery } = useQuery({
    queryKey: ['assignee/listRequestOfAssignee', searchParamsObject, id],
    queryFn: async () => {
      const data = await getListRequestOfAssignee(searchParamsObject, id)
      return data
    }
  })
  console.log(requestQuery?.data)

  const { data: ListRequestStatus } = useQuery({
    queryKey: ['request/getListRequestStatus'],
    queryFn: async () => {
      const data = await getRequestStatus()
      return data
    }
  })

  const totalPage = calculateTotalPages(requestQuery?.data?.data.totalCount, limit)
  const totalPageArray = Array.from({ length: totalPage }, (_, index) => index + 1)

  const nextPage = () => {
    if (page === 5) return

    setPage(page + 1)
  }

  const previousPage = () => {
    if (page === 1) return

    setPage(page - 1)
  }

  const getItemProps = (index) => ({
    variant: page === index ? 'gradient' : 'outlined',
    color: 'gray',
    onClick: () => setPage(index)
  })

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

  const handleSortStatus = (e) => {
    setSortStatus(e.target.value)
  }

  return (
    <div className='container mt-6 p-4 relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
      <h2 className='text-l font-extrabold tracking-tight text-gray-900 sm:text-2xl px-5 py-4'>
        All Request Of the Assignee ID : <span className='text-green-500'> {id} </span>
      </h2>
      {/* search input */}
      <div className='mb-3 py-2 w-full flex flex-row justify-between items-center'>
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
            placeholder='Search Room,Department'
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          id='roomId'
          className='w-60 bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block p-2.5 transition delay-500 outline-none'
          value={statusName}
          onChange={handleSortStatus}
        >
          <option value=''>Select StatusName</option>
          <option value=''>All</option>
          {ListRequestStatus &&
            ListRequestStatus?.data?.data.map((item) => (
              <option key={item.id} value={`${item.statusName}`} className='hover:bg-slate-400'>
                {item.statusName}
              </option>
            ))}
        </select>
      </div>
      {/* list request */}
      <div className='relative shadow-md sm:rounded-lg bg-white my-5'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
            <tr>
              <th scope='col' className='px-6 py-3 '>
                <span>Department</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Room</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>SeveralLevel</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Status Request</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Create At</span>
                  <button type='button' onClick={() => handleSortColumn('createdAt')}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4 text-gray-900'
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
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Update At</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {requestQuery &&
              requestQuery?.data?.data?.items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-l-4 ${getColorClass(item?.requestStatus?.statusName).borderColor}  hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  <th scope='row' className=' px-6 py-4'>
                    {item.request.room.departments.departmentName}
                  </th>
                  <th scope='row' className=' px-6 py-4 '>
                    {item.request.room.roomNumber}
                  </th>
                  <td className=' px-6 py-4'>{item.request.severalLevel}</td>
                  <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    <div
                      className={`grid items-center max-w-[150px] p-1 justify-center font-sans text-xs font-bold 
                      ${item.request.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(item.request.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                    >
                      {item.request.requestStatus.statusName}
                    </div>
                  </td>
                  <td className=' px-6 py-4'>{useConvertDate(item.request.createdAt)}</td>
                  <td className=' px-6 py-4'>{useConvertDate(item.request.updateAt)}</td>
                  <td className='max-w-[200px] min-w-[150px]'>
                    <div className='flex items-center'>
                      <Link
                        className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                        to={`/admin/facility-header/requests/${item.request.id}`}
                      >
                        View Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
          <nav
            className='w-full flex items-center justify-between flex-column flex-wrap md:flex-row pt-4 gap-3'
            aria-label='Table navigation'
          >
            <div className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
              Page
              <span className='font-semibold text-gray-700 '>
                {page}/{totalPage}
              </span>
            </div>
            <div aria-label='Page navigation example'>
              {totalPage > 1 && (
                <div className='flex items-center gap-4'>
                  <Button
                    variant='text'
                    className='flex items-center gap-2'
                    onClick={previousPage}
                    disabled={page === 1}
                  >
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
    </div>
  )
}
