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
import {useLocale, useTranslations} from "next-intl";
import {useState} from 'react';
import React from 'react';

interface SubmitPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    locale: string;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

interface SignUpFormProps {
    className?: string;
    submitRequest: (payload: SubmitPayload) => void;
}

type ErrorMessage = {
    code?: string;
    message?: string;
};

export default function SignUpForm({submitRequest, className, ...props}: SignUpFormProps) {
    const translations = useTranslations('Auth');

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<Record<string, ErrorMessage[]>>({})
    const locale = useLocale();

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: Record<string, (string | { code?: string; message?: string })[]> = {};

        if (!name.trim()) {
            newErrors.name = [{ code: 'required_name' }];
        }

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

        submitRequest({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            locale,
            setErrors,
        });
    };


    return (
        <form onSubmit={submitForm} className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{translations('create_account')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="name">{translations('name')}</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder={translations('placeholder_name')}
                                value={name}
                                errors={errors.name}
                                set={setName}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">{translations('email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={translations('placeholder_email')}
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
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                placeholder={translations('placeholder_password')}
                                errors={errors.password}
                                set={setPassword}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">{translations('password')}</Label>
                            </div>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder={translations('placeholder_confirm_password')}
                                value={passwordConfirmation}
                                errors={errors.password_confirmation}
                                set={setPasswordConfirmation}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer">
                            {translations('sign_up')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}