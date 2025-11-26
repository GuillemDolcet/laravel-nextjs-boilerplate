"use client";

import {
    IconDashboard,
    IconHome,
    IconUser,
    IconSettings
} from "@tabler/icons-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import {Link} from "@/i18n/routing";
import {useIsMobile} from "@/hooks/use-mobile";
import * as React from "react";

const navItems = [
    { name: "Dashboard", icon: IconDashboard, href: "#dashboard" },
    { name: "Inicio", icon: IconHome, href: "#home" },
    { name: "Perfil", icon: IconUser, href: "#profile" },
    { name: "Configuración", icon: IconSettings, href: "#settings" },
];

export function AppSidebar() {
    const isMobile = useIsMobile();

    return (
        <Sidebar collapsible="icon" className="fixed left-0 top-0 h-screen">
            { !isMobile &&
                <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 z-50">
                    <SidebarTrigger className="border cursor-pointer bg-white dark:bg-transparent" />
                </div>
            }
            <SidebarContent className="flex items-center justify-center">
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu className={"gap-8"}>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton tooltip={item.name} asChild className="text-lg">
                                        <Link href={item.href} className="flex items-center gap-4">
                                            <item.icon size={24} />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}