import http from '../../utils/http';

export const changePassword = (passwordForm) => http.post('/api/auth/change-password', passwordForm);