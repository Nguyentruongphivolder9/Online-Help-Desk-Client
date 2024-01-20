import Home from '../pages/Home'
import Login from '../pages/Login'
import AddRequest from '../pages/AddRequest'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import MainClientLayout from '../layouts/MainClientLayout'

const mainClientLayout = (children) => <MainClientLayout>{children}</MainClientLayout>
const clientRoutes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/client/login',

    element: mainClientLayout(<Login></Login>)
  },
  {
    path: 'client/add_request',
    element: mainClientLayout(<AddRequest />)
  },
  {
    path: 'client/about',
    element: mainClientLayout(<About />)
  },
  {
    path: '*',
    element: <NotFound />
  }
]

export default clientRoutes
