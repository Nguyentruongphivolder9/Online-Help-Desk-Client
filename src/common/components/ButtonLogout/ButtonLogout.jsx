import useLogout from '@/hooks/useLogout'
import React from 'react'

export default function ButtonLogout() {
  return (
    <button onClick={useLogout()} target="_blank" className="w-full text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center py-2 px-5">
      <svg className="w-6  h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
      <span className="ml-3">Log Out</span>
    </button>
  )
}
