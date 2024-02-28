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

export const getAllPendingRequestOfAssignee = (searchParamsObject, id) => {
  const token = getCookie('access_token')
  console.log(searchParamsObject)
  return http.get(`/api/request/GetAllPendingRequestOfAssignee/${id}`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAllAssignee = () => http.get(`/api/assignee/getAll`)
