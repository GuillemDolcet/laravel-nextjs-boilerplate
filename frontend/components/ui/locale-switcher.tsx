'use client';

import {useParams} from 'next/navigation';
import {useTransition} from 'react';
import {Locale, routing, usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import { Globe } from "lucide-react";
import * as React from "react";

export default function LocaleSwitcher() {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();
    const translations = useTranslations('Idioms');
    const locale = useLocale();

    function onSelectChange(locale: string) {
        const nextLocale = locale as Locale;

        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                {pathname, params},
                {locale: nextLocale}
            );
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {routing.locales
                    .filter((cur) => cur !== locale)
                    .map((cur) => (
                        <DropdownMenuItem key={cur} onClick={() => onSelectChange(cur)} className={"cursor-pointer"}>
                            {translations(cur)}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}