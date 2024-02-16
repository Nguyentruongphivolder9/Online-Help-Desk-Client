import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const getTotalRequest = (id) => http.get(`/api/Assignees/GetTotalRequest/${id}`)
export const getAssignee = (id) => http.get(`/api/Assignees/${id}`)

export const getListAssignee = (searchParamsObject) => {
  const token = getCookie('access_token');

  return http.get('/api/Assignees/GetListAssignees', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
