'use client'
import { Logo } from '@/components/app/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { motion } from 'framer-motion'
import { UserRoundCog, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { PanelCard } from './panel-card'

export default function Home() {
  return (
    <main className="bg-background-app">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-screen w-full items-center justify-center"
      >
        <Card className="gap-4 rounded-lg py-8">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="flex flex-col items-center justify-center gap-4 text-2xl font-semibold">
              <Logo />
              Portais de agendamentos
            </CardTitle>

            <CardDescription className="md:text-md text-sm font-medium text-muted-foreground xl:text-lg">
              Selecione o portal que você deseja acessar:
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <Link href={`${DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn}`}>
              <PanelCard
                icon={<UsersRound className="size-10" />}
                title="Portal do Cliente"
                description="Acesse sua conta para gerenciar seus agendamentos e perfil."
              />
            </Link>

            <Link href={`${DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn}`}>
              <PanelCard
                icon={<UserRoundCog className="size-10" />}
                title="Portal do Administrador"
                description="Acesse sua conta para gerenciar usuários e configurações."
              />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
