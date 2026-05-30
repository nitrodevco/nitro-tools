import type { ReactNode } from 'react';

interface FormRowProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}

const colClasses: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

export function FormRow({ children, cols = 2 }: FormRowProps) {
  return (
    <div className={`grid ${colClasses[cols]} gap-3`}>
      {children}
    </div>
  );
}
