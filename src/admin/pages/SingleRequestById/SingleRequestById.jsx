import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getSingleRequestById } from '@/admin/apiEndpoints/dataRequest.api'
import { useParams } from 'react-router-dom'

export default function SingleRequestById() {
  const { id } = useParams()

  const requestQuery = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const data = await getSingleRequestById(id.toUpperCase())
      console.log(data)
      return data
    }
  })

  return (
    <div>
      {/* <h1>{data.data.description}</h1>
      <p>Several Level: {severalLevel}</p>
      <p>Reason: {reason}</p>
      <p>Created At: {createdAt}</p>
      <p>
        Room: {room.roomNumber} ({room.departments.departmentName}) - Status: {room.roomStatus}
      </p>
      <p>Request Status: {requestStatus.statusName}</p>
      <p>
        Requested by: {account.fullName} ({account.email})
      </p>
      <p>
        Assignee: {processByAssignees[0]?.account.fullName} ({processByAssignees[0]?.account.email})
      </p> */}
    </div>
  )
}
