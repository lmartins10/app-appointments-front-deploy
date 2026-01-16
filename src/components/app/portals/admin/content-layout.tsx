import { Navbar } from './navbar'

interface ContentLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AdminContentLayout({
  title,
  description,
  children,
}: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar title={title} description={description} />
      <div className="p-4 sm:p-8">{children}</div>
    </div>
  )
}
