import { loginAccount } from '@/client/apiEndpoints/login.api'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import removeCookie from '@/hooks/removeCookie'
import addCookie from '@/hooks/addCookie'
import LoadingOverlay from '@/common/components/LoadingOverlay'

const formLogin = {
  accountId: '',
  password: ''
}

export default function Login() {
  const [loginForm, setLoginForm] = useState(formLogin || {})
  const [loginError, setLoginError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return loginAccount(body)
    }
  })

  const handleChange = (field) => (e) => {
    const value = e.target.value.trim();

    setLoginForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (loginForm.accountId == '' || loginForm.password == '') {
      setLoginError('Please enter your account or password')
    } else {
      setIsLoading(true)
      mutate(loginForm, {
        onSuccess: (response) => {
          const result = response.data
          setIsLoading(false)
          if (!result.isSuccess) {
            setLoginError(result.statusMessage)
          } else {
            if (result.data.enable) {
              removeCookie('access_token')
              removeCookie('refresh_token')
              addCookie('access_token', result?.data.access_token, result?.data.expiration)
              addCookie('refresh_token', result?.data.refresh_token)

              switch (result?.data.roleTypeName) {
                case 'End-Users':
                  navigate('/')
                  break
                case 'Facility-Heads':
                  navigate('/admin/facility-header')
                  break
                case 'Assignees':
                  navigate('/admin/assignees')
                  break
                case 'Administrator':
                  navigate('/admin')
                  break
              }
            } else {
              navigate('/users/change-password', {
                state: result?.data.email
              })
            }
          }
        }
      })
    }
  }

  return (
    <div>
      <section className='relative flex bg-gray-900 h-screen'>
        <img
          className="absolute z-1 h-full w-full object-cover object-center opacity-30"
          src="../../../../public/books-1281581_1280.jpg"
          alt="nature image"
        />
        <div className='flex z-10 flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className='w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700'>
            <div className='w-96 p-6 space-y-4 md:space-y-6 sm:p-8'>
              <div className='mb-9 text-3xl text-center font-bold leading-tight tracking-tight md:text-2xl text-white'>
                Sign in to your account
              </div>
              <form className={`space-y-4 md:space-y-6}`}>
                {loginError && <div className='text-red-400 text-sm mb-4'>{loginError}</div>}
                <div>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-white'>
                    Your account code
                  </label>
                  <input
                    type='text'
                    id='email'
                    className=' border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    placeholder='account code'
                    value={loginForm.accountId}
                    onChange={handleChange("accountId")}
                    onFocus={() => setLoginError(null)}
                  />
                </div>
                <div>
                  <label htmlFor='password' className='block mb-2 text-sm font-medium text-white'>
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    placeholder='••••••••'
                    value={loginForm.password}
                    className=' border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    onChange={handleChange('password')}
                    onFocus={() => setLoginError(null)}
                  />
                </div>
                <div className='flex items-center justify-end'>

                  <Link to='/users/send-mail' className='text-sm font-medium text-blue-400 hover:underline'>
                    Forgot password?
                  </Link>
                </div>
                <button
                  onClick={handleSubmit}
                  className='w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {isLoading && (
        <LoadingOverlay opacity={'opacity-75'} />
      )}
    </div>
  )
}
