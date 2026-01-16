import appointments from '@/assets/icons/appointments.png'
import customers from '@/assets/icons/customers.png'
import logs from '@/assets/icons/logs.png'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'

interface IconsProps extends ImageProps {
  type?: 'appointments' | 'customers' | 'logs'
}

export function Icons({ type, className, ...props }: Partial<IconsProps>) {
  const getIconsSrc = () => {
    switch (type) {
      case 'appointments':
        return appointments
      case 'customers':
        return customers
      case 'logs':
        return logs
      default:
        return ''
    }
  }

  return (
    <Image
      {...props}
      src={getIconsSrc()}
      alt="Icons"
      fetchPriority="high"
      priority
      quality={100}
      className={cn(className, 'w-fit shrink-0')}
    />
  )
}
