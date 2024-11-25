import { Button } from '@/components/ui/button';
import Link from 'next/link'
import React from 'react'
import ArrowWIcon from '@/assets/icons/arrow-w.svg'
import cusorImage from '@/assets/images/cursor.png'
import messageImagr from '@/assets/images/message.png'
import Image from 'next/image';

const Hero = () => {
  return (
    <div className=" px-4 bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip">
      <div className="absolute h-[370px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[1200px] xl:w-[2900px] xl:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>

      <div className="container mx-auto flex justify-center items-center flex-col relative">
        <div className="flex justify-center items-center">
          <Link
            href="#"
            className="inline-flex gap-3 py-1 px-2 rounded-lg border border-white/30"
          >
            <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)]  text-transparent bg-clip-text [-webkit-background-clip:text]">
              Online health experts available 24/7
            </span>
            <span className="inline-flex items-center gap-1">
              <span>Read More</span>
              <ArrowWIcon />
            </span>
          </Link>
        </div>
        <div className="inline-flex relative mt-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center ">
            Expert Health Consultations <br /> Anytime, Anywhere
          </h1>
          <Image
            src={messageImagr}
            alt=""
            width={200}
            height={200}
            className="absolute right-[490px] top-[35px] md:right-[486px] md:top-[50px] xl:right-[596px] xl:top-[50px] hidden sm:inline"
          />
          <Image
            src={cusorImage}
            alt=""
            width={200}
            height={200}
            className="absolute left-[468px] -top-[10px] md:left-[498px] md:top-[0px] xl:left-[596px] xl:top-[0px] hidden sm:inline"
          />
        </div>
        <p className="md:text-xl  text-center mt-8 max-w-md">
          Access top-tier health consultations from the comfort of your home or
          on the go. Our expert team is here to provide personalized medical
          guidance and ensure your well-being.
        </p>
        <div className="flex justify-center items-center mt-8">
          <Button className="py-3 px-5 rounded-lg font-medium">
            Get Appointement
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero