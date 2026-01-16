'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRoundCog } from 'lucide-react'

interface PanelCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function PanelCard({ icon, title, description }: PanelCardProps) {
  return (
    <Card className="w-[300px] rounded bg-secondary shadow-md hover:bg-secondary/50 md:w-[350px]">
      <CardHeader className="flex flex-col items-center justify-center gap-1 text-center">
        {icon}
        <CardTitle className="text-lg font-bold tracking-tight first:mt-0 md:text-xl xl:text-2xl">
          {title}
        </CardTitle>
        <CardDescription className="pt-2 text-center">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
