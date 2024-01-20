import { useRoutes } from 'react-router-dom'

import clientRoutes from './client/router/clientRoutes'
import adminRoutes from './admin/router/adminRoutes'
const allRoutes = [...adminRoutes, ...clientRoutes]

const useRouteElement = () => {
  return useRoutes(allRoutes)
}

export default useRouteElement
