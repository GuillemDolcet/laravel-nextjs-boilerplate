'use client'

import { useAuth } from '@/hooks/auth'
import React, { useState } from 'react'
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useTranslations} from "next-intl";
import {CheckCircle2Icon} from "lucide-react";
import {Alert, AlertTitle} from "@/components/ui/alert";

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/admin',
    })

    const translations = useTranslations('Auth');

    const [status, setStatus] = useState(null)

    return (
        <>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{translations('verify_email')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {status === 'verification-link-sent' && (
                            <div className="grid gap-3">
                                <Alert variant="success">
                                    <CheckCircle2Icon />
                                    <AlertTitle>{translations('success_resend_verification_email')}</AlertTitle>
                                </Alert>
                            </div>
                        )}
                        <div className="grid gap-3">
                            <div>{translations('thanks_for_signing_up')}</div>
                            <div>{translations('before_getting_started_verify_email')}</div>
                            <div>{translations('didnt_receive_email')}</div>
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={() => resendEmailVerification({ setStatus })} className="cursor-pointer">
                                {translations('resend_verification_email')}
                            </Button>
                            <button onClick={logout} className="underline text-sm text-gray-600 hover:text-gray-900">
                                {translations('logout')}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Page