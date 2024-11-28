import Image from "next/image";
import { Heart, Shield, Clock, Brain, Stethoscope, Users } from "lucide-react";
import Head_of_Gastroenterologist from "@/assets/assets_frontend/Head_of_Gastroenterologist.jpg";
import Lead_Surgeon from "@/assets/assets_frontend/Lead_Surgeon.jpg";
import Head_of_Cardiology from "@/assets/assets_frontend/Head_of_Cardiology.jpg";
import Chief_Medical_Officer from "@/assets/assets_frontend/Chief_Medical_Officer.jpg";
import AboutImage from "@/assets/assets_frontend/about_image.png";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import {teams} from '@/assets/assets_frontend/assets'

export default function AboutPage() {
  return (
    <div className=" min-h-screen  sm:py-[120px]">
      <div className="relative isolate ">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Hero Section with Gradient */}
        <section className="container mx-auto text-center">
          <HeroHighlight>
            <div className=" px-4 py-24">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Healthcare Excellence
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Dedicated to providing exceptional healthcare services with a
                focus on patient comfort and advanced medical solutions. Your
                health is our priority.
              </p>
              {/* </section>
            <section className="container mx-auto px-4 py-16  cardb"> */}
              {/* Mission  */}
              <div className="grid md:grid-cols-2 gap-12 items-center mt-16 mb-10">
                <div>
                  <h2 className="text-3xl font-semibold mb-4 text-start">
                    Our Mission
                  </h2>
                  <p className="text-md text-gray-300  mb-4 text-start">
                    At our healthcare platform, we strive to connect patients
                    with the best doctors, ensuring everyone has access to
                    quality healthcare. Our mission is to make healthcare more
                    accessible, efficient, and patient-centric.
                  </p>
                  <p className="text-md text-gray-300 text-start">
                    We believe in leveraging technology to improve the
                    healthcare experience for both patients and doctors,
                    creating a seamless connection between those seeking care
                    and those providing it.
                  </p>
                </div>
                <div className="relative h-[300px] md:h-[400px]">
                  <Image
                    src={AboutImage}
                    alt="Healthcare professionals"
                    className="absolute top-0 left-0 w-full h-full object-cover object-top rounded-lg"
                    priority
                    // className="object-cover rounded-lg object-top"
                  />
                </div>
              </div>
              {/* Achevments */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 pt-16">
                {stats.map((stat) => (
                  <div key={stat.value} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </HeroHighlight>
        </section>

        {/* Values Section with Radial Gradient */}
        <section className=" realtive container mx-auto px-4 py-16 bg-gradient-radial from-blue-900 to-[#0B1120]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-[calc(100%-1rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-70rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(150%-20rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Values</h2>
          <p className="text-gray-300 mb-12 max-w-2xl">
            We&apos;re committed to delivering exceptional healthcare services
            with compassion, expertise, and cutting-edge medical solutions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                </div>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold mb-4">Our team</h2>
          <p className="text-gray-400 text-xl mb-12 max-w-3xl">
            We&apos;re a dedicated group of healthcare professionals committed
            to providing exceptional care and improving patient outcomes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {teams.map((member) => (
              <div key={member._id} className="flex flex-col items-center justify-center gap-1">
                <div className="relative size-36 rounded-full border-2 flex items-center justify-center  mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={100}
                    height={100}
                    priority
                    className="object-cover object-top rounded-full w-full h-full"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
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
      </div>
    </div>
  );
}

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "100+", label: "Medical Specialists" },
  { value: "50k+", label: "Patients Served" },
  { value: "98%", label: "Patient Satisfaction" },
];

const values = [
  {
    title: "Patient-Centered Care",
    description:
      "We prioritize patient comfort and well-being, ensuring personalized care that meets individual needs.",
    icon: <Heart className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Medical Excellence",
    description:
      "Our team of specialists provides cutting-edge medical solutions and treatments.",
    icon: <Stethoscope className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Quick Response",
    description:
      "We ensure prompt medical attention and efficient healthcare services when you need them most.",
    icon: <Clock className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Expert Team",
    description:
      "Our healthcare professionals bring years of experience and expertise to provide the best care.",
    icon: <Users className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Advanced Technology",
    description:
      "We utilize state-of-the-art medical technology for accurate diagnosis and treatment.",
    icon: <Brain className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Safe & Secure",
    description:
      "Your health information and privacy are protected with the highest level of security.",
    icon: <Shield className="w-5 h-5 text-blue-400" />,
  },
];

