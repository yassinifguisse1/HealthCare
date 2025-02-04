// "use client"
// import React from 'react'
// import Image from 'next/image';
// import acmeLogo from "@/assets/images/acme.png";
// import quantumLogo from "@/assets/images/quantum.png"
// import echoLogo from '@/assets/images/echo.png'
// import celestialLogo from "@/assets/images/celestial.png"
// import pulseLogo from "@/assets/images/celestial.png"
// import apexLogo from '@/assets/images/apex.png'
// import { motion } from 'framer-motion';

// const image = [
//     {src: acmeLogo , alt:'acme Logo'},
//     {src: quantumLogo , alt:'quantum Logo'},
//     {src: echoLogo , alt:'echo Logo'},
//     {src: celestialLogo , alt:'celestial Logo'},
//     {src: pulseLogo , alt:'pulse Logo'},
//     {src: apexLogo , alt:'apex Logo'},
    
// ]

// const LogoTocker = () => {
//   return (
//     <div className="py-[72px] sm:p-24">
//       <div className="container mx-auto flex flex-col justify-center items-center">
//         <h2 className="text-xl text-center text-white/70">
//           Trustd by the world&apos;s most innovative teams
//         </h2>
//         <div className="flex overflow-hidden mt-9 before:content-[''] before:z-10 after:content-[''] before:absolute after:absolute before:h-full after:h-full before:w-5 after:w-5 relative   after:right-0 before:left-0 before:top-0 after:top-0 before:bg-[linear-gradient(to_right,#000,rgb(0,0,0,0))] after:bg-[linear-gradient(to_left,#000,rgb(0,0,0,0))]">
//           {/* <motion.div
//           transition={
//             {
//               duration: 12,
//               repeat: Infinity,
//               ease: "linear"
//             }
//           }
//           initial={{ translateX: 0 }} 
//           animate={{ translateX: "-40%" }}
//           className="flex gap-16 flex-none pr-16">
//             {image.map((item, index) => (
//               <Image
//                 key={index}
//                 src={item.src}
//                 alt={item.alt}
           
//                 className="flex-none h-8 w-auto "
//               />
//             ))}
//              {image.map((item, index) => (
//               <Image
//                 key={index}
//                 src={item.src}
//                 alt={item.alt}
           
//                 className="flex-none h-8 w-auto "
//               />
//             ))}
          
               
            
//           </motion.div> */}
//           <motion.div
//             animate={{ x: [0, "-50%"] }}
//             transition={{
//               x: {
//                 duration: 10,
//                 repeat: Infinity,
                
//                 ease: "linear",
//               },
//             }}
//             className="flex gap-16 flex-nowrap "
//           >
//             {[...image, ...image].map((item, index) => (
//               <Image
//                 key={index}
//                 src={item.src || "/placeholder.svg"}
//                 alt={item.alt}
//                 className="h-8 w-auto object-contain"
//               />
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LogoTocker
"use client"
import Image from "next/image"
import acmeLogo from "@/assets/images/acme.png"
import quantumLogo from "@/assets/images/quantum.png"
import echoLogo from "@/assets/images/echo.png"
import celestialLogo from "@/assets/images/celestial.png"
import pulseLogo from "@/assets/images/pulse.png"
import apexLogo from "@/assets/images/apex.png"
import { motion } from "framer-motion"

const images = [
  { src: acmeLogo, alt: "Acme Logo" },
  { src: quantumLogo, alt: "Quantum Logo" },
  { src: echoLogo, alt: "Echo Logo" },
  { src: celestialLogo, alt: "Celestial Logo" },
  { src: pulseLogo, alt: "Pulse Logo" },
  { src: apexLogo, alt: "Apex Logo" },
]

const LogoTocker = () => {
  return (
    <div className="py-[72px] sm:p-24">
      <div className="container mx-auto flex flex-col justify-center items-center">
        <h2 className="text-xl text-center text-white/70">Trusted by the world&apos;s most innovative teams</h2>
        <div className="flex overflow-hidden mt-9 relative w-full">
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              x: {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              },
            }}
            className="flex gap-16 flex-nowrap"
          >
            {[...images, ...images].map((item, index) => (
              <Image
                key={index}
                src={item.src || "/placeholder.svg"}
                alt={item.alt}
                className="h-8 w-auto object-contain"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LogoTocker

