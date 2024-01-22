import { addRequest } from '@/client/apiEndpoints/request.api'
import http from '@/client/utils/http'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useMatch } from 'react-router-dom'

const initialFormState = {
  accountId: '',
  roomId: '',
  requestStatusId: 1,
  description: '',
  severalLevel: '',
  reason: '',
  enable: true
}
export default function AddRequest() {
  const [formState, setFormState] = useState(initialFormState)
  const addMatch = useMatch('/client/request/add')
  const isAddMode = Boolean(addMatch)

  const { mutate, error } = useMutation({
    mutationFn: (body) => {
      return addRequest(body)
    }
  })

  const handleChange = (name) => (event) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    mutate(formState, {
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }

  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='py-8 px-4 mx-auto max-w-2xl lg:py-16'>
        <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
          {isAddMode ? 'Make' : 'Edit'} a Request
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
            <div className='sm:col-span-2'>
              <label htmlFor='roomId' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                RoomId
              </label>
              <input
                type='text'
                name='roomId'
                id='roomId'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Room ID'
                required
                value={formState.roomId}
                onChange={handleChange('roomId')}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='reason' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Reason
              </label>
              <input
                type='text'
                name='reason'
                id='reason'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='Reason'
                required
                value={formState.reason}
                onChange={handleChange('reason')}
              />
            </div>

            <div>
              <label htmlFor='severalLevel' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Several Level
              </label>
              <select
                id='severalLevel'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                value={formState.severalLevel}
                onChange={handleChange('severalLevel')}
              >
                <option defaultValue={'Select Several Level'}>Select Several Level</option>
                <option value='Normal'>Normal</option>
                <option value='Important'>Important</option>
                <option value='Urgent'>Urgent</option>
                <option value='Flexible'>Flexible</option>
              </select>
            </div>

            <div className='sm:col-span-2'>
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
