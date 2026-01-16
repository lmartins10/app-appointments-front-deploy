import logoSm from '@/assets/43x43.png'
import logoMd from '@/assets/51x51.png'
import logoLg from '@/assets/57x57.png'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'

interface LogoProps extends ImageProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ size = 'lg', className, ...props }: Partial<LogoProps>) {
  const getLogoSrc = () => {
    switch (size) {
      case 'sm':
        return logoSm
      case 'md':
        return logoMd
      case 'lg':
        return logoLg
      default:
        return logoLg
    }
  }

  return (
    <Image
      {...props}
      src={getLogoSrc()}
      alt="Logo"
      fetchPriority="high"
      priority
      quality={100}
      className={cn(className, 'shrink-0')}
    />
  )
}
