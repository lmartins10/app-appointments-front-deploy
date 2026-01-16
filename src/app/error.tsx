'use client'

import { Logo } from '@/components/app/logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Root Error Boundary:', error)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-600 to-zinc-950">
      <Card className="flex h-screen w-full flex-col items-center justify-center rounded-none p-5 drop-shadow-xl sm:rounded-sm md:size-auto md:rounded-md lg:rounded-lg">
        <nav className="absolute right-0 top-0 flex items-center justify-end gap-2 p-4">
          <Button className="gap-2" variant="outline" size="default" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar
            </Link>
          </Button>
        </nav>
        <CardHeader>
          <div className="flex flex-col items-center justify-center py-2">
            <Logo />
          </div>

          <div className="space-y-2 text-center">
            <CardTitle className="flex scroll-m-20 items-center justify-center gap-2 py-2 text-center text-lg font-bold tracking-tight first:mt-0 md:text-xl lg:text-2xl">
              Oops! Algo deu errado!
            </CardTitle>
            <CardDescription className="md:text-md text-sm font-medium text-muted-foreground lg:text-lg xl:text-lg">
              Por favor, tente novamente ou entre em contato com o suporte.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row">
          <a
            target="_blank"
            href="mailto:#"
            className="hover:bg-light-green flex h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold text-zinc-500 hover:text-primary" rel="noreferrer"
          >
            Falar com o suporte
          </a>
          <Button onClick={reset} className="text-sm" size="sm">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
