import http from '../../utils/http';

export const staySignIn = (formLogin) => http.put('/api/auth/stay-sign-in', formLogin)
