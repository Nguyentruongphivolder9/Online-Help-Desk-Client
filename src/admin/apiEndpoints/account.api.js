import getCookie from '@/hooks/getCookie';
import http from '../../utils/http'

export const getAccount = (searchParams) => {
  const token = getCookie("access_token");

  return http.get('/api/accounts', {
    params: searchParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const accountRegister = (formRequest) => {
  const token = getCookie("access_token");
  const formData = new FormData();

  Object.keys(formRequest).forEach((key) => {
    formData.append(key, formRequest[key]);
  });
  console.log(formData);

  return http.post('/api/auth/register', formData, {
    headers: {
      "Content-Type": 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
};

export const checkEmail = (email) => {
  const token = getCookie("access_token");

  return http.get(`/api/accounts/checkEmail/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const checkEmailEdit = (objectParams) => {
  const token = getCookie("access_token");

  return http.get(`/api/accounts/checkEmailEdit`, {
    params: objectParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const checkPhoneNumber = (phoneNumber) => {
  const token = getCookie("access_token");

  return http.get(`/api/accounts/phoneNumber/${phoneNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const checkPhoneNumberEdit = (objectParams) => {
  const token = getCookie("access_token");

  return http.get(`/api/accounts/phoneNumberEdit`, {
    params: objectParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const getAccountById = (accountId) => {
  const token = getCookie("access_token");

  return http.get(`/api/accounts/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

export const updateAccount = (formRequest) => {
  const token = getCookie("access_token");
  const formData = new FormData();

  Object.keys(formRequest).forEach((key) => {
    formData.append(key, formRequest[key]);
  });

  return http.put('/api/accounts/update', formData, {
    headers: {
      "Content-Type": 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
};