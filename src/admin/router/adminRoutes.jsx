import ListRequest from '../pages/ListRequest'
import ListAssignee from '../pages/ListAssignee'
import MainAdminLayout from '../layouts/MainAdminLayout'
import AdminHome from '../pages/AdminHome'
import FacilityHome from '../pages/FacilityHome'
import CreateAccount from '../pages/CreateAccount'
import ManagerAccount from '../pages/ManagerAccount'
import SingleRequestById from '../pages/SingleRequestById'
import AssigneesHome from '../pages/AssigneesHome'
import DetailsAssignee from '../pages/DetailsAssignee'

const mainAdminLayout = (children) => <MainAdminLayout>{children}</MainAdminLayout>
const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AdminHome>
        <ManagerAccount />
      </AdminHome>
    )
  },
  {
    path: '/admin/create-account',
    element: (
      <AdminHome>
        <CreateAccount />
      </AdminHome>
    )
  },
  {
    path: '/admin/create-account/:accountId',
    element: (
      <AdminHome>
        <CreateAccount />
      </AdminHome>
    )
  },
  {
    path: '/admin/assignees',
    element: (
      <AssigneesHome />
    )
  },
  {
    path: '/admin/facility-header',
    element: (
      <FacilityHome>
        <ListRequest />
      </FacilityHome>
    )
  },
  {
    path: '/admin/facility-header/listAssignee',
    element: (
      <FacilityHome>
        <ListAssignee />
      </FacilityHome>
    )
  },
  {
    path: '/admin/facility-header/DetailsAssignee/:id',
    element: (
      <FacilityHome>
        <DetailsAssignee />
      </FacilityHome>
    )
  },
  {
    path: '/admin/facility-header/:id',
    element: (
      <FacilityHome>
        <SingleRequestById />
      </FacilityHome>
    )
  }
]

export default adminRoutes
