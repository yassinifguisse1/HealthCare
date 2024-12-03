import DoctorList from "./_components/DoctorList";
import Hero from "./_components/Hero";
import LogoTocker from "./_components/LogoTocker";
import SpecialityMenu from "./_components/SpecialityMenu";
import CreateAccountBar from "./_components/CreateAccountBar";
export default function Home() {
  return (
    <>
      <Hero/>
      <LogoTocker/>
      <SpecialityMenu/>
      <DoctorList/>
      <CreateAccountBar/>
    </>
  );
}
