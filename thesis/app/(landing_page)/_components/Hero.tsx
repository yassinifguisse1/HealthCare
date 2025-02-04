"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import React from 'react'
import ArrowWIcon from '@/assets/icons/arrow-w.svg'
import cusorImage from '@/assets/images/cursor.png'
import messageImagr from '@/assets/images/message.png'
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className=" px-4 bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[74px] sm:py-24 relative overflow-clip">
      <div className="absolute h-[370px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[1200px] xl:w-[2900px]  rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-115px)]"></div>

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
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl xl:text-9xl  text-center bg-yellow-400Z sm:bg-red-500Z md:bg-green-500Z lg:bg-blue-500Z xl:bg-orange-500Z">
            Pick Your Doctor <br /> With Confidence
          </h1>
          <motion.div
            className="absolute right-[500px] top-[80px] md:right-[490px] md:top-[90px] xl:right-[872px] xl:top-[170px] hidden sm:inline sm:size-[140px]  lg:size-[150px]  xl:size-[200px]"
            drag
            dragSnapToOrigin
          >
            <Image
              src={messageImagr}
              alt=""
              // width={200}
              // height={200}
              className="max-w-none"
              draggable={false}
            />
          </motion.div>

          <motion.div
            className="absolute hidden sm:inline left-[468px] top-[0px] md:left-[498px] md:top-[0px] lg:top-[0px]  xl:left-[866px] xl:top-[20px] sm:size-[140px]  lg:size-[150px]  xl:size-[200px]"
            drag
            dragSnapToOrigin
          >
            <Image
              src={cusorImage}
              alt=""
              // width={200}
              // height={200}
              className="max-w-none"
              draggable={false}
            />
          </motion.div>
        </div>
        <p className="md:text-xl  text-center mt-8 max-w-md">
          Access top-tier health consultations from the comfort of your home or
          on the go. Our expert team is here to provide personalized medical
          guidance and ensure your well-being.
        </p>
        <div className="flex justify-center items-center mt-8">
          <Link href="/appointments">
            <Button className="py-3 px-5 rounded-lg font-medium">
              Get Appointement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero