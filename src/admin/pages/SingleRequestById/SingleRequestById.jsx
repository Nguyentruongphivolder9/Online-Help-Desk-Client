import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'

export default function SingleRequestById() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  const requestQuery = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const data = await getSingleRequestById(id.toUpperCase())
      return data
    }
  })
  console.log(requestQuery.data?.data?.data)

  useEffect(() => {
    setData(requestQuery.data?.data?.data)
  }, [])

  return (
    <>
      {data && (
        <div>
          <h1 className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700'>{data.description}</h1>
          <p>Several Level: {data.severalLevel}</p>
          <p>Reason: {data.reason}</p>
          <p>Created At: {data.createdAt}</p>
          <p>
            Room: {data.room.roomNumber} ({data.room.departments.departmentName}) - Status: {data.room.roomStatus}
          </p>
          <p>Request Status: {data.requestStatus.statusName}</p>
          <p>
            Requested by: {data.account.fullName} ({data.account.email})
          </p>
          <p>
            Assignee: {data.processByAssignees[0]?.account.fullName} ({data.processByAssignees[0]?.account.email})
          </p>
        </div>
      )}
    </>
  )
}
