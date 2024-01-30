import Home from '../pages/Home'
import Login from '../pages/Login'
import AddRequest from '../pages/AddRequest'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import MainClientLayout from '../layouts/MainClientLayout'
import ListRequest from '../pages/ListRequest'
import UpdateRequest from '../pages/UpdateRequest'
import ArchivedRequests from '../pages/ArchivedRequests'
import VerifySendMail from '../pages/VerifySendMail'
import VerifyCode from '../pages/VerifyCode'
import ChangePassword from '../pages/ChangePassword'


const mainClientLayout = (children) => <MainClientLayout>{children}</MainClientLayout>
const clientRoutes = [
  {
    path: '/',
    element: mainClientLayout(<Home />)
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/users/send-mail',
    element: <VerifySendMail />
  },
  {
    path: '/users/verify-code',
    element: <VerifyCode />
  },
  {
    path: '/users/change-password',
    element: <ChangePassword />
  },
  {
    path: '/client/request',
    element: mainClientLayout(<ListRequest></ListRequest>)
  },
  {
    path: 'client/request/add',
    element: mainClientLayout(<AddRequest />)
  },
  {
    path: 'client/request/:id',
    element: mainClientLayout(<UpdateRequest />)
  },
  {
    path: 'client/request/archived',
    element: mainClientLayout(<ArchivedRequests />)
  },
  {
    path: 'client/about',
    element: mainClientLayout(<About />)
  },
  {
    path: '*',
    element: mainClientLayout(<NotFound />)
  }
]

export default clientRoutes
