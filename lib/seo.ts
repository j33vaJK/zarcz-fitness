import { Metadata } from 'next';

import { env } from '@/config/env';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
}

export function constructMetadata({
    title = 'Frontend Template',
    description = 'A Production-ready Next.js frontend template',
    image = '/thumbnail.png',
    icons = '/favicon.ico',
    noIndex = false,
}: SeoProps = {}): Metadata {
    return {
        title: {
            default: title,
            template: `%s | ${title}`,
        },
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@twitterhandle',
        },
        icons,
        metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
