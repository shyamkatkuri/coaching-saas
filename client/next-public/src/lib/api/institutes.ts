export interface PublicInstitute {
    name: string;
    slug: string;
    country: string;
    timezone: string;
}

const API_URL =
    process.env.CORE_API_URL;

export async function getInstitute(
    slug: string,
): Promise<
    PublicInstitute | null
> {
    const response =
        await fetch(
            `${API_URL}/public/institutes/${encodeURIComponent(
                slug,
            )}`,
            {
                next: {
                    revalidate: 300,
                },
            },
        );

    if (
        response.status === 404
    ) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Failed to fetch institute: ${response.status}`,
        );
    }

    return response.json();
}