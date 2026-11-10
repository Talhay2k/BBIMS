import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-[#222F44]">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-slate-900 dark:text-slate-100">
                    {user.name}
                </span>
                <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {showEmail ? user.email : 'Allied Hospital Faisalabad'}
                </span>
            </div>
        </>
    );
}
