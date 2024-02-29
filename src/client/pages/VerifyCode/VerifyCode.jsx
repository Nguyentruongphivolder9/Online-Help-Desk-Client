import { sendMailVerifyCode } from '@/client/apiEndpoints/sendMail.api';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { verifyCode } from '@/client/apiEndpoints/verifyCode.api';
import { toast } from 'react-toastify';
import LoadingButton from '@/common/components/LoadingButton';

export default function VerifyCode() {
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(60);
  const [isSubmit, setIsSubmit] = useState(true);
  const [isCounting, setIsCounting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([...Array(7)].map(() => React.createRef()));
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
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
    setIsLoading(true);
    sendMailVerifyCodeMutation.mutate(state, {
      onSuccess: (response) => {
        const result = response.data;
        if (result.isSuccess) {
          console.log(result);
          setSeconds(60);
          setIsCounting(true)
          setIsSubmit(true)
          setValues(['', '', '', '', '', ''])
          setIsLoading(false);
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
          setIsLoading(false);
          navigate("/users/send-mail");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const concatenatedValue = values.join('');
    if (isSubmit) {
      if (concatenatedValue.length === 6) {
        setIsLoading(true)
        const verifyForm = {
          email: state,
          verifyCode: concatenatedValue
        }

        verifyCodeMutation.mutate(verifyForm, {
          onSuccess: (response) => {
            const result = response.data;
            if (result.isSuccess) {
              setIsLoading(false)
              navigate('/users/change-password', {
                state: state
              })
            } else {
              setIsLoading(false)
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

      }
    }
  }

  const handleReset = (e) => {
    e.preventDefault();
    setValues(['', '', '', '', '', '']);
    inputRefs.current[0].current.focus();
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
          <div className="bg-gray-800 border-gray-700 rounded-xl border shadow p-4 sm:p-8 mx-4 max-w-xl">
            <div className='flex items-center gap-4 text-gray-200'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <h1 className="font-bold text-2xl mb-1">Check your email</h1>
            </div>
            <div className="text-2xl mt-6 text-center text-gray-200 mb-1">
              Verify code
            </div>
            <div className='text-xs	text-gray-300'>
              Verification codes will expire in <span className='text-blue-400'>{seconds}s   </span>
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
                      className="w-16 h-16 border rounded-lg p-4 text-center mx-auto hover:border-blue-200 focus:outline-none focus:ring focus:ring-blue-400 placeholder:font-medium font-bold text-xl text-gray-700"
                    />
                  ))}
                </div>
                {!isSubmit ? (
                  isLoading ? (
                    <div className="gap-y-10px flex items-center md:space-y-0 md:space-x-2 justify-between mx-auto w-full mt-6 mb-4">
                      <LoadingButton />
                    </div>
                  ) : (
                    <div className='flex w-full justify-center'>
                      <button
                        className=" mt-6 mb-4 w-full py-3 font-medium text-gray-200 bg-blue-500 hover:bg-blue-700 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                        onClick={handleResendMail}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                        <span>Resend code</span>
                      </button>
                    </div>
                  )
                ) : (
                  isLoading ? (
                    <div className="gap-y-10px flex items-center md:space-y-0 md:space-x-2 justify-between mx-auto w-full mt-6 mb-4">
                      <LoadingButton />
                    </div>
                  ) : (
                    <div className="gap-y-10px flex items-center md:space-y-0 md:space-x-2 justify-between mx-auto w-full mt-6 mb-4">
                      <button onClick={handleReset} className="bg-white w-60 py-2.5 px-4 font-semibold border border-gray-200 text-sm rounded-lg text-gray-900 hover:border-gray-400 hover:bg-slate-400">
                        Cancel
                      </button>
                      <button onClick={handleSubmit} className="w-60 py-2.5 bg-blue-600 px-4 font-semibold text-gray-50 text-sm rounded-lg hover:bg-blue-800 hover:text-white">
                        Verify
                      </button>
                    </div>
                  )
                )}
              </form>
            </div>
            <small className="text-center block text-xs text-gray-300 font-medium">Didn't get a code? &nbsp;
              <button onClick={handleResendMail} className="underline font-semibold text-gray-400 hover:text-blue-600"> Click to resend</button>
            </small>
          </div>
        </div>
      </section>
    </div>
  )
}
