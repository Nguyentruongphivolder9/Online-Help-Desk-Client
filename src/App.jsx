import { useEffect } from 'react';
import './App.css'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'
import useGetInfoFromJWT from './hooks/useGetInfoFromJWT';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function App() {
  const element = useRouteElement()
  const { accountId } = useGetInfoFromJWT()
  const navigate = useNavigate();

  useEffect(() => {
    const connectHub = async () => {
      try {
        const connect = new HubConnectionBuilder()
          .withUrl('https://localhost:7279/hubs/bannedAccount', {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
          })
          .configureLogging(LogLevel.Information)
          .build()

        connect.on('LogoutAccountWhenBanned', (message) => {
          toast.warn(`${message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
          });
          navigate('/login')
        })

        await connect.start()
        await connect.invoke('LogoutAccountWhenBanned', accountId)
      } catch (error) {
        console.log(error)
      }
    }
    if (accountId) {
      connectHub()
    }
  }, [accountId])


  return <>
    {element}
    <ToastContainer />
  </>
}

export default App
