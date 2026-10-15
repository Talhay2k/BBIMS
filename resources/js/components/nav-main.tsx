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
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-2">
                Platform Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-0.5">
                {items.map((item) => {
                    const hrefStr = typeof item.href === 'string' ? item.href : item.href.url;
                    const active = isItemActive(hrefStr);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`transition-all rounded-xl text-xs ${
                                    active
                                        ? 'bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 shadow-sm'
                                        : 'hover:bg-rose-500/5 hover:text-rose-400 text-slate-300 font-medium'
                                }`}
                            >
                                <Link href={typeof item.href === 'string' ? item.href : item.href.url} prefetch>
                                    {item.icon && (
                                        <item.icon
                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                active
                                                    ? 'text-rose-400'
                                                    : 'text-slate-500 group-hover:text-rose-400'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

