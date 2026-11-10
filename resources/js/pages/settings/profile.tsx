import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';
import { Camera, Trash2, Upload, Check } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const getInitials = useInitials();

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm<{
            _method: string;
            name: string;
            email: string;
            avatar: File | null;
            remove_avatar: boolean;
        }>({
            _method: 'PATCH',
            name: auth.user.name,
            email: auth.user.email,
            avatar: null,
            remove_avatar: false,
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Profile picture must be less than 2MB.');
                return;
            }
            setData((prev) => ({
                ...prev,
                avatar: file,
                remove_avatar: false,
            }));
            setIsRemoving(false);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveAvatar = () => {
        setData((prev) => ({
            ...prev,
            avatar: null,
            remove_avatar: true,
        }));
        setIsRemoving(true);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(ProfileController.update.url(), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setPreviewUrl(null);
                setIsRemoving(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const currentAvatarSrc = !isRemoving
        ? previewUrl || auth.user.avatar
        : null;
    const hasAvatar = !isRemoving && (!!previewUrl || !!auth.user.avatar);

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your photo, name, and email address"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload Section */}
                    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-[#161D2A]/60">
                        <div className="group relative shrink-0">
                            <Avatar className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                {currentAvatarSrc ? (
                                    <AvatarImage
                                        src={currentAvatarSrc}
                                        alt={data.name || auth.user.name}
                                        className="object-cover"
                                    />
                                ) : null}
                                <AvatarFallback className="rounded-2xl border border-red-500/20 bg-red-500/10 text-xl font-bold text-red-600 dark:text-red-400">
                                    {getInitials(data.name || auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -right-1.5 -bottom-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-red-600 text-white shadow-md transition hover:bg-red-700 dark:border-slate-900"
                                title="Upload new photo"
                            >
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Profile Photo
                            </Label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Upload a clear medical headshot or personal
                                photo (JPG, PNG, WebP or GIF, max 2MB).
                            </p>

                            <div className="flex items-center gap-2.5 pt-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-input"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="h-8 cursor-pointer gap-1.5 rounded-xl text-xs font-semibold"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    <span>Upload Photo</span>
                                </Button>

                                {hasAvatar && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveAvatar}
                                        className="h-8 cursor-pointer gap-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Remove</span>
                                    </Button>
                                )}
                            </div>
                            {errors.avatar && (
                                <InputError
                                    message={errors.avatar}
                                    className="mt-1"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            required
                            autoComplete="name"
                            placeholder="Full name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>

                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            name="email"
                            required
                            autoComplete="username"
                            placeholder="Email address"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {mustVerifyEmail &&
                        auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="update-profile-button"
                        >
                            Save
                        </Button>

                        {recentlySuccessful && (
                            <span className="flex animate-in items-center gap-1.5 text-xs font-semibold text-emerald-600 duration-300 fade-in dark:text-emerald-400">
                                <Check className="h-3.5 w-3.5" />
                                <span>Saved successfully</span>
                            </span>
                        )}
                    </div>
                </form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
