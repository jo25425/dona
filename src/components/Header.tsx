import {useTranslations} from "next-intl";
import Link from "next/link";
import LocaleSwitcher from "@/components/LanguageSwitcher";
import {Locale} from "@/config";

export default function Header({
                                   locale,
                               }: {
    locale: Locale;
}) {
    const t = useTranslations("landing.header");

    return (
        <header className="mb-3 flex justify-between border-b border-sky-900/75 pb-2 text-sm">
            <nav>
                <ul className="flex gap-4">
                    <li>
                        <Link
                            href="/"
                            className="font-medium text-sky-300"
                        >
                            {t("title")}
                        </Link>
                    </li>
                </ul>
            </nav>
            <LocaleSwitcher locale={locale}/>
        </header>
    );
}