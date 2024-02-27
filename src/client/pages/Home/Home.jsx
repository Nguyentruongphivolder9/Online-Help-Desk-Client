import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import getCookie from '@/hooks/getCookie'
import { staySignIn } from '@/client/apiEndpoints/staySignIn'
import removeCookie from '@/hooks/removeCookie'
import addCookie from '@/hooks/addCookie'
import LoadingOverlay from '@/common/components/LoadingOverlay'
LoadingOverlay

export default function Home() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return staySignIn(body)
    }
  })

  useEffect(() => {
    var token = getCookie('access_token')
    var refreshToken = getCookie('refresh_token')
    if (token && refreshToken) {
      const decodedToken = jwtDecode(token)
      const accountId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']
      const roleTypes = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

      const loginForm = {
        accountId: accountId,
        refreshToken: refreshToken
      }

      mutate(loginForm, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            removeCookie('access_token')
            addCookie('access_token', result?.data.access_token, result?.data.expiration)

            switch (roleTypes) {
              case 'End-Users':
                setIsLoading(true)
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
            navigate('/login')
          }
        }
      })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <>
      {!isLoading ? (
        <LoadingOverlay opacity={1} />
      ) : (
        <div className='relative top-16'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
            <h2 className='text-white font-bold text-5xl text-center font-serif'>
              Life is not all about studying. But if you can’t even conquer this little part of life, then what else can
              you possibly do?
            </h2>
          </div>
          <img
            className='h-[800px] w-full object-cover object-top brightness-50 blur-[2px]'
            src='../../../../public/wp1915260.jpg'
            alt='nature image'
          />
        </div>
      )}
    </>
  )
}
