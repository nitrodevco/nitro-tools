import type { ReactNode } from 'react';

interface FormRowProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}

export function FormRow({ children, cols = 2 }: FormRowProps) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[cols];
  return <div className={`grid ${colClass} gap-3`}>{children}</div>;
}
