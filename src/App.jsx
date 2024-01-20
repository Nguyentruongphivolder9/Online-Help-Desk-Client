import './App.css'
import useRouteElement from './useRouteElement'

function App() {
  const element = useRouteElement()
  return <div className='bg-gray-400'>{element}</div>
}

export default App
