import Logo from "@/components/ui/logo";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import ThemeSwitcher from "@/components/ui/theme-switcher";

export const metadata = {
    title: 'Laravel',
}

const Layout = ({children}) => {
    return (
        <>
            <div className="relative min-h-screen">
                <div className="absolute top-0 right-0 p-3 flex gap-2">
                    <LocaleSwitcher/>
                    <ThemeSwitcher />
                </div>
                <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <a href="#" className="flex items-center gap-2 self-center font-medium">
                            <Logo />
                        </a>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout