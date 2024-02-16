import { jwtDecode } from 'jwt-decode'
import getCookie from './getCookie'

const useGetInfoFromJWT = () => {
  const token = getCookie('access_token')
  if (token) {
    const decodedToken = jwtDecode(token)
    const accountId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']
    const roleTypes = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    const emailAddress = decodedToken['"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"']
    const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']

    return {
      accountId,
      roleTypes,
      emailAddress,
      userName
    }
  }

  return {
    accountId: null,
    roleTypes: null,
    emailAddress: null,
    userName: null
  }
}

export default useGetInfoFromJWT
