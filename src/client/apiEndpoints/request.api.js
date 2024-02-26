import getCookie from '@/hooks/getCookie'
import http from '../../utils/http'

export const getRequest = (id) => {
  const token = getCookie('access_token')
  return http.get(`/api/request/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getRequests = (searchParamsObject) => {
  const token = getCookie('access_token')

  return http.get('/api/request', {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getRequestsWithoutSsfp = () => {
  const token = getCookie('access_token')

  return http.get('/api/request_withoutssfp', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getArchivedRequests = (searchParamsObject) => {
  const token = getCookie('access_token')

  return http.get('/api/request-archived', {
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

export const upateRequest = (request) => {
  const token = getCookie('access_token')
  return http.post('/api/request/update_request', request, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const getDepartments = () => http.get('/api/department/getAll')
export const getRequestStatus = () => http.get('/api/request/requestStatus')
