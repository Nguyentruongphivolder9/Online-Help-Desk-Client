import { sendMailVerifyCode } from '@/client/apiEndpoints/sendMail.api';
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function VerifySendMail() {
  const [accountIdValue, setAccountIdValue] = useState(null);
  const [sendMailError, setSendMailError] = useState(false);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return sendMailVerifyCode(body)
    }
  })

  const handleSend = async (e) => {
    e.preventDefault();

    if (accountIdValue === undefined) {

    } else {
      mutate(accountIdValue, {
        onSuccess: (response) => {
          const result = response.data;
          if (result.isSuccess) {
            navigate('/users/verify-code', {
              state: accountIdValue
            })
          } else {
            setSendMailError(result.statusMessage)
          }
        }
      });
    }
  }

  return (
    <div>
      <section className='flex bg-gray-50 dark:bg-gray-900 h-screen'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto'>
          <div className="antialiased bg-slate-200">
            <div className="w-96 max-w-lg mx-auto bg-white p-8 rounded-xl shadow shadow-slate-300">
              <h1 className="text-4xl text-slate-700 font-medium">Reset password</h1>
              <p className="text-slate-500">Fill up the form to reset the password</p>
              <form className="my-10">
                {sendMailError && (
                  <div className='text-red-400 text-sm mb-4'>{sendMailError}</div>
                )}
                <div className="flex flex-col space-y-5">
                  <label htmlFor="email">
                    <p className="font-medium text-slate-700 pb-2">Account code</p>
                    <input
                      name="accountId"
                      type="text"
                      onChange={(e) => setAccountIdValue(e.target.value)}
                      className="w-full py-3 border text-slate-500 border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                      placeholder="Enter account code"
                    />
                  </label>
                  <button
                    className="w-full py-3 font-medium text-slate-700 bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                    onClick={handleSend}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
