'use client'

import { Header } from '@/components/app/header'
import CustomerSignUpForm from './_components/form'

export default function CustomerSignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background-app">
      <Header />
      <CustomerSignUpForm />
    </main>
  )
}
