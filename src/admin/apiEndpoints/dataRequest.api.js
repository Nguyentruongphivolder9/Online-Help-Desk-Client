import http from '../../utils/http'

export const getRequest = (searchParams) => http.get('/api/request/getAll', {
  params: searchParams
});