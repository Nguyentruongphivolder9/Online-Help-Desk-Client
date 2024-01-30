import { addRequest, getDepartments, getRequest } from '@/client/apiEndpoints/request.api'
import http from '@/client/utils/http'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'

const initialFormState = {
  accountId: 'ST729729',
  roomId: '',
  description: '',
  severalLevel: '',
  enable: true
}

export default function AddRequest() {
  const [formState, setFormState] = useState(initialFormState || {})
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [errorState, setErrorState] = useState([])
  const [roomError, setRoomError] = useState('')
  const [departmentError, setDepartmentError] = useState('')
  const addMatch = useMatch('/client/request/add')
  const isAddMode = Boolean(addMatch)
  const { id } = useParams()
  const { mutate, data, error, reset } = useMutation({
    mutationFn: (body) => {
      return addRequest(body)
    }
  })

  const departmentQuery = useQuery({
    queryKey: ['department'],
    queryFn: async () => {
      const data = await getDepartments()
      console.log('department', data)
      return data
    },
    enabled: !Boolean(id) // không có id trên url thì gọi queryFn
  })

  // const requestQuery = useQuery({
  //   queryKey: ['request', id],
  //   queryFn: async () => {
  //     const data = await getRequest(id.toUpperCase())
  //     console.log(data)
  //     return data
  //   },
  //   enabled: id !== undefined // có id trên URl thì queryFn mới được gọi
  // })

  // useEffect(() => {
  //   if (requestQuery.data) {
  //     setFormState(requestQuery.data?.data?.data)
  //   }
  // }, [requestQuery])

  // console.log('errorState', errorState)
  // console.log('data', data)
  const handleChange = (name) => (event) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (errorState || roomError || departmentError) {
      setErrorState([])
      setRoomError('')
      setDepartmentError('')
    }
  }

  const handleDepartmentChange = (event) => {
    const selectedDepartmentId = event.target.value
    const selectedDepartment = departmentQuery.data?.data?.data.find((depart) => depart.id === selectedDepartmentId)
    setSelectedDepartment(selectedDepartment)
    console.log(selectedDepartment)
    // xoá lỗi khi chọn lai department
    if (errorState || roomError || departmentError) {
      setErrorState([])
      setRoomError('')
      setDepartmentError('')
    }
    if (selectedDepartment == undefined) {
      setFormState((prev) => ({ ...prev, roomId: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(formState)
    mutate(formState, {
      onSuccess: (data) => {
        if (!data?.data.validationsErrors) {
          setFormState(initialFormState)
          setSelectedDepartment('')
        }
        setErrorState(data?.data?.validationsErrors)
      },
      onError: () => {
        if (selectedDepartment) {
          setRoomError('Please select room!')
        } else {
          setDepartmentError('Please select department!')
        }
      }
    })
  }

  //{code: 'Description', description: 'Description cannot be left blank.'} code là fieldName vcbìu
  const getErrorForField = (fieldName) => {
    const errorsForField = errorState.filter((error) => error.code === fieldName)
    return errorsForField.map((error) => error.description)
  }

  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='py-8 px-4 mx-auto max-w-2xl lg:py-16'>
        <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
          {isAddMode ? 'Make' : 'Edit'} a Request
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-4 md:gap-4 lg:gap-4'>
            {/* Department */}
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Select Department:{' '}
              </label>
              <select
                onChange={handleDepartmentChange}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
                value={selectedDepartment ? selectedDepartment.id : ''}
              >
                <option value=''>Select Department</option>
                {departmentQuery.data?.data?.data.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
              <div className='text-red-500 text-sm min-h-5'>{departmentError}</div>
            </div>

            {/* Room */}

            <div className='col-start-2 col-end-3'>
              <label htmlFor='roomId' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Room
              </label>
              <select
                id='roomId'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                value={formState.roomId}
                onChange={handleChange('roomId')}
              >
                <option value=''>Select Room</option>
                {selectedDepartment &&
                  selectedDepartment.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </option>
                  ))}
              </select>
              <div className='text-red-500 text-sm'>{roomError}</div>
            </div>

            {/* <div className='sm:col-span-2'>
              <label htmlFor='roomId' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                RoomId
              </label>
              <input
                type='text'
                name='roomId'
                id='roomId'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Room ID'
                value={formState.roomId}
                onChange={handleChange('roomId')}
              />
            </div> */}

            {/* Several Level */}
            <div className='sm:col-span-2'>
              <label htmlFor='severalLevel' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Several Level
              </label>
              <select
                id='severalLevel'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                value={formState.severalLevel}
                onChange={handleChange('severalLevel')}
              >
                <option value=''>Select Several Level</option>
                <option value='Normal'>Normal</option>
                <option value='Important'>Important</option>
                <option value='Urgent'>Urgent</option>
                <option value='Flexible'>Flexible</option>
              </select>
              <div className='min-h-5'>
                {errorState &&
                  getErrorForField('SeveralLevel').map((error, index) => (
                    <div key={index} className='text-red-500 text-sm mt-1'>
                      {error}
                    </div>
                  ))}
              </div>
            </div>

            {/* Reason
            <div className='w-full sm:col-span-2'>
              <label htmlFor='reason' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Reason (optional)
              </label>
              <input
                type='text'
                name='reason'
                id='reason'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Reason'
                value={formState.reason}
                onChange={handleChange('reason')}
              />

              {errorState &&
                getErrorForField('Reason').map((error, index) => (
                  <div key={index} className='text-red-500 text-sm mt-1'>
                    {error}
                  </div>
                ))}
            </div> */}

            {/* Description */}
            <div className='col-start-1 col-span-2 sm:col-span-2'>
              <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Description
              </label>
              <textarea
                id='description'
                rows={8}
                className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Your description here'
                value={formState.description}
                onChange={handleChange('description')}
              />
              <div className='min-h-10'>
                {errorState &&
                  getErrorForField('Description').map((error, index) => (
                    <div key={index} className='text-red-500 text-sm/[1.25rem]'>
                      {error}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800'
          >
            Make request
          </button>
        </form>
      </div>
    </section>
  )
}
