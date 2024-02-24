import React from 'react'

export default function ItemRequest({ dataItem }) {
  return (
    <button onClick={() => console.log("click request")} className='h-28 w-full p-[10px] flex flex-row border-y border-solid border-gray-300 bg-cyan-100'>
      <div className='w-2/12 justify-center flex'>
        <img
          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
          alt='John Michael'
          className='relative inline-block h-8 w-8 !rounded-full object-cover object-center'
        />
      </div>
      <div className='h-full w-10/12 flex flex-row text-left'>
        <div className='w-4/5 h-full px-[6px]'>
          <div className='h-1/5 text-gray-800 font-semibold truncate'>
            Nguyen Truong Phi
          </div>
          <div className='h-1/5 truncate'>
            <span className='text-xs text-gray-600 font-semibold'>
              Department:&nbsp;
            </span>
            <span className='text-xs text-gray-800'>
              Green Nature
            </span>
          </div>
          <div className='h-1/5 truncate'>
            <span className='text-xs text-gray-600 font-semibold'>
              Room:&nbsp;
            </span>
            <span className='text-xs text-gray-900 font-medium'>
              234
            </span>
          </div>
          <div className='h-1/5 text-xs text-gray-500 truncate'>
            The complete helpdesk solution. Ticketing, Chat, automation & much more. Signup! Robust And Intuitive Helpdesk On The Cloud. Get Started For Free Today
          </div>
          <div className='h-1/5 w-full flex flex-row justify-end gap-1 items-center'>
            <span className='text-gray-600 text-xs font-semibold'>Status:&nbsp;</span>
            <div className='h-2 w-2 rounded-box bg-[#FF8000]'></div>
            <div className='text-end text-sm text-[#FF8000]'>
              Completed
            </div>
          </div>
        </div>
        <div className='w-1/5 h-full text-gray-500 text-xs text-center'>
          <div className='w-full h-2/4 italic'>
            5min ago
          </div>
          <div className='w-full h-2/4 flex items-center justify-center'>
            <div className='h-5 w-5 !rounded-full bg-red-600 text-white items-center flex justify-center'>
              2
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
