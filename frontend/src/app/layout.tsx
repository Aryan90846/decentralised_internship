import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aryan Certificate Portal - Web3 Internship Certificates',
  description: 'Issue and verify blockchain-based internship certificates as NFTs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
