import Home from '../pages/Home'
import Login from '../pages/Login'
import AddRequest from '../pages/AddRequest'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import MainClientLayout from '../layouts/MainClientLayout'
import ListRequest from '../pages/ListRequest'

const mainClientLayout = (children) => <MainClientLayout>{children}</MainClientLayout>
const clientRoutes = [
  {
    path: '/',
    element: mainClientLayout(<Home />)
  },
  {
    path: '/client/login',
    element: mainClientLayout(<Login></Login>)
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
    path: 'client/about',
    element: mainClientLayout(<About />)
  },
  {
    path: '*',
    element: mainClientLayout(<NotFound />)
  }
]

export default clientRoutes
