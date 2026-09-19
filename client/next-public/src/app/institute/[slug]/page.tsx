import type {
    Metadata,
} from 'next';

import {
    notFound,
} from 'next/navigation';

import {
    getInstitute,
} from '@/lib/api/institutes';

interface PageProps {
    params:
    Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const {
        slug,
    } =
        await params;

    const institute =
        await getInstitute(
            slug,
        );

    if (!institute) {
        return {
            title:
                'Institute Not Found',
        };
    }

    return {
        title:
            institute.name,

        description:
            `${institute.name} coaching and training information.`,

        openGraph: {
            title:
                institute.name,

            description:
                `${institute.name} coaching institute.`,
        },
    };
}

export default async function InstitutePage({
    params,
}: PageProps) {
    const {
        slug,
    } =
        await params;

    const institute =
        await getInstitute(
            slug,
        );

    if (!institute) {
        notFound();
    }

    return (
        <main>
            <h1>
                {institute.name}
            </h1>

            <p>
                Country:
                {' '}
                {institute.country}
            </p>

            <p>
                Timezone:
                {' '}
                {institute.timezone}
            </p>

            <p>
                Institute slug:
                {' '}
                {institute.slug}
            </p>
        </main>
    );
}