import { sendMailVerifyCode } from '@/client/apiEndpoints/sendMail.api';
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '@/common/components/LoadingButton';

export default function VerifySendMail() {
  const formatEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [emailValue, setAccountIdValue] = useState(null);
  const [sendMailError, setSendMailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return sendMailVerifyCode(body)
    }
  })

  const handleSend = async (e) => {
    e.preventDefault();

    if (emailValue === null || emailValue === '') {
      setSendMailError("Please enter your email address");
    } else if (!formatEmailRegex.test(emailValue)) {
      setSendMailError('Invalid email format');
    } else {
      setIsLoading(true);
      mutate(emailValue, {
        onSuccess: (response) => {
          setIsLoading(false);
          const result = response.data;
          if (result.isSuccess) {
            navigate('/users/verify-code', {
              state: emailValue
            });
          } else {
            setSendMailError(result.statusMessage);
          }
        }
      });
    }
  }

  return (
    <>
      <section className='relative flex bg-gray-900 h-screen'>
        <img
          className="absolute z-1 h-full w-full object-cover object-center opacity-30"
          src="../../../../public/books-1281581_1280.jpg"
          alt="nature image"
        />
        <div className='flex z-10 flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className='w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700'>
            <div className='w-96 p-6 space-y-4 md:space-y-6 sm:p-8'>
              <div className=''>
                <h1 className="text-4xl text-white font-medium">Reset password</h1>
                <p className="text-slate-500">Fill up the form to reset the password</p>
              </div>
              <form className="my-10">
                {sendMailError && (
                  <div className='text-red-400 text-sm'>{sendMailError}</div>
                )}
                <div className="flex flex-col space-y-5">
                  <label htmlFor="email">
                    <p className="font-medium text-white pb-2">Email receive code</p>
                    <input
                      name="accountId"
                      type="text"
                      value={emailValue}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        setAccountIdValue(value)
                      }}
                      className="w-full py-3 border text-gray-200 border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                      placeholder="Enter your email"
                    />
                  </label>
                  {isLoading ? (
                    <LoadingButton />
                  ) : (
                    <button
                      className="w-full py-3 font-medium text-gray-200 bg-blue-500 hover:bg-blue-700 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                      onClick={handleSend}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                      <span>Send</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
