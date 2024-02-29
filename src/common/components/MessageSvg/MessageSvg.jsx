import { Link } from 'react-router-dom'

export default function MessageSvg() {
  return (
    <div className='h-full flex justify-center mx-auto p-5 border border-slate-100 shadow-lg bg-white rounded-lg'>
      <div className='text-center pt-20'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-[30rem] h-[15rem] mx-auto text-sky-300'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
          />
        </svg>
        <p className='mt-2 text-lg font-medium text-gray-800'>
          You can message to assignee to ask directly any questions in the request
        </p>
      </div>
    </div>
  )
}
