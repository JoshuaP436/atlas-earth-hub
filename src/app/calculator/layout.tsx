import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ROI Calculator - Atlas Earth Hub',
  description: 'Calculate precise returns on your Atlas Earth investments with verified rent rates from Atlas Reality Help Center.',
  keywords: 'Atlas Earth, ROI calculator, investment returns, virtual real estate, Atlas Bucks',
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}