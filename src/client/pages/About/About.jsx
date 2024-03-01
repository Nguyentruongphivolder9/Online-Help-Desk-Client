import React from 'react'

const About = () => {
  return (
    <div className='lg:py-16 md:py-12 py-9 z-0'>
      <div className='w-full mb-12'>
        <video className='w-full h-[90%]' width='320' height='240' autoPlay muted loop>
          <source src='../../../../public/banner_about_video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className='border-t-[1px] border-black'></div>
      <div className='container mx-auto mt-8'>
        <div className='flex flex-col lg:flex-row justify-between gap-8'>
          <div className='w-full lg:w-1/2 flex flex-col justify-center'>
            <div className='font-normal p-6 leading-6 text-gray-600 lg:gap-4 shadow-lg rounded-md'>
              <p className='text-3xl lg:text-4xl leading-9 font-bold text-gray-800 pb-4 text-center'>About Us</p>
              <p className=''>
                On September 8, 1636, Harvard, the first college in the American colonies, was founded in Cambridge,
                Massachusetts. Harvard University was officially founded by a vote by the Great and General Court of the
                Massachusetts Bay Colony. Harvard’s endowment started with John Harvard’s initial donation of 400 books
                and half his estate, but in 1721, Thomas Hollis began the now standard practice of requiring that a
                donation be used for a specific purpose when he donated money for “a Divinity Professor, to read
                lectures in the Halls to the students.”
              </p>
            </div>
          </div>
          <div className='w-full lg:w-1/2 '>
            <img className='w-full h-full' src='https://i.ibb.co/FhgPJt8/Rectangle-116.png' alt='A group of People' />
          </div>
        </div>

        <div className='flex lg:flex-row flex-col justify-between items-center gap-8 pt-12'>
          <div className='w-full lg:w-5/12 flex flex-col justify-center'>
            <p className='font-normal text-base leading-6 text-gray-600 '>
              <img
                className='h-[400px] w-full object-cover object-top brightness-50'
                src='../../../../public/052523_COM-2023-A_JC_1686-2000x1333.webp'
                alt='nature image'
              />
            </p>
          </div>
          <div className='w-full lg:w-8/12 lg:pt-8'>
            <div className='lg:gap-4 shadow-lg rounded-md'>
              <div className='p-4 pb-6 flex justify-center flex-col items-center'>
                <h1 className='text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4'>College Offices</h1>
                <p>
                  From health services, advising, and accommodations for disabilities, to help with foreign languages
                  and technology, find all the resources to support and guide you. The staff of campus offices ensure
                  you always have somewhere to turn for help navigating college life. Improve your study skills, take
                  the first step on the path to career success, or enliven your day with an infusion of arts and
                  culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='relative mt-20'>
        <div className='absolute top-1/2 w-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
          <div className='flex flex-col justify-center items-center md:flex-row lg:flex-row md:flex lg:flex w-full lg:items-center '>
            <p className='text-white w-1/3 font-bold text-5xl text-center font-serif'>About us</p>
            <h2 className='text-white w-2/3  text-3xl text-center font-serif'>
              Those who venture here—to learn, research, teach, work, and grow—join nearly four centuries of students
              and scholars in the pursuit of truth, knowledge, and a better world.
            </h2>
          </div>
        </div>
        <img
          className='h-[800px] w-full object-cover object-top brightness-50'
          src='../../../../public/110823_Features_KS_713-2000x1333.webp'
          alt='nature image'
        />
      </div>
    </div>
  )
}

export default About
