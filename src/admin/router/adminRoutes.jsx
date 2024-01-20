import LoginAdmin from '../pages/LoginAdmin/LoginAdmin'
import RequestView from '../pages/RequestView'

const adminRoutes = [
  {
    path: '/admin/login',
    element: <LoginAdmin />
  },
  {
    path: '/admin/request_view',
    element: <RequestView />
  }
]

export default adminRoutes
