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
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-6 transition-colors ease-linear dark:border-slate-800 dark:bg-[#0B0F17]">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="inline-flex h-8.5 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-[#161D2A] dark:text-slate-200 dark:hover:bg-[#1E293B]"
                    title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                    aria-label={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                    {resolvedAppearance === 'dark' ? (
                        <>
                            <Sun className="h-4 w-4 text-amber-400" />
                            <span className="hidden font-medium sm:inline">
                                Light Mode
                            </span>
                        </>
                    ) : (
                        <>
                            <Moon className="h-4 w-4 text-slate-700" />
                            <span className="hidden font-medium sm:inline">
                                Dark Mode
                            </span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
