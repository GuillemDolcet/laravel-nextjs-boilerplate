"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useLocale, useTranslations} from "next-intl";
import { useState } from "react";
import React from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, CircleAlert } from "lucide-react";
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

interface ForgotPasswordFormProps {
    className?: string;
    auth: ReturnType<typeof useAuth>;
}

export default function ForgotPasswordForm({
                                               className,
                                               auth,
                                               ...props
                                           }: ForgotPasswordFormProps) {
    const translations = useTranslations();
    const locale = useLocale();

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Record<string, ErrorMessageType[]>>({});
    const [status, setStatus] = useState<StatusType | null>(null);
    const [loading, setLoading] = useState(false);

    const { forgotPassword } = auth;

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(null);
        setLoading(true);

        const newErrors: Record<string, ErrorMessageType[]> = {};
        if (!email.trim()) {
            newErrors.email = [{ code: "email_required" }];
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = [{ code: "email_invalid" }];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await forgotPassword({
                email,
                locale,
                setErrors,
                setStatus,
            });
        } finally {
            setLoading(false);
        }
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
                        {translations("auth.reset_password")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Status status={status} />
                        <div className="grid gap-3">
                            <Label htmlFor="email">{translations("auth.email")}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={translations("auth.placeholder_email")}
                                value={email}
                                errors={errors.email}
                                set={setEmail}
                                setErrors={setErrors}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" isLoading={loading}>
                            {translations("auth.send_reset_link")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
