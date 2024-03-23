import React, { useCallback, useEffect, useState } from 'react'
import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import parse from 'html-react-parser';

import { getNotificationByAccountId } from '@/admin/apiEndpoints/dataNotification.api';
import { convertDateHourAndMinute } from '@/utils/convertDateHourAndMinute';
import ImageCircle from '../ImageCircle';
import { joinRecordAndRemoveDuplicateById } from '@/utils/JoinRecordAndRemoveDuplicateById';


const formGetNotice = {
  sortIsViewed: "",
  page: 1
}

export default function Notification({ accountData }) {
  const [notificationArray, setNotificationArray] = useState([]);

  const { data: dataNotificationArray } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await getNotificationByAccountId(formGetNotice);
      return data;
    }
  });

  useEffect(() => {
    setNotificationArray(dataNotificationArray?.data?.data)
  }, [dataNotificationArray])

  // useEffect(() => {
  const connectHub = async (accountId, array) => {
    try {
      const connect = new HubConnectionBuilder()
        .withUrl('https://localhost:7279/hubs/notificationForAccount', {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets
        })
        .build()

      connect.on('NotificationForAccount', (json) => {
        const parseNotification = JSON.parse(json)
        const result = joinRecordAndRemoveDuplicateById(array, parseNotification);
        setNotificationArray(result);
      })

      await connect.start()
      await connect.invoke('NotificationForAccount', accountId)
    } catch (error) {
      console.log(error)
    }
  }

  if (accountData.accountId) {
    connectHub(accountData.accountId, notificationArray);
  }

  const handleShowIconType = (notificationType) => {
    switch (notificationType) {
      case "Create request":
        return (<div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v6.41A7.5 7.5 0 1 0 10.5 22H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M9 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-3a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" clipRule="evenodd" />
          </svg>
        </div>)
      case "Assigned request":
        return (<div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd" />
          </svg>
        </div>)
      case "Update request":
        return (<div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
          </svg>
        </div>)
      case "Chat":
        return (<div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
          <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
          </svg>
        </div>)
    }
  }

  const handleNavigation = (roleType, notificationType, requestId) => {
    switch (roleType) {
      case "End-Users":
        if (notificationType == "Create request" || notificationType == "Update request" || notificationType == "Assigned request") {
          return "/client/request/" + requestId;
        } else {
          return "/messages/" + requestId;
        }
      case "Assignees":
        if (notificationType == "Create request" || notificationType == "Update request" || notificationType == "Assigned request") {
          return "/admin/assignees/requests/" + requestId;
        } else {
          return "/admin/assignees/requests/" + requestId + "/remark";
        }
      case "Administrator":
        return "#";
      case "Facility-Heads":
        if (notificationType == "Create request" || notificationType == "Update request" || notificationType == "Assigned request") {
          return "/admin/facility-header/requests/" + requestId;
        } else {
          return "#";
        }
    }
  }

  return (
    <Tippy
      interactive
      delay={[0, 400]}
      offset={[12, 8]}
      placement="bottom"
      hideOnClick={false}
      render={attrs => (
        <div tabIndex="-1" {...attrs} className="max-h-[650px] overflow-auto overflow-y-scroll hide-scrollbar border border-solid z-20 w-96 max-w-sm bg-white rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700">
          <div className="flex flex-row items-center justify-between px-4 py-2 font-medium text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            <div className='text-2xl font-semibold'>
              Notifications
            </div>
          </div>
          <div className='flex flex-row gap-2 px-4 items-center pb-2'>
            <button className='rounded-badge py-2 px-4 text-md bg-sky-200'>
              All
            </button>
            <button className='rounded-badge py-2 px-4 text-md bg-sky-200'>
              Unread
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">

            {notificationArray && notificationArray.map((item) => (
              <Link key={item.id} to={handleNavigation(accountData.role.roleTypes.roleTypeName, item.notificationType.typeName, item.request.id)} className="relative flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex-shrink-0">
                  <ImageCircle imageData={item.accountSender} size="11" />
                  {handleShowIconType(item.notificationType.typeName)}
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400 line-clamp-3">
                    {parse(item.notificationTitle)}
                  </div>
                  <div className='text-xs text-blue-600 dark:text-blue-500'>{convertDateHourAndMinute(item.notificationTime)}</div>
                </div>
              </Link>
            ))}
          </div>
          <button className="w-full block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <div className="inline-flex items-center justify-center">
              <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              View all
            </div>
          </button>
        </div>
      )}
    >
      <button className="relative p-2 mr-7 rounded-full bg-slate-200 inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none" type="button">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
          <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
        </svg>
        <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-1.5 end-1.5 dark:border-gray-900" />
        <div className="absolute animate-ping block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-1.5 end-1.5 dark:border-gray-900" />
      </button>
    </Tippy>
  )
}
