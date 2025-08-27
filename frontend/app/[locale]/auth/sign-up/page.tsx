'use client'

import {useAuth} from "@/hooks/auth";
import SignUpForm from "@/components/forms/sign-up-form";

const SignUp = () => {
    const {register} = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/admin',
    })

    return (
        <SignUpForm submitRequest={register}/>
    )
}

export default SignUp