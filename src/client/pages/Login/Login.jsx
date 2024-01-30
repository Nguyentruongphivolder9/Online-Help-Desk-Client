import { loginAccount } from '@/client/apiEndpoints/login.api'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import removeCookie from '@/hooks/removeCookie'
import addCookie from '@/hooks/addCookie'

export default function Login() {
  const [loginForm, setLoginForm] = useState({})
  const [loginError, setLoginError] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return loginAccount(body)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (loginForm.accountId === undefined || loginForm.password === undefined) {
      setLoginError('Please enter your account password')
    } else {
      mutate(loginForm, {
        onSuccess: (response) => {
          const result = response.data
          if (!result.isSuccess) {
            setLoginError(result.statusMessage)
          } else {
            if (result.data.enable) {
              removeCookie('access_token')
              removeCookie('refresh_token')
              addCookie('access_token', result?.data.access_token, result?.data.expiration)
              addCookie('refresh_token', result?.data.refresh_token)

              queryClient.setQueryData('accountId', result?.data.accountId)
              switch (result?.data.roleTypeName) {
                case 'End-Users':
                  navigate('/')
                  break
                case 'Facility-Heads':
                  navigate('/admin/facility-header')
                  break
                case 'Assignees':
                  navigate('/')
                  break
                case 'Administrator':
                  navigate('/admin')
                  break
              }
            } else {
              navigate('/users/change-password', {
                state: result?.data.accountId
              })
            }
          }
        }
      })
    }
  }

  return (
    <div>
      <section className='flex bg-gray-50 dark:bg-gray-900 h-screen'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='w-96 p-6 space-y-4 md:space-y-6 sm:p-8'>
              <div className='mb-9 text-3xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Sign in to your account
              </div>
              <form className={`space-y-4 md:space-y-6}`}>
                {loginError && <div className='text-red-400 text-sm mb-4'>{loginError}</div>}
                <div>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Your account code
                  </label>
                  <input
                    type='text'
                    id='email'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='account code'
                    onChange={(e) => setLoginForm({ ...loginForm, accountId: e.target.value })}
                    onFocus={() => setLoginError(null)}
                  />
                </div>
                <div>
                  <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    onFocus={() => setLoginError(null)}
                  />
                </div>
                <div className='flex items-center justify-end'>
                  <Link to={'?'} className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'>
                    Forgot password?
                  </Link>
                </div>
                <button
                  onClick={handleSubmit}
                  className='w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
