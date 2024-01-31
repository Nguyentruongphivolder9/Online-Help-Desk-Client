import getCookie from '@/hooks/getCookie'
import http from '../../utils/http'

export const getRequest = (id) => http.get(`/api/request/${id}`)

export const getRequests = (searchParamsObject) => {
  const token = getCookie('access_token')

  return http.get('/api/request', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const addRequest = (request) => {
  const token = getCookie('access_token')

  return http.post('/api/request/create_request', request, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const upateRequest = (request) => http.post('/api/request/update_request', request)
export const getDepartments = () => http.get('/api/department/getAll')
