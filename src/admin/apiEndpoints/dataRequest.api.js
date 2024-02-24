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

export const createProcessByAssignees = (request) => http.post('/api/request/CreateProcessForAssignees', request)

export const getCountAllRequest = () => http.get(`/api/Request/GetTotalRequest`)

export const getAllRequestStatus = () => http.get('api/request/requestStatus')

export const getAllRequestOfAssigneeProcessing = (accountId, searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get(`/api/requests/processByAssignees/${accountId}`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
