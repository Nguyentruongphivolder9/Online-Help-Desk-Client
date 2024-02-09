import HeaderAdmin from '@/admin/components/HeaderAdmin'
import React from 'react'

export default function AssigneesHome() {
  return (
    <div>
      <HeaderAdmin />
      <div className="flex flex-row w-full justify-center overflow-hidden bg-white pt-[72px]">
        <div className='flex flex-row container'>
          <div id="main-content" className="text-gray-700 min-h-dvh w-3/4 bg-gray-50 relative overflow-y-auto p-[20px]">
            assignees.
          </div>
          <div className='text-gray-700 z-20 h-full top-0 flex lg:flex flex-shrink-0 flex-col w-1/4 transition-width duration-75'>
            hello
          </div>
        </div>
      </div>
    </div>
  )
}
