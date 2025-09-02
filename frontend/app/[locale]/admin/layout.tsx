"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import Loading from "@/app/[locale]/admin/Loading";

type AppLayoutProps = {
    children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    const { user, logout } = useAuth({ middleware: "auth" });

    if (!user || !user.email_verified_at) {
        return <Loading />;
    }

    return (
        <div className="page border-primary">
            <div className="min-h-screen bg-gray-100">
                <main>{children}</main>
            </div>
        </div>
    );
};

export default AppLayout;
