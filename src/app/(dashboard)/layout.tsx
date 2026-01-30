import { Sidebar } from "@/components/layout/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r bg-sidebar md:block fixed h-full inset-y-0 z-30">
                <ScrollArea className="h-full">
                    <Sidebar />
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
                <SiteHeader />
                <main className="flex-1 p-4 md:p-8 bg-background/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
