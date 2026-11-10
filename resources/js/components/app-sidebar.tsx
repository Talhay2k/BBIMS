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
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
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

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B0F17]"
        >
            <SidebarHeader className="flex h-14 shrink-0 flex-row items-center border-b border-slate-200 bg-white px-4 py-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 dark:border-slate-800 dark:bg-[#0B0F17]">
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex w-full items-center gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 focus:outline-none"
                >
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="[scrollbar-width:none] overflow-y-auto bg-white group-data-[collapsible=icon]:items-center dark:bg-[#0B0F17] [&::-webkit-scrollbar]:hidden">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="space-y-1.5 border-t border-slate-200 bg-white p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 dark:border-slate-800 dark:bg-[#0B0F17]">
                <ThemeToggle variant="sidebar" />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
