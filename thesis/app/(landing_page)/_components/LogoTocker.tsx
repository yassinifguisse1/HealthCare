import React from 'react'
import Image from 'next/image';
import acmeLogo from "@/assets/images/acme.png";
import quantumLogo from "@/assets/images/quantum.png"
import echoLogo from '@/assets/images/echo.png'
import celestialLogo from "@/assets/images/celestial.png"
import pulseLogo from "@/assets/images/celestial.png"
import apexLogo from '@/assets/images/apex.png'

const image = [
    {src: acmeLogo , alt:'acme Logo'},
    {src: quantumLogo , alt:'quantum Logo'},
    {src: echoLogo , alt:'echo Logo'},
    {src: celestialLogo , alt:'celestial Logo'},
    {src: pulseLogo , alt:'pulse Logo'},
    {src: apexLogo , alt:'apex Logo'},
    
]

const LogoTocker = () => {
  return (
    <div className="py-[72px] sm:p-24">
      <div className="container mx-auto flex flex-col justify-center items-center">
        <h2 className="text-xl text-center text-white/70">
          Trustd by the world&apos;s most innovative teams
        </h2>
        <div className="overflow-hidden mt-9 before:content-[''] after:content-[''] before:absolute after:absolute before:h-full after:h-full before:w-5 after:w-5 relative   after:right-0 before:left-0 before:top-0 after:top-0 before:bg-[linear-gradient(to_right,#000,rgb(0,0,0,0))] after:bg-[linear-gradient(to_left,#000,rgb(0,0,0,0))]">
          <div className="flex gap-16">
            {image.map((item, index) => (
              <Image
                key={index}
                src={item.src}
                alt={item.alt}
           
                className="flex-none h-8 w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoTocker