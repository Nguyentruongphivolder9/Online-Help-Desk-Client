import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConvertDate } from '@/utils/useConvertDate'
import { Link, useSearchParams } from 'react-router-dom'
import { getRequest } from '@/admin/apiEndpoints/dataRequest.api'
import React from 'react'

const getColorClass = (statusName) => {
  switch (statusName) {
    case 'Open':
      return {
        background: 'bg-[#3300FF]',
        text: 'text-[#3300FF]', // Màu chữ trắng khi nền màu xanh
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

export default function List() {
  const queryClient = useQueryClient()
  // const [searchParamsObject, setSearchParamsObject] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()

  // useEffect(() => {
  //   setSearchParamsObject(Object.fromEntries([...searchParams]))
  // }, [searchParams])

  const searchParamsObject = Object.fromEntries([...searchParams])

  if (searchParamsObject.page === undefined) {
    searchParamsObject.page = 1
  }

  if (searchParamsObject.limit === undefined) {
    searchParamsObject.limit = 1
  }

  const page = Number(searchParamsObject.page) || 1

  console.log(searchParamsObject)

  const requestsQuery = useQuery({
    queryKey: ['requests', searchParamsObject],
    queryFn: () => getRequest(searchParamsObject)
  })

  const totalRequestCount = Number(requestsQuery?.data?.data?.data.totalCount) || 0
  const limit = Number(requestsQuery?.data?.data?.data.limit)
  const totalPage = Math.ceil(totalRequestCount / limit)
  console.log(totalPage)

  return (
    <div className='max-w-7xl mx-auto px-5'>
      {/* <Link
        className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
        to={'/client/request/archived'}
      >
        View archived requests
      </Link> */}
      <div className='relative shadow-md sm:rounded-lg bg-white my-5'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-3 max-w-[300px]'>
                <span>Department (Room)</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Level</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Description</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>CreateAt</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Status</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Assignee</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Action</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {requestsQuery.data?.data?.data.items.map((request, index) => (
              <tr
                key={request.id}
                className={`border-l-4 ${getColorClass(request?.requestStatus?.statusName).borderColor}  hover:bg-gray-50 dark:hover:bg-gray-600`}
              >
                <th
                  scope='row'
                  className=' px-6 py-4 font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis uppercase'
                >
                  {request.room.departments.departmentName} ({request.room.roomNumber})
                </th>
                <td className=' px-6 py-4'>{request.severalLevel}</td>
                <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                  {request.description}
                </td>
                <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                  {useConvertDate(request.createdAt)}
                </td>
                <td>
                  <div
                    className={`relative  grid items-center p-1 justify-center font-sans text-xs font-bold 
                      ${request?.requestStatus?.statusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClass(request?.requestStatus?.statusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                  >
                    {request?.requestStatus?.statusName}
                  </div>
                </td>
                <td className=' px-6 py-4'>{request?.processByAssignees[0]?.account?.fullName}</td>
                <td className='max-w-[200px] min-w-[150px]'>
                  <div className='flex items-center'>
                    <Link
                      to={`/admin/facility-header/${request?.id}`}
                      className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav
          className='flex items-center flex-column flex-wrap md:flex-row justify-between p-4 mt-2'
          aria-label='Table navigation'
        >
          <span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
            Showing <span className='font-semibold text-gray-900 dark:text-white'>1-10</span> of{' '}
            <span className='font-semibold text-gray-900 dark:text-white'>1000</span>
          </span>
          <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
            <li>
              {page === 1 ? (
                <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                  Previous
                </span>
              ) : (
                <Link
                  className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                  to={`/admin/facility-header?page=${page - 1}&limit=${searchParamsObject.limit}`}
                >
                  Previous
                </Link>
              )}
            </li>
            {!requestsQuery.isLoading &&
              Array(totalPage)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <li key={pageNumber}>
                      <Link
                        to={`/admin/facility-header?page=${pageNumber}&limit=${searchParamsObject.limit}`}
                        className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      >
                        {pageNumber}
                      </Link>
                    </li>
                  )
                })}
            <li>
              {page === totalPage ? (
                <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                  Next
                </span>
              ) : (
                <Link
                  className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                  to={`/admin/facility-header?page=${page + 1}&limit=${searchParamsObject.limit}`}
                >
                  Next
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
