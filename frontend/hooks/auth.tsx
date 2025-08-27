import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/routing'

interface UseAuthOptions {
    middleware?: 'auth' | 'guest'
    redirectIfAuthenticated?: string
}

interface ErrorResponse {
    response: {
        status: number
        data: {
            errors?: Record<string, string[]>
            [key: string]: any
        }
    }
}

type SetErrors = (errors: Record<string, string[]>) => void
type HandleResponse = (response: any) => void

interface AuthProps {
    setErrors: SetErrors
    [key: string]: any
}

interface ForgotPasswordProps {
    setErrors: SetErrors
    email: string
    handleResponse: HandleResponse
}

interface ResetPasswordProps extends AuthProps {
    password: string
    password_confirmation: string
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthOptions = {}) => {
    const router = useRouter()
    const params = useParams<{ token?: string }>()

    const { data: user, error, mutate } = useSWR('/api/user', async () => {
        try {
            const res = await axios.get('/api/user')
            return res.data
        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 409) throw error
            router.push('/admin')
        }
    })

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: AuthProps) => {
        await csrf()
        setErrors({})
        try {
            await axios.post('/register', props)
            await mutate()
        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors ?? {})
        }
    }

    const login = async ({ setErrors, ...props }: AuthProps) => {
        await csrf()
        setErrors({})
        try {
            await axios.post('/login', props)
            await mutate()
        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors ?? {})
        }
    }

    const loginWithGoogle = async ({ setErrors, ...props }: AuthProps) => {
        await csrf()
        setErrors({})
        try {
            await axios.post('/login/google', props)
            await mutate()
        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors ?? {})
        }
    }

    const forgotPassword = async ({ setErrors, email, setStatus }: ForgotPasswordProps) => {
        await csrf()
        setErrors({})
        try {
            await axios.post('/forgot-password', { email })
                .then(response => setStatus(response.data.status))

        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors ?? {})
        }
    }

    const resetPassword = async ({ setErrors, ...props }: ResetPasswordProps) => {
        await csrf()
        setErrors({})
        try {
            const response = await axios.post('/reset-password', { token: params.token, ...props })
            router.push('/auth/login?reset=' + btoa(response.data.status))
        } catch (err) {
            const error = err as ErrorResponse
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors ?? {})
        }
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate(undefined))
        }
        router.push('/auth/login')
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated)
        }

        if (middleware === 'auth' && (user && !user.email_verified_at)) {
            router.push('/auth/verify-email')
        }

        if (
            window.location.pathname.includes('/auth/verify-email')
            && user?.email_verified_at
            && redirectIfAuthenticated
        ) {
            router.push(redirectIfAuthenticated)
        }

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        loginWithGoogle,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
