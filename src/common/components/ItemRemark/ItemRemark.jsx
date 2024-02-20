import React from 'react'

export default function ItemRemark({ itemData }) {
  return (
    <div onClick={() => console.log("click remark")} className='h-28  w-full p-[15px] flex flex-row border-y border-solid border-gray-300 bg-cyan-100'>
      <div className='w-2/12 justify-center flex'>
        <img
          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
          alt='John Michael'
          className='relative inline-block h-8 w-8 !rounded-full object-cover object-center'
        />
      </div>
      <div className='h-full w-10/12 flex flex-row'>
        <div className='w-4/5 h-full px-[6px]'>
          <div className='h-1/4 text-gray-800 font-semibold'>
            Nguyen Truong Phi
          </div>
          <div className='h-1/4  truncate'>
            <span className='text-xs text-gray-600 font-semibold'>
              Department:&nbsp;
            </span>
            <span className='text-sm text-gray-800'>
              Green Nature
            </span>
          </div>
          <div className='h-1/4  truncate '>
            <span className='text-xs text-gray-600 font-semibold'>
              Room:&nbsp;
            </span>
            <span className='text-sm text-gray-900 font-medium'>
              234
            </span>
          </div>
          <div className='h-1/4 text-xs text-gray-500 truncate'>
            The complete helpdesk solution. Ticketing, Chat, automation & much more. Signup! Robust And Intuitive Helpdesk On The Cloud. Get Started For Free Today
          </div>
        </div>
        <div className='w-1/5 text-gray-500 text-xs italic'>
          5min ago
        </div>
      </div>
    </div>
  )
}
