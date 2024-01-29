import getCookie from '@/hooks/getCookie';
import http from '../../utils/http'

export const getAccount = (searchParams) => {
  const token = getCookie("access_token");

  return http.get('/api/accounts/getAll', {
    params: searchParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};