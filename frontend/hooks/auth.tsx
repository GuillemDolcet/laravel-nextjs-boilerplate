import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

type ErrorMessage = {
    code?: string;
    message?: string;
};

type SetErrors = React.Dispatch<React.SetStateAction<Record<string, ErrorMessage[]>>>;

type SetStatus = React.Dispatch<React.SetStateAction<string | null>>;

interface LoginProps {
    email: string;
    password: string;
    remember: boolean;
    setErrors: SetErrors;
    setStatus: SetStatus;
}

interface RegisterProps {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    locale: string;
    setErrors: SetErrors;
    setStatus: SetStatus;
}

interface ForgotPasswordProps {
    email: string;
    locale: string;
    setErrors: SetErrors;
    setStatus: SetStatus;
}

interface ResendEmailVerification {
    locale: string;
    setErrors: SetErrors;
    setStatus: SetStatus;
}

interface ResetPasswordProps {
    token?: string;
    email: string;
    password: string;
    password_confirmation: string;
    setErrors: SetErrors;
    setStatus: SetStatus;
}

interface UseAuthOptions {
    middleware?: 'auth' | 'guest';
    redirectIfAuthenticated?: string;
}

interface ErrorResponse {
    response: {
        status: number;
        data: {
            errors?: Record<string, ErrorMessage[]>;
        };
    };
}

interface User {
    name: string;
    email: string;
    email_verified_at: string | null;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthOptions = {}) => {
    const router = useRouter();
    const params = useParams<{ token?: string }>();

    const { data: user, error, mutate } = useSWR<User | null>(
        '/api/user',
        async (): Promise<User | null> => {
            try {
                const res = await axios.get('/api/user');
                return res.data as User;
            } catch (err: unknown) {
                const error = err as ErrorResponse;
                if (error.response?.status === 409) {
                    router.push('/admin');

                    return null;
                }
                throw error;
            }
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, ...props }: RegisterProps) => {
        await csrf();
        setErrors({});
        try {
            await axios.post('/register', props);
            await mutate();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                throw error;
            }
            setErrors(error.response.data.errors ?? {});
        }
    };

    const login = async ({ setErrors, ...props }: LoginProps) => {
        await csrf();
        setErrors({});
        try {
            await axios.post('/login', props);
            await mutate();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                throw error;
            }
            setErrors(error.response.data.errors ?? {});
        }
    };

    const forgotPassword = async ({ setErrors, email, setStatus, locale }: ForgotPasswordProps) => {
        await csrf();
        setErrors({});
        try {
            const response = await axios.post('/forgot-password', { email, locale });
            setStatus(response.data.status);
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                throw error;
            }
            setErrors(error.response.data.errors ?? {});
        }
    };

    const resetPassword = async ({ setErrors, ...props }: ResetPasswordProps) => {
        await csrf();
        setErrors({});
        try {
            const response = await axios.post('/reset-password', { token: params.token, ...props });
            if (response.data?.status) { // Verificación opcional
                router.push('/auth/login?reset=' + btoa(response.data.status));
            }
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                throw error;
            }
            setErrors(error.response.data.errors ?? {});
        }
    };

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate(undefined));
        }
        router.push('/auth/login');
    };

    const resendEmailVerification = ({ setStatus, ...props }: ResendEmailVerification) => {
        axios
            .post('/email/verification-notification', {
                ...props
            })
            .then(response => setStatus(response.data.status));
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }

        if (middleware === 'auth' && user && !user.email_verified_at) {
            router.push('/auth/verify-email');
        }

        if (
            window.location.pathname.includes('/auth/verify-email') &&
            user?.email_verified_at &&
            redirectIfAuthenticated
        ) {
            router.push(redirectIfAuthenticated);
        }

        if (middleware === 'auth' && error) {
            logout();
        }
    }, [user, error, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
};