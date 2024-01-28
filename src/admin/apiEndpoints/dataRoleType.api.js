import http from '../../utils/http'

export const getRoleType = () => http.get('/api/accounts/role-type/get-all');