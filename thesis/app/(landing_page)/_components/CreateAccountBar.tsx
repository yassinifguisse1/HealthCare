import { Button } from '@/components/ui/button'
import React from 'react'
import DoctorImage from '@/assets/assets_frontend/appointment_img.png'
import Image from 'next/image'
import Link from 'next/link'

const CreateAccountBar = () => {
  return (
    <section className="py-[72px] sm:py-24 text-white">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 sm:py-0 bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] rounded-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-8 md:gap-12 mx-auto">
          <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Book Appointment
            </h2>
            <p className="text-base sm:text-lg text-purple-200 max-w-md mx-auto md:mx-0">
              With 100+ Trusted Doctors
            </p>
            <Link href="/sign-in">
              <Button
                size="lg"
                className="px-6 sm:px-8 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base"
              >
                Create Account
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/3 order-1 md:order-2 hidden md:block">
            <div className="relative w-full aspect-square max-w-[300px] md:max-w-none mx-auto">
              <Image
                src={DoctorImage}
                alt="Doctor pointing"
                className="object-contain "
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateAccountBar