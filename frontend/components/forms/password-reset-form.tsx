'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {useEffect, useState} from 'react';
import React from 'react';
import {Alert, AlertTitle} from "@/components/ui/alert";
import {CheckCircle2Icon, CircleAlert} from "lucide-react";
import { useSearchParams } from 'next/navigation'
import { useAuth } from "@/hooks/auth";
import Status from "@/components/ui/status";

type ErrorMessageType = {
    code?: string;
    message?: string;
};

type StatusType = {
    success: boolean;
    code: string;
    message?: string;
};

interface PasswordResetFormProps {
    className?: string;
    auth: ReturnType<typeof useAuth>;
}

export default function PasswordResetForm({ auth, className, ...props }: PasswordResetFormProps) {
    const translations = useTranslations();
    const searchParams = useSearchParams()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, ErrorMessageType[]>>({});
    const [status, setStatus] = useState<StatusType | null>(null);
    const [loading, setLoading] = useState(false);

    const { resetPassword } = auth;

    useEffect(() => {
        setEmail(searchParams.get('email') as string);
    }, [searchParams.get('email')]);

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        // Reseteamos estados antes de la nueva petición
        setErrors({});
        setStatus(null);
        setLoading(true);

        const newErrors: Record<string, ErrorMessageType[]> = {};

        // Validaciones del lado del cliente
        if (!email.trim()) {
            newErrors.email = [{ code: 'required_email' }];
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = [{ code: 'invalid_email' }];
        }

        if (password.length < 8) {
            newErrors.password = [{ code: 'password_min_8' }];
        }

        if (password !== passwordConfirmation) {
            newErrors.password_confirmation = [{ code: 'password_confirmed' }];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await resetPassword({
                email,
                password,
                password_confirmation: passwordConfirmation,
                setErrors,
                setStatus,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitForm} className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{translations('auth.reset_password')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Status status={status} />
                        <div className="grid gap-3">
                            <Label htmlFor="email">{translations('auth.email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={translations('auth.placeholder_email')}
                                value={email}
                                errors={errors.email}
                                set={setEmail}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">{translations('auth.password')}</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                placeholder={translations('auth.placeholder_password')}
                                errors={errors.password}
                                set={setPassword}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">{translations('auth.password_confirmation')}</Label>
                            </div>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder={translations('auth.placeholder_confirm_password')}
                                value={passwordConfirmation}
                                errors={errors.password_confirmation}
                                set={setPasswordConfirmation}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" isLoading={loading}>
                            {translations('auth.reset_password')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}