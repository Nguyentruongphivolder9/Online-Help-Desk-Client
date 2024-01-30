import http from '../utils/http'

export const getRequest = (id) => http.get(`/api/request/${id}`)
export const getRequests = (searchParamsObject) => {
  console.log(searchParamsObject)
  return http.get('/api/request', {
    params: searchParamsObject
  })
}
export const addRequest = (request) => http.post('/api/request/create_request', request)
export const upateRequest = (request) => http.post('/api/request/update_request', request)
export const getDepartments = () => http.get('/api/department/getAll')
