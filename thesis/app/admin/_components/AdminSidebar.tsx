import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Settings, HelpCircle } from 'lucide-react'
import Link from "next/link"
import Image from 'next/image'
import logoImage from "@/assets/images/logosaas.png"

export function AdminSidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Sidebar className={cn("border-r inset-0 bg-[#D3D3D3] text-black rounded-r-lg", className)} collapsible="icon">
      <SidebarHeader>
         <div className="relative  flex items-center justify-center mx-auto size-12 group-data-[collapsible=icon]:hidden">
              <div className="absolute  w-full h-full top-0 left-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md opacity-75"></div>
              <Image
                src={logoImage}
                alt="Logo"
                className="size-8 relative flex items-start justify-start"
              />
            </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)] px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </SidebarMenuButton>
              {/* <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" /> */}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/doctors">
                  <Settings className="mr-2 h-4 w-4" />
                  Doctor Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

