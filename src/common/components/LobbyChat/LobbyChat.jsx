import React from 'react'
import ItemRequest from '../ItemRequest'
import SkeletonLoaderRequest from '../SkeletonLoaderRequest'

export default function LobbyChat({
  dataItem,
  isLoading,
  joinSpecificChatRoom,
  roleTypes,
  listNotifiRemark,
  setListNotifiRemark
}) {
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
        {dataItem &&
          dataItem.map((item) => (
            <ItemRequest
              dataItem={item}
              key={item.id}
              joinSpecificChatRoom={joinSpecificChatRoom}
              roleTypes={roleTypes}
              notifiRemark={listNotifiRemark.find((noti) => noti.requestId === item.id)}
              setListNotifiRemark={setListNotifiRemark}
            />
          ))}
      </div>
      {/* )} */}
    </>
  )
}
