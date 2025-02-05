"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { Speciality } from "@prisma/client"
import { Stethoscope, Baby, Brain, Flower2, HeartPulse, Microscope, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react"

interface AppointmentSidebarProps {
  specialties: Speciality[]
  selectedSpecialty: Speciality | null
  onSpecialtyClick: (specialty: Speciality) => void
  onClearFilter: () => void
}

const specialtyIcons = {
  GENERAL_PHYSICIAN: Stethoscope,
  GYNECOLOGIST: Flower2,
  DERMATOLOGIST: Microscope,
  PEDIATRICIAN: Baby,
  NEUROLOGIST: Brain,
  GASTROENTEROLOGIST: HeartPulse,
}

export function AppointmentSidebar({
  specialties,
  selectedSpecialty,
  onSpecialtyClick,
  onClearFilter,
}: AppointmentSidebarProps) {
  const [isCollapsed] = React.useState(false)
  return (
    <Sidebar data-collapsed={isCollapsed} className="border-r h-[calc(100vh-70px)] top-[70px] bg-[#D3D3D3] text-black sticky" collapsible="icon">

      <SidebarHeader className="px-4 py-2  flex items-center ">
        <h2 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">Specialties</h2>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-70px-4rem)] ">
          <div className="space-y-2 p-2">
            {specialties.map((specialty) => {
              const Icon = specialtyIcons[specialty] || Stethoscope
              return (
                <Tooltip key={specialty}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedSpecialty === specialty ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onSpecialtyClick(specialty)}
                    >
                      <Icon className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-4" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {specialty.replace('_', ' ')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                    {specialty.replace('_', ' ')}
                  </TooltipContent>
                </Tooltip>
              )
            })}
            {selectedSpecialty && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-600"
                    onClick={onClearFilter}
                  >
                    <X className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Clear Filter
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                  Clear Filter
                </TooltipContent>
              </Tooltip>
            )}
          </div>
   
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

