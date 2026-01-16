'use client'

import { Header } from '@/components/app/header'
import CustomerSignInForm from './_components/form'

export default function CustomerSignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background-app">
      <Header />
      <CustomerSignInForm />
    </main>
  )
}
