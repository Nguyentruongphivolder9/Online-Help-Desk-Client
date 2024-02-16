import React, { useEffect, useState } from 'react'
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Select,
  Option
} from "@material-tailwind/react";
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";

import FileUpload from '@/admin/components/FileUpload'
import { checkEmail, checkPhoneNumber, getAccountById, postRegister } from '@/admin/apiEndpoints/account.api';
import { getRole } from '@/admin/apiEndpoints/role.api';
import { useNavigate, useParams } from 'react-router-dom'

const formRequest = {
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
    }
  });

  const { data: roleTypeResponse, isLoading: isLoadingRoleType } = useQuery({
    queryKey: ['roles/get-all'],
    queryFn: async () => {
      const data = await getRole();
      return data;
    }
  });

  const createAccount = useMutation({
    mutationFn: (body) => {
      return postRegister(body)
    }
  });

  const checkDuplicateEmail = useMutation({
    mutationFn: (body) => {
      return checkEmail(body);
    }
  });

  const checkDuplicatePhoneNumber = useMutation({
    mutationFn: (body) => {
      return checkPhoneNumber(body);
    }
  });

  useEffect(() => {
    console.log(accountEdit?.data);
  }, [accountEdit]);

  const handleChange = (field) => (e) => {
    let value = '';
    switch (field) {
      case 'roleId':
        value = e;
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
        break;
      case 'gender':
        value = e.target.value;
        setErrorGender('');
        break;
      case 'birthday':
        value = format(e, "dd/MM/yyyy");
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
    let count = 0;

    for (const key in formAccountState) {
      if (formAccountState[key] === null || formAccountState[key] === '' || formAccountState[key] === undefined) {
        count += 1;
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

    if (count == 0) {
      createAccount.mutate(formRequest, {
        onSuccess: (response) => {
          const result = response.data
          if (result.isSuccess) {
            navigate('/admin')
          } else {
            console.log(result.statusMessage);
          }
        }
      });
    }
  }

  return (
    <div className="relative flex flex-col w-full h-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div className="p-6 bg-gray-100 flex items-center justify-center">
        <div className="max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-4xl text-gray-600">Create new account</h2>
            <p className="text-gray-500 mb-6">Form is mobile responsive. Give it a try.</p>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <FileUpload onFileChange={handleChange} fileData={formAccountState.imageFile} />
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
                      <Select className='items-center flex w-full mt-1 order-1 border rounded' arrow="" onChange={handleChange("roleId")} >
                        {roleTypeResponse ? (
                          roleTypeResponse?.data?.data.map(item => (
                            <Option key={item.id} value={`${item.id}`} className='hover:bg-slate-400'>{item.roleName}</Option>
                          ))
                        ) : (
                          <Option>Not found</Option>
                        )}
                      </Select>
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
                      <div className='space-x-2 flex flex-row gap-1 items-center  '>
                        <label htmlFor="birthday">Birthday: </label>
                        <div className="p-1 w-32">
                          <Popover placement="bottom">
                            <PopoverHandler>
                              <Input
                                onChange={() => null}
                                value={formAccountState.birthday ? formAccountState.birthday : ""}
                                placeholder='01/01/2003'
                              />
                            </PopoverHandler>
                            <PopoverContent>
                              <DayPicker
                                mode="single"
                                selected={new Date(formAccountState.birthday)}
                                onSelect={handleChange("birthday")}
                                showOutsideDays
                                className="border-0"
                                classNames={{
                                  caption: "flex justify-center py-2 mb-4 relative items-center",
                                  caption_label: "text-sm font-medium text-gray-900",
                                  nav: "flex items-center",
                                  nav_button:
                                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                  nav_button_previous: "absolute left-1.5",
                                  nav_button_next: "absolute right-1.5",
                                  table: "w-full border-collapse",
                                  head_row: "flex font-medium text-gray-900",
                                  head_cell: "m-0.5 w-9 font-normal text-sm",
                                  row: "flex w-full mt-2",
                                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                  day: "h-9 w-9 p-0 font-normal",
                                  day_range_end: "day-range-end",
                                  day_selected:
                                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                                  day_today: "rounded-md bg-gray-200 text-gray-900",
                                  day_outside:
                                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                  day_disabled: "text-gray-500 opacity-50",
                                  day_hidden: "invisible",
                                }}
                                components={{
                                  IconLeft: ({ ...props }) => (
                                    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 stroke-2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                  ),
                                  IconRight: ({ ...props }) => (
                                    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 stroke-2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                  ),
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      {errorDate &&
                        <label className='text-xs text-red-500'>
                          {errorDate}
                        </label>
                      }
                    </div>
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button type='button' onClick={handlerSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
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
