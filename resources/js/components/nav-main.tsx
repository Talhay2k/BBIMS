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
        <SidebarGroup className="px-3 py-1">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-3">
                Platform Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const hrefStr = typeof item.href === 'string' ? item.href : item.href.url;
                    const active = isItemActive(hrefStr);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <Link
                                href={hrefStr}
                                prefetch
                                className={`group relative flex h-9.5 w-full items-center gap-3 rounded-xl px-3 text-xs transition-all ${
                                    active
                                        ? 'bg-red-50 text-red-600 font-medium dark:bg-red-500/10 dark:text-red-400 dark:font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                {active && (
                                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-red-600 dark:bg-red-500" />
                                )}
                                {item.icon && (
                                    <item.icon
                                        className={`h-4 w-4 shrink-0 transition-colors ${
                                            active
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                        }`}
                                    />
                                )}
                                <span className="truncate">{item.title}</span>
                            </Link>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

