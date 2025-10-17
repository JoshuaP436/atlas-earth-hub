import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strategy Planner - Atlas Earth Hub',
  description: 'Plan optimal investment strategies with boost optimization, badge calculations, and long-term portfolio growth analysis.',
  keywords: 'Atlas Earth, strategy planner, investment strategy, boost optimization, badge investment, portfolio planning',
};

export default function StrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}