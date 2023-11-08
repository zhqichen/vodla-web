import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '@/libs/AntdRegistry';
import { ConfigProvider } from 'antd';
import GlobalLayout from '@/components/global-layout';

import './globals.css'
import theme from '@/theme/themeConfig';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vodla',
  description: 'Generated by vodla',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <GlobalLayout>{children}</GlobalLayout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
