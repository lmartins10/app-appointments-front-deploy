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

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-600 to-zinc-950">
      <Card className="flex h-screen w-full flex-col items-center justify-center rounded-none p-5 drop-shadow-xl sm:rounded-sm md:size-auto md:rounded-md lg:rounded-lg">
        <CardHeader>
          <div className="flex flex-col items-center justify-center py-2">
            <Logo />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="scroll-m-20 py-2 text-center text-lg font-bold tracking-tight first:mt-0 md:text-xl lg:text-2xl">
              Oops! 404 - Página não encontrada
            </CardTitle>
            <CardDescription className="md:text-md text-sm font-medium text-muted-foreground lg:text-lg xl:text-lg">
              A página que você está procurando não existe ou foi movida.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-5 md:flex-row">
          <Button asChild>
            <Link href="/" className="flex gap-2">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
