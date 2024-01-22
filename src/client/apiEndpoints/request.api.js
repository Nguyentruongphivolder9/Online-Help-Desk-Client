import http from '../utils/http'

export const addRequest = (request) => http.post('/api/request/create_request', request)
