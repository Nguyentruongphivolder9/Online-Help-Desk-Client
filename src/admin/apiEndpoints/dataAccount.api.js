import http from '../../utils/http'

export const getAccount = (searchParams) => http.get('/api/accounts/getAll', {
  params: searchParams
});