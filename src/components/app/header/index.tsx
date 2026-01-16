import { Logo } from '@/components/app/logo'
import { Button } from '@/components/ui/button'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const isSignInPage = pathname === DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn

  return (
    <header className="border-b-strokeHeader absolute top-0 h-[84px] w-full border shadow-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-[100px] py-5"
      >

        <Link href={DEFAULT_PAGES.PUBLIC_ROUTES.home}>
          <Logo size="sm" />
        </Link>

        {isSignInPage ? (
          <Link href={DEFAULT_PAGES.PUBLIC_ROUTES.customerSignUp}>
            <Button
              type="button"
              size="lg"
            >
              Cadastre-se
            </Button>
          </Link>
        ) : (
          <Link href={DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn}>
            <Button
              type="button"
              size="lg"
            >
              Login
            </Button>
          </Link>
        )}

      </motion.div>
    </header>
  )
}
