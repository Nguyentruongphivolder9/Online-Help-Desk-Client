import ListAssignee from '../pages/ListAssignee'
import MainAdminLayout from '../layouts/MainAdminLayout'
import AdminHome from '../pages/AdminHome'
import FacilityHome from '../pages/FacilityHome'
import CreateAccount from '../pages/CreateAccount'
import ManagerAccount from '../pages/ManagerAccount'
import SingleRequestById from '../pages/SingleRequestById'
import AssigneesHome from '../pages/AssigneesHome'
import DetailsAssignee from '../pages/DetailsAssignee'
import FacilityMain from '../pages/FacilityMain'
import ListRequestOfAssigneesID from '../pages/ListRequestOfAssigneesID'
import ManagerRequestAssignees from '../pages/ManagerRequestAssignees'

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
    element: <AssigneesHome></AssigneesHome>,
    children: [
      {
        path: '',
        element: <ManagerRequestAssignees />
      }
    ]
  },
  {
    path: '/admin/facility-header',
    element: (
      <FacilityHome>
        <FacilityMain />
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
    path: '/admin/facility-header/ListRequestOfAssignees/:id',
    element: (
      <FacilityHome>
        <ListRequestOfAssigneesID />
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
