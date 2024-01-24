import http from '../utils/http'

export const listRequest = () => http.get('/api/request/getAll')