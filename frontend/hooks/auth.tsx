import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

type ErrorMessageType = {
    code?: string;
    message?: string;
};

type StatusType = {
    success: boolean;
    code: string;
    message?: string;
};

type SetErrors = React.Dispatch<React.SetStateAction<Record<string, ErrorMessageType[]>>>;

type SetStatus = React.Dispatch<React.SetStateAction<StatusType | null>>;

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
            code?: string;
            errors?: Record<string, ErrorMessageType[]>;
            message?: string;
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
                    router.push('/dashboard');

                    return null;
                }
                throw error;
            }
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, setStatus, ...props }: RegisterProps) => {
        setErrors({});
        try {
            await csrf();
            await axios.post('/register', props);
            await mutate();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                setStatus({
                    success: false,
                    code: error.response?.data?.code ?? 'server_error',
                });
            } else {
                setErrors(error.response.data.errors ?? {});
            }
        }
    };

    const login = async ({ setErrors, setStatus, ...props }: LoginProps) => {
        setErrors({});
        try {
            await csrf();
            await axios.post('/login', props);
            await mutate();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                setStatus({
                    success: false,
                    code: error.response?.data?.code ?? 'server_error',
                });
            } else {
                setErrors(error.response.data.errors ?? {});
            }
        }
    };

    const forgotPassword = async ({ setErrors, email, setStatus, locale }: ForgotPasswordProps) => {
        setErrors({});
        try {
            await csrf();
            const response = await axios.post('/forgot-password', { email, locale });
            setStatus({
                success: true,
                code: response.data.code,
            });
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                setStatus({
                    success: false,
                    code: error.response?.data?.code ?? 'server_error',
                });
            } else {
                setErrors(error.response.data.errors ?? {});
            }
        }
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }: ResetPasswordProps) => {
        setErrors({});
        try {
            await csrf();
            const response = await axios.post('/reset-password', { token: params.token, ...props });
            if (response.data?.status) {
                router.push('/auth/login?reset=' + btoa(response.data.status));
            }
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            if (error.response?.status !== 422) {
                setStatus({
                    success: false,
                    code: error.response?.data?.code ?? 'server_error',
                });
            } else {
                setErrors(error.response.data.errors ?? {});
            }
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
            .then(response => setStatus({
                success: true,
                code: response.data.code,
            }));
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