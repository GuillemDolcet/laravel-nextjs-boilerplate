"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import React from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { useAuth } from "@/hooks/auth";

type ErrorMessage = {
    code?: string;
    message?: string;
};

interface ForgotPasswordFormProps {
    className?: string;
    auth: ReturnType<typeof useAuth>;
}

export default function ForgotPasswordForm({
                                               className,
                                               auth,
                                               ...props
                                           }: ForgotPasswordFormProps) {
    const translations = useTranslations("Auth");

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Record<string, ErrorMessage[]>>({});
    const [status, setStatus] = useState<string | null>(null);

    const { forgotPassword } = auth;

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(null);

        const newErrors: Record<string, ErrorMessage[]> = {};
        if (!email.trim()) {
            newErrors.email = [{ code: "required_email" }];
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = [{ code: "invalid_email" }];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await forgotPassword({
            email,
            setErrors,
            setStatus,
        });
    };

    return (
        <form
            onSubmit={submitForm}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {translations("reset_password")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {status === 'We have emailed your password reset link.' && (
                            <div className="grid gap-3">
                                <Alert variant="success">
                                    <CheckCircle2Icon />
                                    <AlertTitle>{translations('we_have_emailed_your_password_reset_link')}</AlertTitle>
                                </Alert>
                            </div>
                        )}
                        <div className="grid gap-3">
                            <Label htmlFor="email">{translations("email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={translations("placeholder_email")}
                                value={email}
                                errors={errors.email}
                                set={setEmail}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer">
                            {translations("send_reset_link")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
