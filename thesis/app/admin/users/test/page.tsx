import React from 'react'
import FetchAdminToken from '../../_components/FetchAdminToken'
import { CalendarDemo } from '../../_components/CalendarDemo'

const page = () => {
  return (
    <div className='h h-screen flex justify-center items-center mx-auto'>
        <FetchAdminToken/>
        <CalendarDemo/>

    </div>
  )
}

export default page