import type { Metadata } from 'next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { twMerge } from 'tailwind-merge'
import '../app/styles/globals.css'
import { AuthProvider } from '@/providers/auth/auth-provider'
import ThemeProvider from '@/providers/theme/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import TanstackProvider from '@/providers/tanstack-query/tanstack-provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Valkyrie',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <TanstackProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={twMerge(
            'w-screen h-screen overflow-hidden',
            inter.className,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <TooltipProvider>
                <main>
                  {children}
                </main>
                <Toaster richColors />
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html >
    </TanstackProvider>
  )
}
