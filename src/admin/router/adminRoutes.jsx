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
import AllPendingRequest from '../pages/AllPendingRequest'
import AllPendingRequestOfAssignee from '../pages/AllPendingRequestOfAssignee'
import CreateRoom from '../pages/CreateRoom'
import ManagerRequestAssignees from '../pages/ManagerRequestAssignees'
import ChatBox from '@/common/components/ChatBox'
import CenterAssigneesHome from '../pages/CenterAssigneesHome'
import RequestDetails from '../pages/RequestDetails/RequestDetails'
import CreateDepartment from '../pages/CreateDepartment'
import AccountInfo from '../pages/AccountInfo'
import AccountInfoMembers from '../pages/AccountInfoMembers'

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
    path: '/admin/create-account/:id',
    element: (
      <AdminHome>
        <CreateAccount />
      </AdminHome>
    )
  },
  {
    path: '/admin/create-room',
    element: (
      <AdminHome>
        <CreateRoom />
      </AdminHome>
    )
  },
  {
    path: '/admin/assignees',
    element: <AssigneesHome></AssigneesHome>,
    children: [
      {
        path: 'requests/:id',
        element: <CenterAssigneesHome />,
        children: [
          {
            path: 'remark',
            element: <ChatBox />
          },
          {
            path: '',
            element: <RequestDetails />
          }
        ]
      },
      {
        path: 'messages/:id',
        element: <ChatBox />
      },
      {
        path: 'myProfile/:id',
        element: <AccountInfo />
      },
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
    path: '/admin/facility-header/AllPendingRequest',
    element: (
      <FacilityHome>
        <AllPendingRequest />
      </FacilityHome>
    )
  },
  {
    path: '/admin/facility-header/AllPendingRequestOfAssignee/:id',
    element: (
      <FacilityHome>
        <AllPendingRequestOfAssignee />
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
  },
  {
    path: '/admin/create-department',
    element: (
      <AdminHome>
        <CreateDepartment />
      </AdminHome>
    )
  },
  {
    path: '/admin/detail-room/:id',
    element: (
      <AdminHome>
        <DetailRoom />
      </AdminHome>
    )
  },
  {
    path: '/admin/myProfile/:id',
    element: (
      <AdminHome>
        <AccountInfo />
      </AdminHome>
    )
  },
  {
    path: '/admin/accounts/info/members/:id',
    element: (
      <AdminHome>
        <AccountInfoMembers />
      </AdminHome>
    )
  },
  {
    path: '/admin/facility-header/myProfile/:id',
    element: (
      <FacilityHome>
        <AccountInfo />
      </FacilityHome>
    )
  }
]

export default adminRoutes
