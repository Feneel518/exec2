"use client";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { FC } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { user } = useUser();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-24 shrink-0 items-center gap-2 border-b p-4 text-3xl">
          <SidebarTrigger className="-ml-1 h-full cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-full font-semibold"
          />
          Welcome, {user?.fullName}
        </header>
        <div className="p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
