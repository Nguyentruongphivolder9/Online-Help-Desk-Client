import getColorClas from '@/hooks/useGetColorRequestStatus'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ItemRequest({ dataItem, joinSpecificChatRoom, roleTypes, notifiRemark, setListNotifiRemark }) {
  const navigate = useNavigate()

  // const handleNavigateAndJoinRoom = (dataItem) => {
  //   if (roleTypes == 'Assignees') {
  //     joinSpecificChatRoom(dataItem.id, dataItem.processByAssignees[0].account.fullName)
  //     handleUpdateUnwatchsSeenOnNotifiRemark({ id: notifiRemark.id })
  //     navigate(`/admin/assignees/messages/${dataItem.id}`)
  //   } else if (roleTypes == 'Facility-Heads') {
  //     joinSpecificChatRoom(dataItem.id, 'Facility-heads')
  //     handleUpdateUnwatchsSeenOnNotifiRemark({ id: notifiRemark.id })
  //     navigate(`/admin/facility/messages/${dataItem.id}`)
  //   } else {
  //     joinSpecificChatRoom(dataItem.id, dataItem.account.fullName)
  //     handleUpdateUnwatchsSeenOnNotifiRemark({ id: notifiRemark.id })
  //     navigate(`/messages/${dataItem.id}`)
  //   }
  // }

  return (
    <Link
      to={roleTypes === 'Assignees' ? `/admin/assignees/requests/${dataItem.id}` : `/messages/${dataItem.id}`}
      className={`h-28 w-full p-[10px] flex flex-row border-y border-solid border-gray-300 ${notifiRemark?.unwatchs > 0 ? 'bg-sky-100' : ''}`}
      onClick={
        roleTypes === 'Assignees'
          ? () => joinSpecificChatRoom(dataItem.id, dataItem.processByAssignees[0].account.fullName, notifiRemark.id)
          : roleTypes === 'Facility-Heads'
            ? () => joinSpecificChatRoom(dataItem.id, 'Facility-heads')
            : () => joinSpecificChatRoom(dataItem.id, dataItem.account.fullName, notifiRemark.id)
      }
    >
      <div className='w-2/12 justify-center flex'>
        {dataItem.account.avatarPhoto != null ? (
          <img
            src={`https://storeimageohd.blob.core.windows.net/images/${dataItem.account.avatarPhoto}`}
            alt={dataItem.account.fullName}
            className='relative inline-block h-9 w-9 !rounded-full object-cover object-center'
          />
        ) : (
          <div className="relative flex h-9 w-9 bg-gray-200 rounded-full object-cover object-center shadow justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
      </div>
      <div className='h-full w-10/12 flex flex-row text-left'>
        <div className='w-4/5 h-full px-[6px]'>
          <div className='h-1/5 text-gray-800 font-semibold truncate'>{dataItem.account.fullName}</div>
          <div className='h-1/5 truncate'>
            <span className='text-xs text-gray-600 font-semibold'>Department:&nbsp;</span>
            <span className='text-xs text-gray-800'>{dataItem.room.departments.departmentName}</span>
          </div>
          <div className='h-1/5 truncate'>
            <span className='text-xs text-gray-600 font-semibold'>Room:&nbsp;</span>
            <span className='text-xs text-gray-900 font-medium'>{dataItem.room.roomNumber}</span>
          </div>
          <div className='h-1/5 text-xs text-gray-500 truncate'>{dataItem.description}</div>
          <div className='h-1/5 w-full flex flex-row justify-end gap-1 items-center'>
            <span className='text-gray-600 text-xs font-semibold'>Status:&nbsp;</span>
            <div className={`h-2 w-2 rounded-box ${getColorClas(dataItem.requestStatus.statusName).background}`}></div>
            <div className={`text-end text-sm ${getColorClas(dataItem.requestStatus.statusName).text}`}>
              {dataItem.requestStatus.statusName}
            </div>
          </div>
        </div>
        <div className='w-1/5 h-full text-gray-500 text-xs text-center'>
          <div className='w-full h-2/4 italic'>5min ago</div>
          {notifiRemark && notifiRemark?.unwatchs > 0 ? (
            <div className='w-full h-2/4 flex items-center justify-center'>
              <div className='h-5 w-5 !rounded-full bg-red-600 text-white items-center flex justify-center'>
                {notifiRemark ? notifiRemark?.unwatchs : ''}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Link>
  )
}
