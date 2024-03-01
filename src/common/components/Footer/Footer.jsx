export default function Footer() {
  return (
    <div>
      <footer className='bg-white'>
        <div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
          <div className='md:flex md:justify-between'>
            <div className='mb-6 md:mb-0'>
              <a href='https://www.harvard.edu/' className='flex items-center w-1/2'>
                <img
                  src='https://www.shorttermprograms.com/images/cache/600_by_314/uploads/institution-logos/harvard-university.png'
                  className='w-full h-full'
                  alt='FlowBite Logo'
                />
              </a>
            </div>
            <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
              <div>
                <h2 className='font-medium text-gray-800 dark:text-white'>Melbourne</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  100 Flinders Street <br /> Melbourne VIC 3000 AU
                </p>
              </div>
              <div>
                <h2 className='font-medium text-gray-800 dark:text-white'>London</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  100 Oxford Street <br /> London W1D 1LL UK
                </p>
              </div>
              <div>
                <h2 className='font-medium text-gray-800 dark:text-white'>Sydney</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  51 Little Switzerland Dr, Wentworth Falls NSW 2782 <br /> Sydney
                </p>
              </div>
              <div>
                <h2 className='font-medium text-gray-800 dark:text-white'>San Francisco</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  7901 Cutting Blvd, El Cerrito <br /> CA 94530
                </p>
              </div>
              <div>
                <h2 className='font-medium text-gray-800 dark:text-white'>Byron Bay</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  33 Byron St, Bangalow NSW 2479 <br /> Australia
                </p>
              </div>
              <div>
                <h2 className='font-medium text-gray-700 dark:text-gray-200'>Sweden</h2>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  Husåsvägen 15, 855 99 Liden <br /> Sweden
                </p>
              </div>
            </div>
          </div>
          <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8' />
          <div className='sm:flex sm:items-center sm:justify-center'>
            <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
              © 2023{'{'}'{'{'}'{'}'}' '{'{'}'{'}'}'{'}'}
              <a href='https://flowbite.com/' className='hover:underline'>
                Hardvard
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
