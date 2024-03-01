export default function Contact() {
  return (
    <div>
      <div className='flex h-screen w-screen items-center bg-gray-100'>
        <div className='container flex flex-col items-center justify-center px-5 text-gray-700 md:flex-row'>
          <div className='max-w-md'>
            <div className='font-dark text-5xl font-bold'>404</div>
            <p className='text-2xl font-light leading-normal md:text-3xl'>Sorry we couldn't find this page.</p>
            <p className='mb-8'>But dont worry, you can find plenty of other things on our homepage.</p>
            <button className='focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none active:bg-blue-600'>
              back to homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
