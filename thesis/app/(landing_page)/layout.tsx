import React, { ReactNode } from 'react'
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';

const layout = ({children}:{children : ReactNode}) => {
  return (
      <div className="h-[calc(100vh-80px)] flex flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
  );
}

export default layout