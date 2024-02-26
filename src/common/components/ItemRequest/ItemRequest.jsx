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
      to={roleTypes === 'Assignees' ? `/admin/assignees/messages/${dataItem.id}` : `/messages/${dataItem.id}`}
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
        <img
          src='https://storeimageohd.blob.core.windows.net/images/233f7ba3-6819-4ef1-9176-91710437b880.png'
          alt='John Michael'
          className='relative inline-block h-8 w-8 !rounded-full object-cover object-center'
        />
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
