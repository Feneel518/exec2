"use client";

import { sidebarGroups } from "@/lib/constants/sidebarData";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // open all groups that have defaultOpen=true, else keep closed
  // const defaultValue = sidebarGroups
  //   .map((g, index) => (g.defaultOpen ? `item-${index}` : null))
  //   .filter(Boolean) as string[];
  return (
    <Sidebar {...props} className="">
      <SidebarHeader className="border-b border-white">
        <Link
          href={"/dashboard"}
          className="relative aspect-[1857/619] w-full   "
        >
          <Image
            src={"/fullLogo.png"}
            alt="Explosion Proof Electrical Control Logo"
            fill
          ></Image>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-4 w-full">
        <Accordion
          type="single"
          collapsible
          // defaultValue={defaultValue}
          className="space-y-2 w-full"
        >
          {sidebarGroups.map((group, index) => {
            const GroupIcon = group.icon;
            return (
              <AccordionItem
                key={group.label}
                value={`item-${index + 1}`}
                className="w-full"
              >
                <SidebarGroup key={group.label} className="w-full">
                  <SidebarGroupLabel className="w-full">
                    <AccordionTrigger className="text-white w-full ">
                      {<GroupIcon className="" strokeWidth={1}></GroupIcon>}{" "}
                      {group.label}
                    </AccordionTrigger>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <AccordionContent>
                      <SidebarMenu>
                        {group.children.map((item) => {
                          const active =
                            pathname === item.href ||
                            pathname?.startsWith(item.href + "/");
                          const Icon = item.icon;
                          return (
                            <SidebarMenuItem key={item.title} className="pl-4">
                              <SidebarMenuButton asChild isActive={active}>
                                <Link href={item.href}>
                                  {Icon ? <Icon strokeWidth={1}></Icon> : null}{" "}
                                  {item.title}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </AccordionContent>
                  </SidebarGroupContent>
                </SidebarGroup>
              </AccordionItem>
            );
          })}
        </Accordion>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
