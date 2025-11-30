import Sidebar from "@/components/dashboard/Sidebar";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </QueryProvider>
  );
}
