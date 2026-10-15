import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Droplet,
    Truck,
    GitCompare,
    Users,
    Calendar,
    Building2,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Command Center',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Blood Inventory',
        href: '/dashboard?tab=inventory',
        icon: Droplet,
    },
    {
        title: 'STAT Dispatch',
        href: '/dashboard?tab=requests',
        icon: Truck,
    },
    {
        title: 'Cross-Match Lab',
        href: '/dashboard?tab=compatibility',
        icon: GitCompare,
    },
    {
        title: 'Donor Registry',
        href: '/dashboard?tab=donors',
        icon: Users,
    },
    {
        title: 'Donation Drives',
        href: '/dashboard?tab=drives',
        icon: Calendar,
    },
    {
        title: 'Cold Vault Facilities',
        href: '/dashboard?tab=facilities',
        icon: Building2,
    },
    {
        title: 'AI Supply Forecast',
        href: '/dashboard?tab=ai',
        icon: Sparkles,
    },
    {
        title: 'Audit & Compliance',
        href: '/dashboard?tab=audit',
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17]">
            <SidebarHeader className="flex h-16 shrink-0 flex-row items-center border-b border-slate-200 dark:border-slate-800 px-4 py-0 gap-0 bg-white dark:bg-[#0B0F17]">
                <Link href={dashboard()} prefetch className="flex items-center gap-2.5 w-full focus:outline-none">
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="bg-white dark:bg-[#0B0F17]">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-[#0B0F17]">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
