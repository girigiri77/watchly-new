import type { ReactNode } from 'react'

export const metadata = {
  title: 'Absolute Cinema Admin',
  description: 'Admin dashboard for managing OTT movie content',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
