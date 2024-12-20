import { AdminSidebar } from "@/app/admin/_components/AdminSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <SidebarProvider>

      <div className="flex h-screen w-full">
        <AdminSidebar className="w-64" />
        <SidebarTrigger />
        <main className="flex-1 overflow-y-auto p-8 ">
       

          {children}
          </main>
      </div>
      </SidebarProvider>

    )
  }