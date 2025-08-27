'use client'

import { useAuth } from '@/hooks/auth'
import Loading from '@/app/[locale]/admin/Loading'

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <>
            <div className="page border-primary">
                <div className="min-h-screen bg-gray-100">
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}

export default AppLayout
