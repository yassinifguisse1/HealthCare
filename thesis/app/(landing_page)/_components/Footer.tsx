import React from 'react'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import logoImage from "@/assets/images/logosaas.png"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


const Footer = () => {
  return (
    <footer className="py-8 z-50 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="relative  size-12 flex items-center justify-center mx-auto">
            <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
            <Image
              src={logoImage}
              alt="Picture of the author"
              className="size-10 relative "
            />
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start ">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <Link
              href="/"
              className="mb-2 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="mb-2 hover:text-primary transition-colors"
            >
              About us
            </Link>
            <Link
              href="/delivery"
              className="mb-2 hover:text-primary transition-colors"
            >
              Delivery
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy policy
            </Link>
          </div>

          {/* Get in Touch */}
          <div className="flex flex-col items-center md:items-start ">
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <p className="flex items-center mb-2">
              <Phone className="w-4 h-4 mr-2" />
              +0-000-000-000
            </p>
            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              greatstackdev@gmail.com
            </p>
          </div>

          {/* Newsletter (optional) */}
          <div className="flex flex-col items-center md:items-start ">
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-2 text-sm">Stay updated with our latest news</p>
            
            <Input type="email" placeholder="Email"  className="w-full p-2 border rounded mb-2"/>
            <Button className=" py-2 px-4 rounded hover:bg-primary-dark transition-colors">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm">
            Copyright 2024 - All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer

