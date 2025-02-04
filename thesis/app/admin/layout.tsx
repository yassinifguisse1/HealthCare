import { AdminSidebar } from "@/app/admin/_components/AdminSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <SidebarProvider style={{
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
        "--sidebar-width-icon": "4rem",
      } as React.CSSProperties}>

      <div className="flex h-screen w-full">
        <AdminSidebar />
        <SidebarTrigger/>
        <main className="flex-1 overflow-y-auto p-8 ">
       

          {children}
          </main>
      </div>
      </SidebarProvider>

    )
  }