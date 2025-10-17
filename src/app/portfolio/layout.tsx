import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Tracker - Atlas Earth Hub',
  description: 'Track your virtual real estate empire with detailed analytics, earnings projections, and optimization insights.',
  keywords: 'Atlas Earth, portfolio tracker, real estate analytics, earnings projections, investment optimization',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}