import React from 'react'
import ItemRequest from '../ItemRequest'
import SkeletonLoaderRequest from '../SkeletonLoaderRequest'

export default function LobbyChat({ dataItem, isLoading }) {
  return (
    <>
      {/* {isLoading ? (
      <div className='w-full h-[565px] overflow-y-scroll hide-scrollbar'>
        <SkeletonLoaderRequest />
        <SkeletonLoaderRequest />
        <SkeletonLoaderRequest />
        <SkeletonLoaderRequest />
        <SkeletonLoaderRequest />
        <SkeletonLoaderRequest />
      </div>
    ) : ( */}
      <div className='w-full h-[565px] overflow-y-scroll hide-scrollbar'>
        <ItemRequest dataItem={dataItem} />
      </div>
      {/* )} */}
    </>
  )
}