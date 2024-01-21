import './App.css'
import useRouteElement from './useRouteElement'

function App() {
  const element = useRouteElement()
  return <div>{element}</div>
}

export default App
