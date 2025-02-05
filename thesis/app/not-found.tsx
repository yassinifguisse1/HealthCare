"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-800 text-white px-4 pt-32">
      <div className="text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-gray-900 transition-colors duration-300"
            >
              Go back home
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              fill="none"
              strokeWidth="3"
              stroke="white"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              fill="none"
              strokeWidth="3"
              stroke="white"
              d="M 70 80 L 100 110 L 130 80 M 100 110 L 100 140"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound

