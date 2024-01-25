import http from '../utils/http'

export const verifyCode = (verifyForm) => http.post('/api/auth/verify', verifyForm);