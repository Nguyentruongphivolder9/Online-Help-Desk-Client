import React from 'react'
import ItemRequest from '../ItemRequest'
import ItemRemark from '../ItemRemark'
import SkeletonLoaderRequest from '../SkeletonLoaderRequest'

export default function LobbyChat({ itemName, dataItem, isLoading }) {
  return (
    <div className='w-full h-full overflow-y-scroll hide-scrollbar'>
      {/* {isLoading ? (
        <div className='w-full h-full'>
          <SkeletonLoaderRequest />
          <SkeletonLoaderRequest />
          <SkeletonLoaderRequest />
          <SkeletonLoaderRequest />
          <SkeletonLoaderRequest />
          <SkeletonLoaderRequest />
        </div>
      ) : ( */}
      {itemName === "Request" ? (
        <ItemRequest dataItem={dataItem} />
      ) : (
        <ItemRemark dataItem={dataItem} />
      )}
      {/* )} */}
    </div>
  )
}