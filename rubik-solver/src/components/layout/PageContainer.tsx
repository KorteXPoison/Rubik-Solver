import type { ReactNode } from 'react';
import './PageContainer.css';

export default function PageContainer({ children }: { children: ReactNode }) {
  return <main className="page-container">{children}</main>;
}
