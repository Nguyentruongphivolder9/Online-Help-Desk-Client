import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const getSingleRequestById = (id) => http.get(`/api/request/${id}`)

export const getAllRequest = (searchParamsObject) => {
  const token = getCookie('access_token')
  console.log(searchParamsObject)
  return http.get('/api/request/getAll', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createProcessByAssignees = (request) => http.post('/api/request/CreateProcessForAssignees', request)

export const getCountAllRequest = () => http.get(`/api/Request/GetTotalRequest`)

export const getRequestStatus = () => http.get(`/api/request/requestStatus`)

export const getListRequestOfAssignee = (searchParamsObject, id) => {
  const token = getCookie('access_token')
  console.log(searchParamsObject)
  return http.get(`/api/Assignee/ListRequestOfAssignee/${id}`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAllPendingRequest = (searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get('/api/request/GetAllPendingRequest', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAllRequestStatus = () => http.get('/api/request/requestStatus')

export const getAllRequestOfAssigneeProcessing = (accountId, searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get(`/api/requests/processByAssignees/${accountId}`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateRequestStatus = (object) => {
  const token = getCookie('access_token')
  console.log(object);
  return http.put(`/api/request/update-status`, object, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


