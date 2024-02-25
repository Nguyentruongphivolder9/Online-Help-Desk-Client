import { useNavigate } from 'react-router-dom';
import useGetInfoFromJWT from './useGetInfoFromJWT';
import { useEffect, useState } from 'react';

const useAuthRedirect = (roleTypeName) => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const objectJWT = useGetInfoFromJWT();
    if (objectJWT.accountId) {
      if (objectJWT.roleTypes == roleTypeName) {
        setAccountId(objectJWT.accountId);
        setIsLoading(false);
      } else {
        switch (objectJWT.roleTypes) {
          case 'End-Users':
            navigate('/')
            break
          case 'Facility-Heads':
            navigate('/admin/facility-header')
            break
          case 'Assignees':
            navigate('/admin/assignees')
            break
          case 'Administrator':
            navigate('/admin')
            break
        }
      }
    } else {
      navigate('/login');
    }
  }, [])

  return { accountId, isLoading };
};

export default useAuthRedirect;