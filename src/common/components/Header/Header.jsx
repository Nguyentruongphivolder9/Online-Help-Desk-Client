import { getAccountById } from '@/admin/apiEndpoints/account.api'
import Navbar from '../Navbar'
import { Link } from 'react-router-dom'
import useAuthRedirect from '@/hooks/useAuthRedirect'
import { useEffect, useState } from 'react'
import useLogout from '@/hooks/useLogout'
import useGetInfoFromJWT from '@/hooks/useGetInfoFromJWT'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRequestsWithoutSsfp } from '@/client/apiEndpoints/request.api'
export default function Header() {
  const isLogin = false // vi du ma chua dang nhap thi show cai buuton login ra
  const { accountId, isLoading } = useAuthRedirect('End-Users')
  const { accountId: accoundIdJWT, roleTypes, userName } = useGetInfoFromJWT()
  const [account, setAccount] = useState(null)
  const [listRequest, setListRequest] = useState([])
  const accountQuery = useQuery({
    queryKey: ['accounts/getById', accoundIdJWT],
    queryFn: async () => {
      const data = await getAccountById(accoundIdJWT)
      return data
    }
  })

  const requestsQuery = useQuery({
    queryKey: ['getRequestsWithoutSsfpHeader', accoundIdJWT],
    queryFn: async () => await getRequestsWithoutSsfp(),
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    setAccount(accountQuery?.data?.data?.data)
    setListRequest(requestsQuery?.data?.data?.data)
  }, [accountQuery?.data, requestsQuery?.data])

  console.log(requestsQuery?.data?.data?.data)
  return (
    <header className='flex fixed top-0 z-10 h-16 w-full bg-gray-50 flex-wrap justify-between items-center mx-auto'>
      <Link to='/' className='flex items-center'>
        <img
          src='https://www.shorttermprograms.com/images/cache/600_by_314/uploads/institution-logos/harvard-university.png'
          className='mr-3 sm:h-9 lg:h-16'
          alt='Flowbite Logo'
        />
      </Link>
      <Navbar listRequest={listRequest}></Navbar>

      <div className='flex items-center gap-x-3 mr-[30px]'>
        <span className='text-sm text-gray-700'>{account?.fullName}</span>
        <div className='avatar dropdown dropdown-bottom dropdown-end'>
          <div className='w-10 rounded-full' tabIndex={0} role='button'>
            {account?.avatarPhoto != null ? (
              <img
                src={`https://storeimageohd.blob.core.windows.net/images/${account?.avatarPhoto}`}
                alt={account?.fullName}
                className='relative inline-block h-9 w-9 !rounded-full object-cover object-center'
              />
            ) : (
              <div className='relative flex h-9 w-9 bg-gray-200 rounded-full object-cover object-center shadow justify-center items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 text-gray-400'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>
              </div>
            )}
          </div>
          <div tabIndex={0} className='dropdown-content w-44 h-24 px-5 py-3 bg-gray-100 rounded-lg shadow border mt-4'>
            <ul className='space-y-3 text-gray-700'>
              <li className='font-medium'>
                <button className='flex items-center transform transition-colors duration-200 border-r-4 border-transparent '>
                  <div className='mr-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                      />
                    </svg>
                  </div>
                  Account
                </button>
              </li>
              <li className='font-medium '>
                <button
                  onClick={useLogout()}
                  className='flex items-center transform transition-colors duration-200 border-r-4 border-transparent'
                >
                  <div className='mr-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75'
                      />
                    </svg>
                  </div>
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
