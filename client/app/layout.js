import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkillSwap | Premium Talent Exchange',
  description: 'A luxurious Next.js frontend for the SkillSwap talent marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
