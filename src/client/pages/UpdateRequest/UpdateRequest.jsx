import { getRequest, upateRequest } from '@/client/apiEndpoints/request.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const initalState = {
  id: '',
  accountId: '',
  departmentName: '',
  roomNumber: '',
  description: '',
  severalLevel: '',
  reason: '',
  enable: true
}

export default function UpdateRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dataSate, setDataSate] = useState(initalState)
  const requestQuery = useQuery({
    queryKey: ['requestupdate', id],
    queryFn: async () => {
      const data = await getRequest(id.toUpperCase())
      console.log(data)
      return data
    },
    enabled: id !== undefined // có id trên URl thì queryFn mới được gọi
  })

  console.log(requestQuery.data)

  useEffect(() => {
    if (requestQuery.data) {
      const data = requestQuery.data?.data?.data

      setDataSate((prev) => ({
        ...prev,
        id: data.id,
        accountId: data.account.accountId,
        departmentName: data.room.departments.departmentName,
        roomNumber: data.room.roomNumber,
        description: data.description,
        severalLevel: data.severalLevel,
        reason: data.reason,
        enable: data.enable,
        requestStatusName: data.requestStatus.statusName
      }))
    }
  }, [requestQuery.data])

  const updateRequestMutation = useMutation({
    mutationFn: (body) => upateRequest(body)
  })

  const handleUpdateRequest = () => {
    if (
      dataSate.requestStatusName == 'Completed' ||
      dataSate.requestStatusName == 'Rejected' ||
      dataSate.requestStatusName == 'Closed'
    ) {
      updateRequestMutation.mutate(
        {
          id: dataSate.id,
          accountId: dataSate.accountId,
          requestStatusId: null,
          enable: !dataSate.enable
        },
        {
          onSuccess: () => {
            navigate('/client/request')
          },
          onError: () => {
            console.log('Failed')
          }
        }
      )
    }
  }

  console.log(dataSate)
  // console.log(requestQuery.data?.data?.data)

  return (
    <div className='max-w-7xl mx-auto px-5'>
      <div className='flex justify-center flex-col'>
        <p className='text-gray-900'>
          Department(Room): {dataSate.departmentName} - Room {dataSate.roomNumber}
        </p>
        <p className='text-gray-900'>Reason: {dataSate.reason}</p>
        <p className='text-gray-900'>Several Level: {dataSate.severalLevel}</p>
        <p className='text-gray-900'>Description: {dataSate.description}</p>
        <p className='text-gray-900'>Status: {dataSate.requestStatusName}</p>
      </div>
      {['Completed', 'Rejected', 'Closed'].includes(dataSate.requestStatusName) && dataSate.enable ? (
        <button
          onClick={handleUpdateRequest}
          className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
        >
          Archive
        </button>
      ) : (
        ''
      )}

      {!dataSate.enable ? (
        <button
          onClick={handleUpdateRequest}
          className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200'
        >
          Unarchive
        </button>
      ) : (
        ''
      )}
    </div>
  )
}
