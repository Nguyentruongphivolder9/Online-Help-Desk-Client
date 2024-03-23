import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'


export const getNotificationByAccountId = (formGetNotice) => {
  const token = getCookie('access_token')
  return http.get(`/api/notifications/getByAccountId`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: formGetNotice
  })
}