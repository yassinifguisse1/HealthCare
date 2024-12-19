"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants , Button } from '@/components/ui/button'
import logoImage from "@/assets/images/logosaas.png"
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useUser } from "@clerk/nextjs";




const items = [
  {labe : "Home" , link : "/"},
  {labe : "All Doctors" , link : "/Doctors"},
  {labe : "About" , link : "/about"},
  {labe : "Contact" , link : "/contact"}
]

type NavbarItemType = {
  labe : string,
  link : string,
  clickCallback?: ()=> void;
}
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  

  return (
    <>
      <DesktopNavbar/>
      <MobileNavbar 
      isOpen={isMobileMenuOpen} 
      onOpenChange={handleMobileMenuToggle}
      onClose={handleMobileMenuClose}
      />
    </>
  )
}

export default Navbar
 function DesktopNavbar(){
  // check role 
  // const isAdmin = await checkRole('admin')
  // Access the current organization and membership
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const isAdmin = userRole === "admin";
 

  return (
    <div className=" hidden border-separate border-b transition-all duration-300 md:block z-50 fixed top-0 left-0 right-0 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/20">
      <nav className="container mx-auto w-full flex items-center justify-between h-[70px] min-h-[70px] transition-colors duration-300 ">
        {/* Logo */}
        <div className="relative">
          <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
          <Image
            src={logoImage}
            alt="Picture of the author"
            className="size-10 relative"
          />
        </div>

        {/* items and appointement btn */}
        <div className="flex items-center justify-center">
          <div className="flex">
            {items.map((item) => (
              <NavbarItem key={item.labe} labe={item.labe} link={item.link} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SignedOut>
              <div className="md:block hidden">
                <SignInButton>
                  <Button>Log In</Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/about" className="flex items-center gap-x-3">
                {isAdmin ? (
                  <div className="flex items-center gap-x-3">
                    <Link href="/admin" className="flex items-center gap-x-3">
                      <Button>Admin Dashboard</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-3">
                    <Link
                      href="/appointments"
                      className="flex items-center gap-x-3"
                    >
                      <Button>Appointements</Button>
                    </Link>
                  </div>
                )}

                {/* <Button>
                    <span>Choose a Doctor</span>
                  </Button> */}
                <UserButton userProfileMode="modal" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  );
}


function NavbarItem({labe , link , clickCallback} : NavbarItemType){
  const pathname = usePathname()
  const isActive = pathname === link;
  return(
    <div className='relative flex items-center lg:px-2'>
      <Link href={link} className={cn(buttonVariants({
        variant:"ghost"}),
        `w-full justify-start text-lg md:text-md text-muted-foreground hover:text-foreground ",
        ${isActive} && "text-foreground font-mono`
       )} 
       onClick={()=>{
        if(clickCallback)
          {
            clickCallback()
            }
       }}
       >
      {labe}
      </Link>
      {isActive && <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[50%] -translate-x-1/2 rounded-xl bg-foreground md:block'></div>}
    </div>
  )

}
interface MobileNavbarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}
function MobileNavbar({ isOpen, onOpenChange, onClose }:MobileNavbarProps){

  return (
    <div className="md:hidden border-separate border-b block z-50 fixed  w-full   bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/20">
      <nav className="container mx-auto flex items-center justify-between h-[70px]  min-h-[70px] transition-colors duration-300 px-5">
        <div className="relative">
          <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
          <Image
            src={logoImage}
            alt="Picture of the author"
            className="size-10 relative"
          />
        </div>

        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/story" className="flex items-center gap-x-3">
              <Button>hI test</Button>
              <UserButton userProfileMode="modal" />
            </Link>
          </SignedIn>

          <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu className="cu cursor-pointer" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              {/* <SheetHeader> */}
              <SheetHeader className="hidden">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Access our s main navigation links here.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col ">
                <div className="flex flex-col h-full py-5 ">
                  {items.map((item) => (
                    <NavbarItem
                      key={item.labe}
                      labe={item.labe}
                      link={item.link}
                      clickCallback={onClose}
                    />
                  ))}
                </div>
                <SignedOut>
                  <SignInButton>
                    <Button className="w-1/2">Log In</Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}


