import empty from '@/assets/empty.png'
import Image from 'next/image'

export function EmptyImg() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        src={empty}
        alt="Empty"
        fetchPriority="high"
        priority
        quality={100}
      />
      <span className="text-xl font-semibold">
        Nada por aqui ainda...
      </span>
    </div>
  )
}
