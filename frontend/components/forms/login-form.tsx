'use client';

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Input from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useTranslations} from "next-intl";
import {useEffect, useState} from 'react';
import React from 'react';
import {Checkbox} from "@/components/ui/checkbox";
import {Link} from '@/i18n/routing';
import { useSearchParams } from "next/navigation";
import Status from "@/components/ui/status";
import {ErrorMessageType, StatusType} from "@/types/common";
import {AuthFormProps} from "@/types/auth";

export default function LoginForm({auth, className, ...props}: AuthFormProps) {
    const translations = useTranslations('auth');
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRemember, setShouldRemember] = useState(false);
    const [errors, setErrors] = useState<Record<string, ErrorMessageType[]>>({});
    const [status, setStatus] = useState<StatusType | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = auth;

    useEffect(() => {
        const resetParam = searchParams.get('reset');
        if (!resetParam) return;

        setStatus({
            success: true,
            code: atob(resetParam)
        });

        const url = new URL(window.location.href);
        url.searchParams.delete('reset');
        window.history.replaceState({}, '', url.toString());

        const timer = window.setTimeout(() => {
            setStatus(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(null);

        const newErrors: Record<string, ErrorMessageType[]> = {};

        if (!email.trim()) {
            newErrors.email = [{ code: 'required_email' }];
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = [{ code: 'invalid_email' }];
        }

        if (password.length < 8) {
            newErrors.password = [{ code: 'password_min_8' }];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            await login({
                email,
                password,
                remember: shouldRemember,
                setErrors,
                setStatus,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submitForm} className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{translations('welcome_back')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Status status={status} />
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" className="w-full cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                {translations('login_google')}
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                {translations('or_continue_with')}
                            </span>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">{translations('email')}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={ translations('placeholder_email') }
                                    value={email}
                                    errors={errors.email}
                                    set={setEmail}
                                    setErrors={setErrors}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{translations('password')}</Label>
                                    <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                                        {translations('forgot_your_password')}
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    errors={errors.password}
                                    set={setPassword}
                                    setErrors={setErrors}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember_me"
                                    name="remember_me"
                                    checked={shouldRemember}
                                    onCheckedChange={(checked: boolean) =>
                                        setShouldRemember(checked)
                                    }
                                />
                                <Label htmlFor="remember_me">{ translations('remember_me') }</Label>
                            </div>
                            <Button type="submit" className="w-full cursor-pointer" isLoading={loading}>
                                {translations('login')}
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            {translations('dont_have_an_account')}
                            <Link href="/auth/sign-up" className="underline underline-offset-4 ms-1">
                                {translations('sign_up')}
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}