import { getAllDepartmentSSFP, createDepartment } from '@/admin/apiEndpoints/department.api'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { Button, IconButton } from '@material-tailwind/react'

export default function CreateDepartments() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(2)
  const [searchTerm, setSearchTerm] = useState('')
  const [department, setDepartmentName] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])

  useEffect(() => {
    searchParams.set('page', page)
    searchParams.set('limit', limit)

    if (searchTerm) {
      searchParams.set('searchTerm', searchTerm)
    } else {
      searchParams.delete('searchTerm')
    }
    setSearchParams(searchParams)
  }, [searchTerm, page, limit])

  const { data: allDepartment } = useQuery({
    queryKey: ['department/getAllSSFP', searchParamsObject],
    queryFn: async () => {
      const data = await getAllDepartmentSSFP(searchParamsObject)
      return data
    }
  })
  console.log(allDepartment)

  const handleSubmit = () => {
    const re = {
      departmentName: department
    }
    if (re.departmentName) {
      createDe.mutate(re, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            setSuccessMessage('Create successfully')
            setError(null)
          } else {
            setError(result.statusMessage)
            setSuccessMessage(null)
          }
        },
        onError: (error) => {
          setError('An error occurred while updating the process.')
          setSuccessMessage(null)
        }
      })
    }
  }

  const createDe = useMutation({
    mutationFn: (body) => {
      return createDepartment(body)
    }
  })

  const totalPage = calculateTotalPages(allDepartment?.data?.data.totalCount, limit)
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

  return (
    <>
      {/* form create department */}
      <div className='bg-white  rounded-lg shadow '>
        <div className='p-6 space-y-6'>
          {error && <h2 className='text-l font-medium leading-6 text-red-600'>Error: {error}</h2>}
          {successMessage && <h2 className='text-l font-medium leading-6 text-green-600'>Success: {successMessage}</h2>}
          <form action='#'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                  Department Name :
                </label>
                <input
                  type='text'
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* list department */}
      <div className=' overflow-hidden w-full mt-5'>
        <div className='mb-3 py-2 '>
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
              placeholder='Search here '
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        <div className='relative rounded-lg shadow bg-white '>
          <table className='w-full text-sm text-left  rtl:text-right text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
              <tr>
                <th scope='col' className='px-6 py-3 '>
                  <span>STT </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Department Name </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Status </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allDepartment &&
                allDepartment?.data?.data?.items.map((item, index) => (
                  <tr key={item.id} className='hover:bg-gray-100 dark:hover:bg-gray-600'>
                    <td scope='row' className=' px-6 py-4 font-bold '>
                      {index + 1}
                    </td>
                    <td scope='row' className=' px-6 py-4 font-bold'>
                      {item.departmentName}
                    </td>
                    <td scope='row' className=' px-6 py-4 font-bold'>
                      {item.statusDepartment ? 'In Use' : 'False'}
                    </td>
                    <td className='max-w-[200px] min-w-[150px]'>
                      <div className='flex items-center'>
                        <button
                          className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                          type='button'
                          // onClick={() => navigate(`/admin/create-account/${item.accountId}`)}
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
          </div>
        </div>
      </div>
    </>
  )
}
