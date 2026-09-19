import type {
    Metadata,
} from 'next';

export const metadata:
    Metadata = {
    title:
        'Pricing',

    description:
        'Flexible pricing plans for coaching and training institutes.',
};

export default function PricingPage() {
    return (
        <main>
            <h1>
                Pricing
            </h1>

            <section>
                <h2>
                    Starter
                </h2>

                <p>
                    For small institutes.
                </p>
            </section>

            <section>
                <h2>
                    Professional
                </h2>

                <p>
                    For growing coaching
                    businesses.
                </p>
            </section>

            <section>
                <h2>
                    Enterprise
                </h2>

                <p>
                    For multi-branch
                    organizations.
                </p>
            </section>
        </main>
    );
}