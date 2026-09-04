import type { ReactNode } from 'react'
import { Header } from './Header'

export function Layout({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className="page">
      <Header />
      <main className={`container main${narrow ? ' main-narrow' : ''}`}>{children}</main>
    </div>
  )
}
