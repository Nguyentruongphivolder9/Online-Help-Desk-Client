import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { getListAssignee } from '@/admin/apiEndpoints/dataAssignee.api'

export default function List() {
  // const [searchParamsObject, setSearchParamsObject] = useState({})
  // const [searchParams, setSearchParams] = useSearchParams()

  // const searchParamsObject = Object.fromEntries([...searchParams])

  // if (searchParamsObject.page === undefined) {
  //   searchParamsObject.page = 1
  // }

  // if (searchParamsObject.limit === undefined) {
  //   searchParamsObject.limit = 2
  // }

  // const page = Number(searchParamsObject.page) || 1

  const { data: accountResponse, isLoading } = useQuery({
    queryKey: ['request/getAssignee'],
    queryFn: async () => {
      const data = await getListAssignee()
      return data
    }
  })
  console.log(accountResponse?.data)

  return (
    <div className='max-w-7xl py-7 mx-auto px-5'>
      <div className='mb-3 py-2 xl:w-96'>
        <div className='relative mb-4 flex w-full flex-wrap items-stretch'>
          <input
            className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 '
            placeholder='Search here'
            type='text'
          />
          <span
            className='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200'
            id='basic-addon2'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
              <path
                fillRule='evenodd'
                d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
      </div>

      <div className='relative shadow-md sm:rounded-lg bg-white my-5'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-3 '>
                <span>STT</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>FullName</span>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Email</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <div className='flex justify-between'>
                  <span>Status</span>
                </div>
              </th>
              <th scope='col' className='px-6 py-3 '>
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {accountResponse?.data?.data?.map((assignee, index) => (
              <tr key={assignee.accountId} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                <th scope='row' className=' px-6 py-4'>
                  {' '}
                  {index + 1}
                </th>
                <th scope='row' className=' px-6 py-4 '>
                  {assignee.fullName}
                </th>
                <td className=' px-6 py-4'>{assignee.email}</td>
                <td className=' px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                  {assignee.statusAccount}
                </td>
                <td className='max-w-[200px] min-w-[150px]'>
                  <div className='flex items-center'>
                    <Link
                      to={`/admin/facility-header/DetailsAssignee/${assignee.accountId}`}
                      className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                    >
                      View Detail
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
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
        </div> */}
      </div>
    </div>
  )
}
