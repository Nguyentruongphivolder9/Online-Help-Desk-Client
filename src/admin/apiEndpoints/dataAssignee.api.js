import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const getTotalRequestByAssignee = (id) => http.get(`/api/Request/GetTotalRequestByAssignees/${id}`)
export const getDetailAssignee = (id) => http.get(`/api/Assignees/${id}`)

export const getListAssignee = (searchParamsObject) => {
  const token = getCookie('access_token')

  return http.get('/api/Assignees/GetListAssignees', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
