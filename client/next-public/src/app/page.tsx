import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section>
        <h1>
          Coaching SaaS
        </h1>

        <p>
          A modern platform for
          coaching and training
          institutes.
        </p>

        <nav>
          <Link href="/features">
            Features
          </Link>

          {' | '}

          <Link href="/pricing">
            Pricing
          </Link>

          {' | '}

          <Link
            href="/institute/abc-coaching"
          >
            Sample Institute
          </Link>
        </nav>
      </section>
    </main>
  );
}