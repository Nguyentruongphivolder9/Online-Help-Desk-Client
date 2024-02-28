import http from '../../utils/http';

export const sendMailVerifyCode = (email) => http.get(`/api/auth/send-mail/${email}`)
