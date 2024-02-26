import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
export default function CreateRoom() {
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
                <input
                  type='text'
                  name='product-name'
                  id='product-name'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                  readOnly
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                  RoomNumber :
                </label>
                <input
                  type='text'
                  name='product-name'
                  id='product-name'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                  readOnly
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='product-name' className='text-sm font-medium text-gray-900 block mb-2'>
                  RoomStatus :
                </label>
                <input
                  type='text'
                  name='product-name'
                  id='product-name'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5'
                  readOnly
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <button className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'>
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
              placeholder='Search ,Room,Department'
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <select
            id='roomId'
            className='w-60 bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block p-2.5 transition delay-500 outline-none'
            // value={statusName}
            // onChange={handleSortStatus}
          >
            <option value=''>Select Department</option>
            <option value=''>All</option>
            {/* {ListRequestStatus &&
              ListRequestStatus?.data?.data.map((item) => (
                <option key={item.id} value={`${item.statusName}`} className='hover:bg-slate-400'>
                  {item.statusName}
                </option>
              ))} */}
          </select>
        </div>
        <div className='relative shadow-md sm:rounded-lg bg-white '>
          <table className='w-full text-sm text-left border border-gray-700  rtl:text-right text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
              <tr>
                <th scope='col' className='px-6 py-3 '>
                  <span>STT </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Department Name </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Room </span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Status</span>
                </th>
                <th scope='col' className='px-6 py-3 '>
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                <td scope='row' className=' px-6 py-4'></td>
                <td scope='row' className=' px-6 py-4'></td>
                <td scope='row' className=' px-6 py-4'></td>
                <td scope='row' className=' px-6 py-4'></td>
                <td className='max-w-[200px] min-w-[150px]'>
                  <div className='flex items-center'>
                    <Link className='inline-flex items-center px-5 py-2 ml-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'>
                      Update
                    </Link>
                  </div>
                </td>
              </tr>
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
    </>
  )
}
