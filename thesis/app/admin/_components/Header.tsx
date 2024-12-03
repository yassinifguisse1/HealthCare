import React from 'react'



const Header = () => {
  return (
    <section className='py-10'>
      <div className='container mx-auto'>
        <div className='relative py-4 px-8 rounded-lg shadow-lg overflow-hidden'>
          <div className='relative flex justify-start items-start z-10'>
           
            <h2 className='text-xl md:text-2xl font-bold text-white'>
              Welcome to the Admin Dashboard 👋
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Header