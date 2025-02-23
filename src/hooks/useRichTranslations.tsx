import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export function useRichTranslations(namespace: string) {
    const translate = useTranslations(namespace);
    const globalTranslate = useTranslations("urls"); // Fetch URLs from the global "urls" namespace

    // Function to replace <link>...</link> with an <a> tag, using a URL key dynamically
    const linkHandler = (urlKey: string, newTab: boolean = true) => {
        const url = globalTranslate(urlKey); // Fetch URL from global translation

        const LinkComponent = (text: ReactNode) => (
            <a
                href={url}
                target={newTab ? "_blank" : "_self"}
                rel={newTab ? "noopener noreferrer" : undefined}
            >
                {text}
            </a>
        );

        Object.defineProperty(LinkComponent, "name", { value: `Link(${urlKey})` }); // Set display name
        return LinkComponent;
    };

    return {
        [namespace]: {
            t: translate,
            rich: (key: string, urlKeys?: Record<string, string>) =>
                translate.rich(key, {
                    ...(urlKeys
                        ? Object.fromEntries(
                            Object.entries(urlKeys).map(([placeholder, urlKey]) => [
                                placeholder,
                                linkHandler(urlKey, true),
                            ])
                        )
                        : {}),
                    br: () => <br />,
                    p: (txt) => <p>{txt}</p>,
                    b: (content) => <b>{content}</b>,
                    i: (content) => <i>{content}</i>,
                    em: (content) => <em>{content}</em>,
                    strong: (content) => <strong>{content}</strong>,
                    email: (address) => <a href={"mailto:" + address}>{address}</a>,
                }),
            link: linkHandler, // Standalone function for direct use
        },
    }[namespace] ?? { t: () => "", rich: () => "", link: () => "" }; // Return a default object
}
