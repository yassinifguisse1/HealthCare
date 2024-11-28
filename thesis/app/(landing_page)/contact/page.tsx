"use client";

import React from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui input
import { Button } from "@/components/ui/button"; // shadcn/ui button
import { Textarea } from "@/components/ui/textarea"; // shadcn/ui textarea
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  return (
    <section className="relative bg-dark text-white min-h-screen flex items-center justify-center sm:py-32 ">
      {/* Background effect */}

      <div className="max-w-6xl mx-auto  rounded-lg backdrop-blur-sm bg-white/30">
        <div className="grid grid-cols-1 md:grid-cols-2  ">
          {/* Contact Information */}
          <HeroHighlight>
            <div className="relative space-y-4 h-[40rem] rounded-tl-lg rounded-bl-lg px-6 flex items-start justify-center flex-col ">
              <div
                aria-hidden="true"
                className="absolute  inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>
              <h2 className="text-5xl pb-7 font-bold text-start bg-[linear-gradient(to_right,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)]  text-transparent bg-clip-text [-webkit-background-clip:text]">
                Get in touch
              </h2>
              <p className="text-lg text-muted-foreground text-md text-start pb-5">
                We are here to assist you with your healthcare needs. Whether
                you have questions about our services, need help booking an
                appointment, or want to learn more about our medical
                professionals, feel free to reach out to us.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 ">
                  <MapPin className="text-primary w-6 h-6" />
                  <p>123 Wellness Blvd, Springfield, IL 62704</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="text-primary w-6 h-6" />
                  <p>+1 (800) 123-4567</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="text-primary w-6 h-6" />
                  <p>support@healthcareplatform.com</p>
                </div>
              </div>
            </div>
          </HeroHighlight>

          {/* Contact Form */}
          <div className="ralative bg-dark p-6 rounded-r-xl  flex items-center justify-center ">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              />
            </div>
            <form className="space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First name"
                  className="bg-black"
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  className="bg-black"
                />
              </div>
              <Input type="email" placeholder="Email" className="bg-black" />
              <Input
                type="tel"
                placeholder="Phone number"
                className="bg-black"
              />
              <Textarea placeholder="Message" className="h-32 bg-black" />
              <Button type="submit" className="w-full bg-black text-white">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

};

export default ContactPage;
