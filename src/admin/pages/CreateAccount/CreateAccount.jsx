import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from "date-fns";

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
  gender: "Male",
  birthday: "2001/01/01"
}

export default function CreateAccount() {
  const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/;
  // const whitespaceRegex = /\s/;
  const formatEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneNumberRegex = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)\d{7}$/;

  const [formAccountState, setFormAccountState] = useState(formRequest || {});
  const [fileUpdate, setFileUpdate] = useState(null);
  const [errorDate, setErrorDate] = useState(null);
  const [errorGender, setErrorGender] = useState(null);
  const [errorUploadFile, setErrorUploadFile] = useState(null);
  const [errorFullName, setErrorFullName] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [errorRoleId, setErrorRoleId] = useState(null);
  const navigate = useNavigate();
  const { accountId } = useParams();

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
    switch (field) {
      case 'roleId':
        value = e.target.value;
        if (value === null) {
          setErrorRoleId("Role account is required");
        } else {
          setErrorRoleId('');
        }
        break;
      case 'fullName':
        value = e.target.value;
        if (value.length > 30) {
          setErrorFullName("Does not exceed 30 characters");
        } else if (specialCharactersRegex.test(value)) {
          setErrorFullName("Does not contain special characters");
        } else if (/\d/.test(value)) {
          setErrorFullName("Does not contain digits");
        } else if (value === '') {
          setErrorFullName("Full name is required");
        } else {
          setErrorFullName('');
        }
        break;
      case 'email':
        value = e.target.value;
        if (value === '') {
          setErrorEmail("Phone number is required");
        } else if (value.length > 200) {
          setErrorEmail("Does not exceed 200 characters");
        } else if (!formatEmailRegex.test(value)) {
          setErrorEmail("Invalid email format");
        } else {
          if (accountId) {
            checkDuplicateEmailUpdate.mutate(
              {
                accountId: accountId,
                email: value
              }, {
              onSuccess: (response) => {
                const result = response.data
                if (result.isSuccess) {
                  setErrorEmail('');
                } else {
                  setErrorEmail(`${result.statusMessage}`);
                }
              }
            });
          } else {
            checkDuplicateEmail.mutate(value, {
              onSuccess: (response) => {
                const result = response.data
                if (result.isSuccess) {
                  setErrorEmail('');
                } else {
                  setErrorEmail(`${result.statusMessage}`);
                }
              }
            });
          }
        }
        break;
      case 'imageFile':
        value = e.target.files[0];
        if (value === null) {
          setErrorUploadFile("Profile picture can't blank");
        } else {
          setErrorUploadFile('');
        }
        break;
      case 'address':
        value = e.target.value;
        if (value.length > 200) {
          setErrorAddress("does not exceed 200 characters");
        } else {
          setErrorAddress('');
        }
        break;
      case 'phoneNumber':
        value = e.target.value;
        if (value === '') {
          setErrorPhoneNumber("Phone number is required");
        } else if (!phoneNumberRegex.test(value)) {
          setErrorPhoneNumber("The phone number you entered incorrectly");
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
                  setErrorPhoneNumber('');
                } else {
                  setErrorPhoneNumber(`${result.statusMessage}`);
                }
              }
            });
          } else {
            checkDuplicatePhoneNumber.mutate(value, {
              onSuccess: (response) => {
                const result = response.data
                if (result.isSuccess) {
                  setErrorPhoneNumber('');
                } else {
                  setErrorPhoneNumber(`${result.statusMessage}`);
                }
              }
            });
          }
        }
        break;
      case 'gender':
        value = e.target.value;
        setErrorGender('');
        break;
      case 'birthday':
        value = format(e, "yyyy/MM/dd");
        const inputDate = new Date(value);
        const currentDate = new Date();

        if (inputDate >= currentDate) {
          setErrorDate('Birthday must be in the past');
        } else {
          setErrorDate('');
        }
        break;
      default:
        break;
    }
    console.log(value);
    setFormAccountState((prev) => ({ ...prev, [field]: value }))
  }

  const handlerSubmit = (e) => {
    e.preventDefault();
    let count = true;

    for (const key in formAccountState) {
      if (formAccountState[key] === null || formAccountState[key] === '' || formAccountState[key] === undefined) {
        if (accountId) {
          if (key === "imageFile") {
            break;
          }
        }
        count = false;
        switch (key) {
          case 'roleId':
            setErrorRoleId("Role is required");
            break;
          case 'fullName':
            setErrorFullName("Full name is required");
            break;
          case 'email':
            setErrorEmail("Email is required");
            break;
          case 'imageFile':
            setErrorUploadFile("Profile picture is required");
            break;
          case 'address':
            setErrorAddress("Address is required");
            break;
          case 'phoneNumber':
            setErrorPhoneNumber("Phone number is required");
            break;
          case 'gender':
            setErrorGender("Gender is required");
            break;
          case 'birthday':
            setErrorDate("Birthday is required");
            break;
          default:
            break;
        }
      }
    }

    console.log(formAccountState);

    if (count) {
      if (accountId) {
        updateAccountApi.mutate(formAccountState, {
          onSuccess: (response) => {
            const result = response.data
            if (result.isSuccess) {
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
              setTimeout(() => {
                navigate('/admin');
              }, 5000);
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
                  {errorUploadFile &&
                    <label className='text-xs text-red-500'>
                      {errorUploadFile}
                    </label>
                  }
                </div>
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Mason Mount"
                        className={`h-10 border mt-1 rounded px-4 w-full bg-gray-50`}
                        value={formAccountState.fullName}
                        onChange={handleChange("fullName")}
                      />
                      {errorFullName &&
                        <label className='text-xs text-red-500'>
                          {errorFullName}
                        </label>
                      }
                    </div>
                    <div className='md:col-span-2'>
                      <label htmlFor="role">Role</label>
                      <select
                        id='roomId'
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
                      {errorRoleId &&
                        <label className='text-xs text-red-500'>
                          {errorRoleId}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        name="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="email@domain.com"
                        value={formAccountState.email}
                        onChange={handleChange("email")}
                      />
                      {errorEmail &&
                        <label className='text-xs text-red-500'>
                          {errorEmail}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="phone_number">Phone Number</label>
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
                      {errorPhoneNumber &&
                        <label className='text-xs text-red-500'>
                          {errorPhoneNumber}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="address">Residential Address</label>
                      <input
                        type="text"
                        name="address"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                        value={formAccountState.address}
                        onChange={handleChange("address")}
                      />
                      {errorAddress &&
                        <label className='text-xs text-red-500'>
                          {errorAddress}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5 items-center mt-3 mb-3">
                      <div className='flex flex-row gap-4'>
                        <label htmlFor="birthday">Gender: </label>
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
                      {errorGender &&
                        <label className='text-xs text-red-500'>
                          {errorGender}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5">
                      <DatePicker
                        selected={formAccountState.birthday}
                        onChange={handleChange("birthday")}
                        className='h-10 border mt-1 rounded px-4 w-full bg-gray-50'
                        dateFormat="yyyy/MM/dd"
                        showYearDropdown
                      />
                      {errorDate &&
                        <div className='text-xs text-red-500'>
                          {errorDate}
                        </div>
                      }
                    </div>
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
    </div >
  )
}
