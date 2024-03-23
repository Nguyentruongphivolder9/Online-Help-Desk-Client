import { getRequest, upateRequest } from '@/client/apiEndpoints/request.api'
import { useConvertDate } from '@/hooks/useConvertDate'
import getColorClas from '@/hooks/useGetColorRequestStatus'
import { convertDateHourAndMinute } from '@/utils/convertDateHourAndMinute'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const initalState = {
  id: '',
  accountId: '',
  problemTitle: '',
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
      return data
    },
    enabled: id !== undefined // có id trên URl thì queryFn mới được gọi
  })

  useEffect(() => {
    if (requestQuery.data) {
      const data = requestQuery.data?.data?.data

      setDataSate((prev) => ({
        ...prev,
        id: data.id,
        accountId: data.account.accountId,
        problemTitle: data.problem.title,
        departmentName: data.room.departments.departmentName,
        roomNumber: data.room.roomNumber,
        description: data.description,
        severalLevel: data.severalLevel,
        reason: data.reason,
        enable: data.enable,
        requestStatusName: data.requestStatus.statusName,
        createAt: data.createdAt
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

  return (
    <div className='max-w-7xl mx-auto px-5 mt-24 bg-white'>
      <h2 className='font-semibold text-center text-4xl'>Request Details </h2>
      <div className='flex justify-center flex-col'>
        <form action=''>
          <div className='mt-5  border-t border-gray-100'>
            <dl className='divide-y divide-gray-100'>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Problem</dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white  '
                  type='text'
                  value={dataSate.problemTitle}
                  readOnly
                />
              </div>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Department</dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white  '
                  type='text'
                  value={dataSate.departmentName}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Room of Department</dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white'
                  type='text'
                  value={dataSate.roomNumber}
                  readOnly
                />
              </div>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Description</dt>
                <textarea
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white'
                  type='text'
                  value={dataSate.description}
                  rows='2'
                  readOnly
                />
              </div>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Severity Level</dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white'
                  type='text'
                  value={dataSate.severalLevel}
                  readOnly
                />
              </div>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Reason</dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white'
                  type='text'
                  value={dataSate.reason}
                  readOnly
                />
              </div>

              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'> CreateAt : </dt>
                <input
                  className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 bg-white'
                  type='text'
                  value={convertDateHourAndMinute(dataSate.createAt)}
                  readOnly
                />
              </div>
              <div className='px-3 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>Request's status</dt>
                <div
                  className={`grid items-center max-w-[150px] p-1 justify-center font-sans text-xs font-bold 
                      ${dataSate.requestStatusName === 'Assigned' ? 'text-gray-900' : 'text-white'} 
                      ${getColorClas(dataSate.requestStatusName).background} uppercase rounded-md select-none whitespace-nowrap `}
                >
                  {dataSate.requestStatusName}
                </div>
              </div>
            </dl>
          </div>
        </form>
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
      <div className='max-w-7xl mx-auto p-5 my-8 border border-slate-100 shadow-lg bg-white rounded-lg'>
        <p className='font-medium text-sky-600 flex items-center text-xl'>
          Notice
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 ml-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
            />
          </svg>
        </p>
        <p className='flex items-center'>
          If you have any questions or need more details, please feel free to contact the Assignee or Admin directly
          through messaging
          <Link
            to={`/messages/${dataSate.id}`}
            className='bg-blue-400 w-10 h-10 rounded-full inline-flex justify-center items-center ml-4'
          >
            <span className='inline-block align-text-bottom'>
              <svg className='text-white fill-white' height='20px' viewBox='0 0 24 24' width='20px'>
                <title>Nhấn Enter để gửi</title>
                <path
                  d='M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z'
                  fill='var(--chat-composer-button-color)'
                ></path>
              </svg>
            </span>
          </Link>
        </p>
      </div>
    </div>
  )
}
