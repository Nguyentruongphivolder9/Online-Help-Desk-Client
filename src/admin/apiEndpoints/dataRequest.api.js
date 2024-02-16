import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const getSingleRequestById = (id) => http.get(`/api/request/${id}`)

export const getRequest = (searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get('/api/request/getAll', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createProcessByAssignees = (request) => http.post('/api/request/update_request', request)

export const getRequestByStatusOfFacility = () => http.get(`api/request/requestStatus`)
