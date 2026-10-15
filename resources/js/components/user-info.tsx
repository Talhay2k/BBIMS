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
            <Avatar className="h-8.5 w-8.5 overflow-hidden rounded-xl border border-slate-200 dark:border-[#222F44] shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/20 text-xs">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                <span className="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {showEmail ? user.email : 'Allied Hospital Faisalabad'}
                </span>
            </div>
        </>
    );
}
