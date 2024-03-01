import { getAllDepartment } from '@/admin/apiEndpoints/department.api'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createRoom, getAllRoomSSFP, changeStatusRoom } from '@/admin/apiEndpoints/room.api'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { Button, IconButton } from '@material-tailwind/react'
import { toast } from 'react-toastify'

export default function CreateRoom() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(7)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDepartment, setSortDepartment] = useState('')

  const [departmentName, setDepartmentName] = useState('')
  const [departmentID, setDepartmentId] = useState('')
  const [Number, setRoomNumber] = useState('')

  const [reloadThenSubmitSuccess, setReloadThenSubmitSuccess] = useState(null)

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
    if (sortDepartment) {
      searchParams.set('SortDepartmentName', sortDepartment)
    } else {
      searchParams.delete('SortDepartmentName')
    }
    setSearchParams(searchParams)
  }, [searchTerm, sortDepartment, page, limit])

  const { data: allDepartment } = useQuery({
    queryKey: ['department/getAll'],
    queryFn: async () => {
      const data = await getAllDepartment()
      return data
    }
  })

  const { data: allRoom } = useQuery({
    queryKey: ['rooms/getAllSSFP', searchParamsObject],
    queryFn: async () => {
      const data = await getAllRoomSSFP(searchParamsObject)
      return data
    }
  })

  const handleSubmit = () => {
    const re = {
      departmentId: departmentID,
      roomNumber: Number
    }
    if (re.departmentId && re.roomNumber) {
      createRo.mutate(re, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            setReloadThenSubmitSuccess(new Date())
            toast.success(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          } else if (result.isFailure) {
            toast.error(`${result.validationsErrors[0].description}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          } else {
            toast.error(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          }
        },
        onError: (error) => {
          setError('An error occurred while updating the process.')
          setSuccessMessage(null)
        }
      })
    } else {
      toast.error(`Some field are blank or empty!!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    }
  }

  const submitUpdate = (id, status) => {
    const updateData = {
      id: id,
      status: status
    }
    console.log(updateData)
    if (updateData.id && updateData.status !== undefined) {
      updateStatusRoom.mutate(updateData, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            setReloadThenSubmitSuccess(new Date())
            toast.success(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          } else {
            toast.error(`${result.statusMessage}`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          }
        }
      })
    }
  }

  const updateStatusRoom = useMutation({
    mutationFn: (body) => {
      return changeStatusRoom(body)
    }
  })

  const createRo = useMutation({
    mutationFn: (body) => {
      return createRoom(body)
    }
  })

  const totalPage = calculateTotalPages(allRoom?.data?.data.totalCount, limit)
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

  const handleSortDepartment = (e) => {
    setSortDepartment(e.target.value)
  }

  return (
    <>
      {/* form create Rooms */}
      <div className='bg-white border border-4 rounded-lg shadow '>
        <div className='p-6 space-y-6'>
          <form action='#'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                  Department :
                </label>
                <select
                  value={departmentID}
                  className='w-full bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block p-2.5 transition delay-500 outline-none'
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  <option value=''>Select Department</option>
                  {allDepartment &&
                    allDepartment?.data?.data.map((item) => (
                      <option key={item.id} value={item.id} className='hover:bg-slate-400'>
                        {item.departmentName}
                      </option>
                    ))}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                  Room Name:
                </label>
                <input
                  type='text'
                  onChange={(e) => setRoomNumber(e.target.value)}
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
      {/* list Room */}
      <div className=' overflow-hidden w-full mt-5'>
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
              placeholder='Search Room here'
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <select
            id='roomId'
            className='w-60 bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block p-2.5 transition delay-500 outline-none'
            onChange={handleSortDepartment}
          >
            <option value=''>All</option>
            {allDepartment &&
              allDepartment?.data?.data.map((item) => (
                <option key={item.id} value={item.departmentName} className='hover:bg-slate-400'>
                  {item.departmentName}
                </option>
              ))}
          </select>
        </div>
        <div className='relative shadow-md sm:rounded-lg bg-white '>
          <table className='w-full text-sm text-left border border-gray-700  rtl:text-right text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
              <tr>
                <th scope='col' className='px-6 py-3  '>
                  <span>STT </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Department Name </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Room </span>
                </th>
                <th scope='col' className='px-6 py-3 text-center'>
                  <span>Status</span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allRoom &&
                allRoom?.data?.data?.items.map((item, index) => (
                  <tr key={item.id} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                    <td scope='row' className='px-6 py-4 font-bold'>
                      {index + 1}
                    </td>
                    <td scope='row' className='px-6 py-4 font-bold '>
                      {item.departments.departmentName}
                    </td>
                    <td scope='row' className='px-6 py-4 font-bold'>
                      {item.roomNumber}
                    </td>
                    <td
                      scope='row'
                      className='px-6 py-4 font-bold text-center '
                      style={{ color: item.roomStatus == 'True' ? 'green' : 'brown' }}
                    >
                      {item.roomStatus == 'True' ? 'Active' : 'Inactive'}
                    </td>

                    <td className='max-w-[200px] min-w-[150px]'>
                      <div className='flex items-center'>
                        <button
                          onClick={() => submitUpdate(item.id, item.roomStatus)}
                          className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
                        >
                          Change Status
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
