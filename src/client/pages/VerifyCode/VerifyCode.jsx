import { sendMailVerifyCode } from '@/client/apiEndpoints/sendMail.api';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { verifyCode } from '@/client/apiEndpoints/verifyCode.api';

export default function VerifyCode() {
  const [values, setValues] = useState(['', '', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(60);
  const [isSubmit, setIsSubmit] = useState(true);
  const [isCounting, setIsCounting] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const inputRefs = useRef([...Array(7)].map(() => React.createRef()));
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
      navigate("/users/send-mail");
    }

    if (isReload) {
      navigate("/users/send-mail");
    }

    inputRefs.current[0].current.focus();

    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(countdown);
          setIsSubmit(false);
          setIsCounting(false)
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isCounting]);

  const sendMailVerifyCodeMutation = useMutation({
    mutationFn: (body) => {
      return sendMailVerifyCode(body);
    }
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (body) => {
      return verifyCode(body);
    }
  });


  const handleResendMail = (e) => {
    e.preventDefault();

    sendMailVerifyCodeMutation.mutate(state, {
      onSuccess: (response) => {
        const result = response.data;
        if (result.isSuccess) {
          console.log(result);
          setSeconds(60);
          setIsCounting(true)
          setIsSubmit(true)
          setValues(['', '', '', '', '', '', ''])
        } else {

        }
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const concatenatedValue = values.join('');
    if (isSubmit) {
      if (concatenatedValue.length === 7) {
        const verifyForm = {
          accountId: state,
          verifyCode: concatenatedValue
        }

        verifyCodeMutation.mutate(verifyForm, {
          onSuccess: (response) => {
            const result = response.data;
            if (result.isSuccess) {
              navigate('/users/change-password', {
                state: state
              })
            } else {

            }
          }
        });
      } else {

      }
    }
  }

  const handleReset = (e) => {
    e.preventDefault();
    setValues(['', '', '', '', '', '', '']);
    inputRefs.current[0].current.focus();
  }

  return (
    <div>
      <section className='flex bg-gray-50 dark:bg-gray-900 h-screen'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className="bg-white rounded-xl border shadow p-4 sm:p-8 mx-4 max-w-xl">
            <div className='flex items-center gap-4'>
              <svg className="w-6 h-6 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M1.94631 9.31555C1.42377 9.14137 1.41965 8.86034 1.95706 8.6812L21.0433 2.31913C21.5717 2.14297 21.8748 2.43878 21.7268 2.95706L16.2736 22.0433C16.1226 22.5718 15.8179 22.5901 15.5946 22.0877L12.0002 14.0002L18.0002 6.00017L10.0002 12.0002L1.94631 9.31555Z">
                </path>
              </svg>
              <h1 className="font-bold text-2xl text-gray-800 mb-1">Check your email</h1>
            </div>
            <div className="text-2xl mt-6 text-center text-gray-800 mb-1">
              Verify code
            </div>
            <div className='text-xs	text-gray-600'>
              Verification codes will expire in <span className='text-blue-600'>{seconds}s   </span>
              {!isSubmit &&
                <button onClick={handleResendMail} className="underline font-semibold text-gray-900 hover:text-blue-600">Click to resend</button>
              }
            </div>
            <div className="mt-2">
              <form>
                <div className="flex items-center justify-center gap-4">
                  {values.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder="-"
                      ref={inputRefs.current[index]}
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/\D/, '').slice(0, 1);
                        const newValues = [...values];
                        newValues[index] = newValue;
                        setValues(newValues);
                        if (index < inputRefs.current.length - 1) {
                          inputRefs.current[index + 1].current.focus();
                        }
                      }}
                      maxLength={1}
                      required
                      className="w-16 h-16 border rounded-lg p-4 text-center mx-auto hover:border-blue-200 focus:outline-none focus:ring focus:ring-blue-400 placeholder:font-medium font-bold text-xl text-blue-900"
                    />
                  ))}
                </div>
                <div className="gap-y-10px flex items-center md:space-y-0 md:space-x-2 justify-between mx-auto w-full mt-6 mb-4">
                  <button onClick={handleReset} className="w-60 py-2.5 px-4 font-semibold border border-gray-200 text-gray-600 text-sm rounded-lg hover:text-gray-900 hover:border-gray-400">
                    Cancel
                  </button>
                  <button onClick={handleSubmit} className="w-60 py-2.5 bg-blue-600 px-4 font-semibold text-gray-50 text-sm rounded-lg hover:bg-blue-800 hover:text-white">
                    Verify
                  </button>
                </div>
              </form>
            </div>
            <small className="text-center block text-xs text-gray-600 font-medium">Didn't get a code?
              <button onClick={handleResendMail} className="underline font-semibold text-gray-900 hover:text-blue-600">Click to resend</button>
            </small>
          </div>
        </div>
      </section>
    </div>
  )
}
