import CheckErrorIcon from '@/common/components/CheckErrorIcon/CheckErrorIcon';
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '@/client/apiEndpoints/changePasword';

export default function ChangePassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isErrorLengthPassword, setIsErrorLengthPassword] = useState(true);
  const [isErrorSpecialPassword, setIsErrorSpecialPassword] = useState(true);
  const [isErrorCapitalPassword, setIsErrorCapitalPassword] = useState(true);
  const [isErrorLowercasePassword, setIsErrorLowercasePassword] = useState(true);
  const [isErrorDigitPassword, setIsErrorDigitPassword] = useState(true);
  const [isErrorSpacesPassword, setIsErrorSpacesPassword] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] = useState(false);

  useEffect(() => {
    if (state === null) {
      navigate("/users/send-mail");
      return;
    }
  }, [])

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return changePassword(body)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword == '') {
      setIsNewPassword(true);
    } else {
      if (!isNewPassword && !isErrorConfirmPassword) {
        try {
          const valueForm = {
            email: state,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }

          mutate(valueForm, {
            onSuccess: (response) => {
              const result = response.data;
              if (result.isSuccess) {
                navigate('/login');
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
        } catch (error) {
          console.error('Error hashing password:', error);
        }
      }
    }
  }

  const handleValueNewPassword = (e) => {
    const value = e.target.value;
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const digitRegex = /\d/;
    const uppercaseLetterRegex = /[A-Z]/;
    const lowercaseLetterRegex = /[a-z]/;
    const whitespaceRegex = /\s/;

    setIsNewPassword(true);

    if (value.length >= 8 && value.length <= 16) {
      setIsErrorLengthPassword(false);
    } else {
      setIsErrorLengthPassword(true);
    }

    if (specialCharacterRegex.test(value)) {
      setIsErrorSpecialPassword(false);
    } else {
      setIsErrorSpecialPassword(true);
    }

    if (digitRegex.test(value)) {
      setIsErrorDigitPassword(false);
    } else {
      setIsErrorDigitPassword(true);
    }

    if (uppercaseLetterRegex.test(value)) {
      setIsErrorCapitalPassword(false);
    } else {
      setIsErrorCapitalPassword(true);
    }

    if (lowercaseLetterRegex.test(value)) {
      setIsErrorLowercasePassword(false)
    } else {
      setIsErrorLowercasePassword(true)
    }

    if (whitespaceRegex.test(value) || value.length == 0) {
      setIsErrorSpacesPassword(true);
    } else {
      setIsErrorSpacesPassword(false);
    }

    if (!isErrorLengthPassword &&
      !isErrorSpecialPassword &&
      !isErrorCapitalPassword &&
      !isErrorLowercasePassword &&
      !isErrorDigitPassword &&
      !isErrorSpacesPassword
    ) {
      setNewPassword(value);
      setIsNewPassword(false);
    }
  }

  const handleValueConfirmPassword = (e) => {
    const value = e.target.value;
    if (value !== newPassword) {
      setIsErrorConfirmPassword(true);
    } else {
      setIsErrorConfirmPassword(false);
      setConfirmPassword(value);
    }
  }

  return (
    <div>
      <section className='relative flex bg-gray-900 h-screen'>
        <img
          className="absolute z-1 h-full w-full object-cover object-center opacity-30"
          src="../../../../public/books-1281581_1280.jpg"
          alt="nature image"
        />
        <div className='flex z-10 flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className="w-96 p-6 rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-800 border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Change Password
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">New Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={handleValueNewPassword}
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                {isNewPassword &&
                  <div className='flex justify-center mt-3 text-white'>
                    <ul className='w-11/12'>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorLengthPassword} />
                        <div className='text-xs'>8 to 16 characters</div>
                      </li>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorSpecialPassword} />
                        <div className='text-xs'>contains at least one special character</div>
                      </li>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorCapitalPassword} />
                        <div className='text-xs'>contains at least one capital letter</div>
                      </li>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorLowercasePassword} />
                        <div className='text-xs'>contains lowercase letters</div>
                      </li>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorDigitPassword} />
                        <div className='text-xs'>contains at least one digit</div>
                      </li>
                      <li className='text-xs flex gap-1'>
                        <CheckErrorIcon isError={isErrorSpacesPassword} />
                        <div className='text-xs'>does not contain spaces</div>
                      </li>
                    </ul>
                  </div>
                }
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={handleValueConfirmPassword}
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                {isErrorConfirmPassword &&
                  <div className='flex justify-center mt-1'>
                    <div className='w-11/12 text-xs text-red-600'>
                      Confirm your password is not the same as your new password
                    </div>
                  </div>
                }
              </div>
              {/* <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" required />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-light text-gray-500 text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline text-primary-500" href="#">Terms and Conditions</a></label>
                </div>
              </div> */}
              <button onClick={handleSubmit} className="w-full py-2.5 bg-blue-600 px-4 font-semibold text-gray-50 text-sm rounded-lg hover:bg-blue-800 hover:text-white">
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
