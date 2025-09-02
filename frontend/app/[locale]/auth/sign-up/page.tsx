"use client";

import { useAuth } from "@/hooks/auth";
import SignUpForm from "@/components/forms/sign-up-form";

const SignUp = () => {
    const auth = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/admin",
    });

    return <SignUpForm auth={auth} />;
};

export default SignUp;
