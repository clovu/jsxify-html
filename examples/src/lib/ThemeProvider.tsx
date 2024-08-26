'use client'
import { Theme } from '@radix-ui/themes'
import React from 'react'

export function ThemeProvider({ children }: React.PropsWithChildren): JSX.Element {
  return <Theme>{children}</Theme>
}
