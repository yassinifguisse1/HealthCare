import DoctorList from "./_components/DoctorList";
import Hero from "./_components/Hero";
import LogoTocker from "./_components/LogoTocker";
import SpecialityMenu from "./_components/SpecialityMenu";
import CreateAccountBar from "./_components/CreateAccountBar";
import { DoctorsProvider } from "@/context/DoctorsContext";
import Footer from "./_components/Footer";

export default function Home() {
   

  return (
    <DoctorsProvider>
      <Hero />
      <LogoTocker />
      <SpecialityMenu />
      <DoctorList/>
      <CreateAccountBar />
      <Footer />
    </DoctorsProvider>
  );
}
