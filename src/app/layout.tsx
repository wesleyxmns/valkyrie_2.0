import ApplicationProviders from '@/providers/application/application-providers'
import TanstackProvider from '@/providers/tanstack-query/tanstack-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import '../app/styles/globals.css'
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
          <ApplicationProviders>
            <main>
              {children}
            </main>
          </ApplicationProviders>
        </body>
      </html >
    </TanstackProvider>
  )
}
