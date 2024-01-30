import http from '../../utils/http';

export const loginAccount = (formLogin) => http.post('/api/auth/login', formLogin)
