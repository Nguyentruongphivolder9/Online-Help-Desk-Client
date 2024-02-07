import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom"

const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    Cookie.remove('access_token');
    Cookie.remove('refresh_token');
    navigate('/login');
  }
}

export default useLogout;