"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants , Button } from '@/components/ui/button'
// import {  SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import logoImage from "@/assets/images/logosaas.png"
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"




const items = [
  {labe : "Home" , link : "/"},
  {labe : "Find a provider" , link : "/story"},
  {labe : "Find care" , link : "/saves"},
  // {labe : "Location" , link : "/saves"},
  {labe : "Medical Service" , link : "/saves"}
]

type NavbarItemType = {
  labe : string,
  link : string,
  clickCallback?: ()=> void;
}
const Navbar = () => {
  

  return (
    <>
      <DesktopNavbar/>
      <MobileNavbar/>
    </>
  )
}

export default Navbar
function DesktopNavbar(){
  return (
    <div className=" hidden border-separate border-b transition-all duration-300 md:block z-50 fixed top-0 left-0 right-0 w-full bg-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <div className='flex items-center justify-center'>
          <div className="flex">
            {items.map((item) => (
              <NavbarItem key={item.labe} labe={item.labe} link={item.link} />
            ))}
          </div>
          <Button>Login</Button>
        </div>

        {/* <div className="flex items-center gap-2">

          <SignedOut>
            <div className="md:block hidden">
              <SignInButton>
                <Button
                  className={cn(
                    
                      ? "bg-white text-black dark:bg-black dark:text-white "
                      : " bg-black text-white dark:bg-white dark:text-black"
                  )}
                >
                  Log In
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/story" className="flex items-center gap-x-3">
              <Button
                className={cn(
                  
                    ? "bg-white text-black dark:bg-black dark:text-white "
                    : " dark:bg-white dark:text-black"
                )}
              >
                <Plus className="mr-2 h-6 w-6" />
                <span>Create a story</span>
              </Button>
              <UserButton userProfileMode="modal" />
            </Link>
          </SignedIn>
        </div> */}
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
function MobileNavbar(){
  return (
    <div className="md:hidden border-separate border-b block z-50 container mx-auto">
      <nav className="flex items-center justify-between h-[70px] min-h-[70px] transition-colors duration-300 px-5">
       <div className="relative">
        <div className='absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md'></div>
       <Image
          src={logoImage}
          alt="Picture of the author"
          className='size-10 relative'
        />
       </div>
       
        <div className="flex items-center gap-3">
          {/* <SignedIn>
            <Link href="/story" className="flex items-center gap-x-3">
              <Button
                className={cn(
                  
                    ? "bg-white text-black dark:bg-black dark:text-white "
                    : " dark:bg-white dark:text-black"
                )}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <UserButton userProfileMode="modal" />
            </Link>
          </SignedIn> */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <div className="flex flex-col h-full py-5">
                  {items.map((item) => (
                    <NavbarItem
                      key={item.labe}
                      labe={item.labe}
                      link={item.link}
                    />
                  ))}
                </div>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  {/* <SignedOut>
                    <SignInButton>
                      <Button className="w-1/2">Log In</Button>
                    </SignInButton>
                  </SignedOut> */}
                  Log In
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}