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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
