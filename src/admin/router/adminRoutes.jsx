import RequestView from '../pages/RequestView'
import MainAdminLayout from '../layouts/MainAdminLayout'
import AdminHome from '../pages/AdminHome'

const mainAdminLayout = (children) => <MainAdminLayout>{children}</MainAdminLayout>
const adminRoutes = [
  {
    path: '/admin/home',
    element: <AdminHome />
  },
  {
    path: '/admin/request_view',
    element: mainAdminLayout(<RequestView />)
  }
]

export default adminRoutes
