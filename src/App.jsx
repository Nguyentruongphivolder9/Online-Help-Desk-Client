import './App.css'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const element = useRouteElement()
  return <>
    {element}
    <ToastContainer />
  </>
}

export default App
