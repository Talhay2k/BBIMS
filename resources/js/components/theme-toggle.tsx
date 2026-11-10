import { useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    variant?: 'pill' | 'icon' | 'sidebar';
    className?: string;
}

export function ThemeToggle({ variant = 'pill', className }: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const isDark = resolvedAppearance === 'dark';
    const label = isDark ? 'Light Mode' : 'Dark Mode';
    const tooltipText = `Switch to ${label}`;

    if (variant === 'icon') {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={cn(
                            'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-[#161D2A] dark:text-slate-200 dark:hover:bg-[#1E293B]',
                            className,
                        )}
                        aria-label={tooltipText}
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-slate-700" />
                        )}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    if (variant === 'sidebar') {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={cn(
                            'flex h-8.5 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 transition-all group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0 hover:bg-slate-100 dark:border-slate-800/80 dark:bg-[#131926] dark:text-slate-300 dark:hover:bg-[#1A2234]',
                            className,
                        )}
                        aria-label={tooltipText}
                    >
                        <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
                            {isDark ? (
                                <Sun className="h-4 w-4 shrink-0 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300" />
                            )}
                            <span className="font-medium group-data-[collapsible=icon]:hidden">
                                {isDark ? 'Light Theme' : 'Dark Theme'}
                            </span>
                        </div>
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase group-data-[collapsible=icon]:hidden dark:bg-[#1E293B] dark:text-slate-400">
                            {resolvedAppearance}
                        </span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    // Default 'pill' variant
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={cn(
                'flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0B0F17] dark:text-slate-200 dark:hover:bg-[#1E293B]',
                className,
            )}
            title={tooltipText}
            aria-label={tooltipText}
        >
            {isDark ? (
                <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="hidden font-medium sm:inline">
                        Light Mode
                    </span>
                </>
            ) : (
                <>
                    <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <span className="hidden font-medium sm:inline">
                        Dark Mode
                    </span>
                </>
            )}
        </button>
    );
}
