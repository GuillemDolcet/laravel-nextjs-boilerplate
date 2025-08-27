'use client'

import LoginForm from '@/components/forms/login-form'
import {useAuth} from "@/hooks/auth";

const Login = () => {
    const {login} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/admin',
    })

    return (
        <LoginForm submitRequest={login}/>
    )
}

export default Login