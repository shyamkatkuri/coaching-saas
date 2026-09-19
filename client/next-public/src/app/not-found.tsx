import Link from 'next/link';

export default function NotFound() {
    return (
        <main>
            <h1>
                Page not found
            </h1>

            <p>
                The requested institute
                could not be found.
            </p>

            <Link href="/">
                Return home
            </Link>
        </main>
    );
}