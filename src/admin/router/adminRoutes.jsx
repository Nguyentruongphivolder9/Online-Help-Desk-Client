
import MainAdminLayout from '../layouts/MainAdminLayout'
import AdminHome from '../pages/AdminHome'
import CreateAccount from '../pages/CreateAccount'
import ManagerAccount from '../pages/ManagerAccount'

const mainAdminLayout = (children) => <MainAdminLayout>{children}</MainAdminLayout>
const adminRoutes = [
  {
    path: '/admin',
    element: <AdminHome>
      <ManagerAccount />
    </AdminHome>
  },
  {
    path: '/admin/create-account',
    element: <AdminHome>
      <CreateAccount />
    </AdminHome>
  }
]

export default adminRoutes
