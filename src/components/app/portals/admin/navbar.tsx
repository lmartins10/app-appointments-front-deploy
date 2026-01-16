'use client'

import { SheetMenu } from './sheet-menu'

interface NavbarProps {
  title: string
  description: string
}

export function Navbar({ title, description }: NavbarProps) {
  return (
    <header className="b-strokeHeader sticky top-0 z-10 w-full border-b-2 bg-background">
      <div className="mx-8 flex h-[98px] flex-row items-center justify-between">
        <div className="flex flex-col space-y-[6px]">
          {/* <SheetMenu /> */}
          <h1 className="text-[28px] font-semibold">{title}</h1>
          <h1 className="text-sm font-medium">{description}</h1>
        </div>

        <div className="flex shrink-0">
          <SheetMenu />
        </div>
      </div>
    </header>
  )
}
