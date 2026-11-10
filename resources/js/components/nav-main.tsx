import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { url } = usePage();
    const [currentSearch, setCurrentSearch] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentSearch(window.location.search);
        }
    }, [url]);

    const isItemActive = (href: string) => {
        if (typeof window === 'undefined') return false;

        // Exact match for dashboard root vs query tabs
        if (href === '/dashboard' || href === '/dashboard/') {
            return !currentSearch || currentSearch === '?tab=overview';
        }

        const hrefUrl = new URL(href, window.location.origin);
        const tabParam = hrefUrl.searchParams.get('tab');
        if (tabParam) {
            return currentSearch.includes(`tab=${tabParam}`);
        }

        return window.location.pathname === hrefUrl.pathname;
    };

    return (
        <SidebarGroup className="px-3 py-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2">
            <SidebarGroupLabel className="mb-1.5 h-7 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Platform Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:space-y-1.5">
                {items.map((item) => {
                    const hrefStr =
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url;
                    const active = isItemActive(hrefStr);
                    return (
                        <SidebarMenuItem
                            key={item.title}
                            className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                        >
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={item.title}
                                className={`group relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] transition-all group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:!p-0 ${
                                    active
                                        ? 'bg-red-50 font-semibold text-red-600 ring-1 ring-red-500/20 dark:bg-red-500/15 dark:text-red-400'
                                        : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                                }`}
                            >
                                <Link
                                    href={hrefStr}
                                    prefetch
                                    className="flex w-full items-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                                >
                                    {active && (
                                        <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-red-600 group-data-[collapsible=icon]:hidden dark:bg-red-500" />
                                    )}
                                    {item.icon && (
                                        <item.icon
                                            className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                                                active
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
