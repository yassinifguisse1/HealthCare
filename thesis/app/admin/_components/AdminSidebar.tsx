"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logoImage from "@/assets/images/logosaas.png"
import type React from "react"

export function AdminSidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile } = useSidebar()

  return (
    <Sidebar className={cn("border-r bg-[#D3D3D3] text-black", className)} collapsible="icon">
      <SidebarHeader>
        <div className="relative flex items-center justify-center mx-auto size-12">
          <div className="absolute w-full h-full top-0 left-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md opacity-75" />
          <Image src={logoImage || "/placeholder.svg"} alt="Logo" width={32} height={32} className="relative" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)] px-2 mt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Overview">
                <Link href="/admin" className="flex items-center">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="ml-2 transition-opacity duration-200">Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="User Management">
                <Link href="/admin/users" className="flex items-center">
                  <Users className="h-4 w-4" />
                  <span className="ml-2 transition-opacity duration-200">User Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Doctor Management">
                <Link href="/admin/doctors" className="flex items-center">
                  <Settings className="h-4 w-4" />
                  <span className="ml-2 transition-opacity duration-200">Doctor Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Help & Support">
                <Link href="/admin/help" className="flex items-center">
                  <HelpCircle className="h-4 w-4" />
                  <span className="ml-2 transition-opacity duration-200">Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

