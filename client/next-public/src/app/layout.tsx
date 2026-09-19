import type {
  Metadata,
} from 'next';

import './globals.css';

export const metadata:
  Metadata = {
  title: {
    default:
      'Coaching SaaS',

    template:
      '%s | Coaching SaaS',
  },

  description:
    'Discover coaching institutes, courses and training programs.',

  metadataBase:
    new URL(
      'http://localhost:4202',
    ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
  React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}