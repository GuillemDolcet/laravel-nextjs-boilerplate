'use client'

import {useAuth} from "@/hooks/auth";
import ForgotPasswordForm from "@/components/forms/forgot-password-form";

const ForgotPassword = () => {
    const {forgotPassword} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/admin',
    })

    return (
        <ForgotPasswordForm submitRequest={forgotPassword}/>
    )
}

export default ForgotPassword