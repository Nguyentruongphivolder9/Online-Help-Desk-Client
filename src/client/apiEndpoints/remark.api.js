import getCookie from '@/hooks/getCookie'
import http from '../../utils/http'

// export const
export const getRemarksbyAccountId = () => {
  const token = getCookie('access_token')
  return http.get('/api/remark', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getRemarksByRequestId = (requestId) => {
  const token = getCookie('access_token')
  return http.get(`/api/remark/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const addRemark = (remark) => {
  const token = getCookie('access_token')

  return http.post('/api/request/create_remark', remark, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
