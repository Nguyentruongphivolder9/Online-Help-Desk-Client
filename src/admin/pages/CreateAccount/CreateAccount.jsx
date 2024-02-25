import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format, getYear, getMonth } from "date-fns";

import FileUpload from '@/admin/components/FileUpload'
import { checkEmail, checkPhoneNumber, getAccountById, accountRegister, updateAccount, checkPhoneNumberEdit, checkEmailEdit } from '@/admin/apiEndpoints/account.api';
import { getRole } from '@/admin/apiEndpoints/role.api';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formRequest = {
  roleId: '',
  fullName: '',
  email: '',
  imageFile: '',
  address: '',
  phoneNumber: '',
  gender: "",
  birthday: ""
}

const errorsField = {
  roleId: '',
  fullName: '',
  email: '',
  imageFile: '',
  address: '',
  phoneNumber: '',
  gender: '',
  birthday: ''
}

export default function CreateAccount() {
  const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/;
  // const whitespaceRegex = /\s/;
  const formatEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)\d{7}$/;

  const [formAccountState, setFormAccountState] = useState(formRequest || {});
  const [fileUpdate, setFileUpdate] = useState(null);
  const [errorObject, setErrorObject] = useState(errorsField || {});
  const navigate = useNavigate();
  const { accountId } = useParams();

  const range = (start, end) => {
    return new Array(end - start + 1).fill().map((d, i) => i + start);
  };
  const years = range(1960, getYear(new Date()));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { data: accountEdit, isLoading: isLoadingAccountEdit } = useQuery({
    queryKey: ['account/get-by-id', accountId],
    queryFn: async () => {
      const data = await getAccountById(accountId);
      return data;
    },
    enabled: accountId != null || accountId != undefined
  });

  const { data: roleTypeResponse, isLoading: isLoadingRoleType } = useQuery({
    queryKey: ['roles/get-all'],
    queryFn: async () => {
      const data = await getRole();
      return data;
    }
  });

  const createAccountApi = useMutation({
    mutationFn: (body) => {
      return accountRegister(body)
    }
  });

  const updateAccountApi = useMutation({
    mutationFn: (body) => {
      return updateAccount(body)
    }
  });

  const checkDuplicateEmail = useMutation({
    mutationFn: (body) => {
      return checkEmail(body);
    }
  });

  const checkDuplicateEmailUpdate = useMutation({
    mutationFn: (body) => {
      return checkEmailEdit(body);
    }
  });

  const checkDuplicatePhoneNumber = useMutation({
    mutationFn: (body) => {
      return checkPhoneNumber(body);
    }
  });

  const checkDuplicatePhoneNumberUpdate = useMutation({
    mutationFn: (body) => {
      return checkPhoneNumberEdit(body);
    }
  });

  useEffect(() => {
    const result = accountEdit?.data;
    if (result?.isSuccess) {
      setFileUpdate(result?.data.avatarPhoto);
      setFormAccountState((prev) => ({
        ...prev,
        accountId: accountId,
        roleId: result?.data.roleId,
        fullName: result?.data.fullName,
        email: result?.data.email,
        address: result?.data.address,
        phoneNumber: result?.data.phoneNumber,
        gender: result?.data.gender,
        birthday: result?.data.birthday
      }))
    }
  }, [accountEdit]);

  const handleChange = (field) => (e) => {
    let value = '';
    let error = '';
    switch (field) {
      case 'roleId':
        value = e.target.value.trim();
        if (value === null) {
          error = 'Role account is required';
        } else {
          error = '';
        }
        break;
      case 'fullName':
        if (e.target.value.trim().length < 1) {
          value = e.target.value.trim();
        } else {
          value = e.target.value.replace(/\s\s+/g, ' ');
        }

        if (value === '') {
          error = 'Full name is required';
        } else if (value.length > 30) {
          error = 'Does not exceed 30 characters';
        } else if (value.length < 3) {
          error = 'Can\'t be less than 3 characters';
        } else if (specialCharactersRegex.test(value)) {
          error = 'Does not contain special characters';
        } else if (/\d/.test(value)) {
          error = 'Does not contain digits';
        } else {
          error = '';
        }
        break;
      case 'email':
        if (e.target.value.trim().length < 1) {
          value = e.target.value.trim();
        } else {
          value = e.target.value.replace(/\s\s+/g, ' ');
        }

        if (value === '') {
          error = 'Email is required';
        } else if (value.length > 200) {
          error = 'Does not exceed 200 characters';
        } else if (!formatEmailRegex.test(value)) {
          error = 'Invalid email format';
        } else {
          error = '';
          checkDuplicateEmail.mutate(value, {
            onSuccess: (response) => {
              const result = response.data
              if (result.isSuccess) {
                setErrorObject((prev) => ({ ...prev, email: '' }))
              } else {
                setErrorObject((prev) => ({ ...prev, email: result.statusMessage }))
              }
            }
          });
        }
        break;
      case 'imageFile':
        value = e.target.files[0];
        if (value === null) {
          error = 'Profile picture can\'t blank';
        } else {
          error = '';
        }
        break;
      case 'address':
        if (e.target.value.trim().length < 1) {
          value = e.target.value.trim();
        } else {
          value = e.target.value.replace(/\s\s+/g, ' ');
        }

        if (value.trim() === '') {
          error = 'Address is required';
        } else if (value.length > 200) {
          error = 'Does not exceed 200 characters';
        } else if (value.length < 3) {
          error = 'Does not exceed 200 characters';
        } else {
          error = '';
        }
        break;
      case 'phoneNumber':
        value = e.target.value;
        if (value.trim() === '') {
          error = 'Phone number is required';
        } else if (!phoneNumberRegex.test(value)) {
          error = 'The phone number you entered incorrectly';
        } else {
          if (accountId) {
            checkDuplicatePhoneNumberUpdate.mutate(
              {
                accountId: accountId,
                phoneNumber: value
              }, {
              onSuccess: (response) => {
                const result = response.data
                if (result.isSuccess) {
                  setErrorObject((prev) => ({ ...prev, phoneNumber: '' }))
                } else {
                  setErrorObject((prev) => ({ ...prev, phoneNumber: result.statusMessage }))
                }
              }
            });
          } else {
            checkDuplicatePhoneNumber.mutate(value, {
              onSuccess: (response) => {
                const result = response.data
                if (result.isSuccess) {
                  setErrorObject((prev) => ({ ...prev, phoneNumber: '' }))
                } else {
                  setErrorObject((prev) => ({ ...prev, phoneNumber: result.statusMessage }))
                }
              }
            });
          }
        }
        break;
      case 'gender':
        value = e.target.value;
        error = '';
        break;
      case 'birthday':
        value = format(e, "yyyy/MM/dd");
        const inputDate = new Date(value);
        const currentDate = new Date();
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        if (inputDate > eighteenYearsAgo) {
          error = 'Must be at least 18 years old';
        } else {
          error = '';
        }
        break;
      default:
        break;
    }

    setErrorObject((prev) => ({ ...prev, [field]: error }))
    setFormAccountState((prev) => ({ ...prev, [field]: value }))
  }

  const handlerSubmit = (e) => {
    e.preventDefault();
    let isSubmit = true;

    for (const key in formAccountState) {
      if (formAccountState[key] === null || formAccountState[key] === '' || formAccountState[key] === undefined) {
        if (accountId) {
          if (key === "imageFile") {
            break;
          }
        }
        isSubmit = false;
        switch (key) {
          case 'roleId':
            setErrorObject((prev) => ({ ...prev, roleId: 'Role is required' }))
            break;
          case 'fullName':
            setErrorObject((prev) => ({ ...prev, fullName: 'Full name is required' }))
            break;
          case 'email':
            setErrorObject((prev) => ({ ...prev, email: 'Email is required' }))
            break;
          case 'imageFile':
            setErrorObject((prev) => ({ ...prev, imageFile: 'Profile picture is required' }))
            break;
          case 'address':
            setErrorObject((prev) => ({ ...prev, address: 'Address is required' }))
            break;
          case 'phoneNumber':
            setErrorObject((prev) => ({ ...prev, phoneNumber: 'Phone number is required' }))
            break;
          case 'gender':
            setErrorObject((prev) => ({ ...prev, gender: 'Gender is required' }))
            break;
          case 'birthday':
            setErrorObject((prev) => ({ ...prev, birthday: 'Birthday is required' }))
            break;
          default:
            break;
        }
      }
    }

    for (const key in errorObject) {
      if (errorObject[key]) {
        isSubmit = false;
      }
    }

    if (isSubmit) {
      if (accountId) {
        updateAccountApi.mutate(formAccountState, {
          onSuccess: (response) => {
            const result = response.data
            if (result.isSuccess) {
              toast.success(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
              setTimeout(() => {
                navigate('/admin');
              }, 3000);
            } else {
              toast.error(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
            }
          }
        });
      } else {
        createAccountApi.mutate(formAccountState, {
          onSuccess: (response) => {
            const result = response.data
            if (result.isSuccess) {
              setFormAccountState(formRequest);
              toast.success(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
            } else {
              toast.error(`${result.statusMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
            }
          }
        });
      }
    }
  }

  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div className="p-6 bg-gray-100 flex items-center justify-center">
        <div className="max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-4xl text-gray-600">{accountId ? "Edit account" : "Create new areccount"}</h2>
            <p className="text-gray-500 mb-6">When creating a new account, please enter your complete information.</p>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <FileUpload onFileChange={handleChange("imageFile")} fileData={formAccountState.imageFile} fileDataEdit={fileUpdate} setFileDataEdit={setFileUpdate} />
                  {errorObject.imageFile &&
                    <p className='text-center text-xs text-red-500'>
                      {errorObject.imageFile}
                    </p>
                  }
                </div>
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <label htmlFor="full_name">Full Name:</label>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Mason Mount"
                        className={`h-10 border mt-1 rounded px-4 w-full bg-gray-50`}
                        value={formAccountState.fullName}
                        onChange={handleChange("fullName")}
                      />
                      {errorObject.fullName &&
                        <label className='text-xs text-red-500'>
                          {errorObject.fullName}
                        </label>
                      }
                    </div>
                    <div className='md:col-span-2'>
                      <label htmlFor="role">Role:</label>
                      <select
                        id='role'
                        className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 transition delay-500 outline-none'
                        value={`${formAccountState.roleId}`}
                        onChange={handleChange("roleId")}
                      >
                        <option value=''>Select role</option>
                        {roleTypeResponse &&
                          roleTypeResponse?.data?.data.map((item) => (
                            <option key={item.id} value={`${item.id}`} className='hover:bg-slate-400'>
                              {item.roleName}
                            </option>
                          ))}
                      </select>
                      {errorObject.roleId &&
                        <label className='text-xs text-red-500'>
                          {errorObject.roleId}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-3">
                      <div>
                        <label htmlFor="email">Email Address:</label>
                        {accountId &&
                          <label htmlFor="email" className='text-red-500'> can't be edit</label>
                        }
                      </div>
                      <input
                        type="text"
                        name="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="email@domain.com"
                        value={formAccountState.email}
                        onChange={handleChange("email")}
                        readOnly={accountId ? true : false}
                      />
                      {errorObject.email &&
                        <label className='text-xs text-red-500'>
                          {errorObject.email}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="phone_number">Phone Number:</label>
                      <input
                        type="text"
                        name="phone_number"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="0909009009"
                        value={formAccountState.phoneNumber}
                        onChange={handleChange("phoneNumber")}
                        onKeyDown={(e) => {
                          if (!(e.key >= '0' && e.key <= '9') && e.key !== 'Backspace') {
                            e.preventDefault();
                            console.log(e.key);
                          }
                        }}
                      />
                      {errorObject.phoneNumber &&
                        <label className='text-xs text-red-500'>
                          {errorObject.phoneNumber}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="address">Residential Address:</label>
                      <input
                        type="text"
                        name="address"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                        value={formAccountState.address}
                        onChange={handleChange("address")}
                      />
                      {errorObject.address &&
                        <label className='text-xs text-red-500'>
                          {errorObject.address}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5 mt-3 mb-3">
                      <div className='flex flex-row gap-4 items-center'>
                        <label htmlFor="gender">Gender: </label>
                        <label className="inline-flex items-center">
                          <input
                            name='gender'
                            type="radio"
                            value="Male"
                            className="form-radio h-5 w-5 text-gray-600"
                            checked={formAccountState.gender === 'Male'}
                            onChange={handleChange("gender")}
                          />
                          <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            name='gender'
                            type="radio"
                            value="Female"
                            className="form-radio h-5 w-5 text-red-600"
                            checked={formAccountState.gender === 'Female'}
                            onChange={handleChange("gender")}
                          />
                          <span className="ml-2 text-gray-700">Female</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            name='gender'
                            type="radio"
                            value="Other"
                            className="form-radio h-5 w-5 text-orange-600"
                            checked={formAccountState.gender === 'Other'}
                            onChange={handleChange("gender")}
                          />
                          <span className="ml-2 text-gray-700">Other</span>
                        </label>
                      </div>
                      {errorObject.gender &&
                        <label className='text-xs text-red-500'>
                          {errorObject.gender}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5">
                      <div className='flex flex-row gap-4 items-center'>
                        <label htmlFor="birthday">Birthday: </label>
                        <DatePicker
                          selected={formAccountState.birthday}
                          onChange={handleChange("birthday")}
                          className='h-10 border mt-1 rounded px-4 w-full bg-gray-50'
                          dateFormat="yyyy/MM/dd"
                          renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div
                              className='m-[10px] flex gap-2 justify-center'
                            >
                              <button className='text-lg' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                {"<"}
                              </button>
                              <select
                                className='text-gray-700 p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                value={getYear(date)}
                                onChange={({ target: { value } }) => changeYear(value)}
                              >
                                {years.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              <select
                                className='text-gray-700 p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                value={months[getMonth(date)]}
                                onChange={({ target: { value } }) =>
                                  changeMonth(months.indexOf(value))
                                }
                              >
                                {months.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              <button className='text-lg' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                {">"}
                              </button>
                            </div>
                          )}
                        />
                      </div>
                      {errorObject.birthday &&
                        <div className='text-xs text-red-500'>
                          {errorObject.birthday}
                        </div>
                      }
                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button type='button' onClick={handlerSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{accountId ? "Update" : "Submit"}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
