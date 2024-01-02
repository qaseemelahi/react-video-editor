'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <DndProvider backend={HTML5Backend}>
        {children}
        </DndProvider>
        </body>
    </html>
  )
}
