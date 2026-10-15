import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="inline-flex h-8.5 items-center gap-2 rounded-xl border border-border bg-card/80 px-3 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                    aria-label={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                    {resolvedAppearance === 'dark' ? (
                        <>
                            <Sun className="h-4 w-4 text-amber-400" />
                            <span className="hidden sm:inline font-medium">Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            <span className="hidden sm:inline font-medium">Dark Mode</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
