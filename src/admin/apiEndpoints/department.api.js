import http from '../../utils/http'
import getCookie from '@/hooks/getCookie'

export const getAllDepartmentSSFP = (searchParamsObject) => {
  const token = getCookie('access_token')
  return http.get(`/api/department/getListDepartmentSSFP`, {
    params: searchParamsObject,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAllDepartment = () => http.get('/api/department/getAll')

export const createDepartment = (data) => http.post('/api/department/create_department', data)

export const changeStatusDepartment = (id) => http.post(`/api/department/update_statusDepartment`, id)
