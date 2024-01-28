import http from '../utils/http'

export const sendMailVerifyCode = (accountId) => http.get(`/api/auth/send-mail/${accountId}`)
