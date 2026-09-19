import type {
    MetadataRoute,
} from 'next';

export default function sitemap():
    MetadataRoute.Sitemap {
    const baseUrl =
        'http://localhost:4202';

    return [
        {
            url:
                `${baseUrl}/`,

            changeFrequency:
                'weekly',

            priority:
                1,
        },

        {
            url:
                `${baseUrl}/features`,

            changeFrequency:
                'monthly',

            priority:
                0.8,
        },

        {
            url:
                `${baseUrl}/pricing`,

            changeFrequency:
                'monthly',

            priority:
                0.8,
        },

        {
            url:
                `${baseUrl}/institute/abc-coaching`,

            changeFrequency:
                'daily',

            priority:
                0.9,
        },
    ];
}