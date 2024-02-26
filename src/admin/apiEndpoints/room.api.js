import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const createRoom = (data) => http.post('/api/room/create_room', data)

export const getAllRoomSSFP = (searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get(`/api/room/getAllRoomSSFP`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
