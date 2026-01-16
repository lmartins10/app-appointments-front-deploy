import { PanelRightOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible absolute -right-0.5 top-0 z-20 lg:visible">
      <Button
        onClick={() => setIsOpen?.()}
        className="size-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <PanelRightOpen
          className={cn(
            'size-4 transition-transform ease-in-out duration-700',
            isOpen === false ? 'rotate-180' : 'rotate-0',
          )}
        />
      </Button>
    </div>
  )
}
