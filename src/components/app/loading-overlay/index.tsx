'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface LoadingOverlayProps {
  isPending?: boolean
  message?: string
}

export function LoadingOverlay({ isPending = false, message }: LoadingOverlayProps) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isPending) {
      timeoutId = setTimeout(() => {
        setShowLoader(true)
      }, 300)
    } else {
      timeoutId = setTimeout(() => {
        setShowLoader(false)
      }, 0)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isPending])

  const displayMessage = message || 'Carregando...'

  return (
    <>
      {showLoader
        ? createPortal(
          <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-scroll scroll-smooth bg-black/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="size-10 animate-spin text-secondary" />
              <span className="animate-pulse text-lg font-bold text-secondary">
                {displayMessage}
              </span>
            </div>
          </div>,
          document.body,
          )
        : null}
    </>
  )
}
