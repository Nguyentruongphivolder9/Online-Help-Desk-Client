import getCookie from '@/hooks/getCookie'
import http from '../../utils/http'

export const getRoleType = () => {
  const token = getCookie('access_token')

  return http.get('/api/accounts/role-types', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getRole = () => {
  const token = getCookie('access_token')

  return http.get('api/accounts/roles', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}