import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SherlockProvider } from "@/components/sherlock/provider"
import { SherlockSidepanel } from "@/components/sherlock/sidepanel"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SherlockProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
      <SherlockSidepanel />
    </SherlockProvider>
  )
}
