"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          if (error?.response?.status === 401) return false
          if (error?.response?.status === 403) return false
          return failureCount < 2
        },
      },
    },
  }))

  return (
    
        <QueryClientProvider client={queryClient}>
          {children}

          {/* Toast global — fonctionne sur toutes les pages */}
          <Toaster
            position="top-right"
            containerStyle={{ top: 16, right: 16 }}
            toastOptions={{
              style: {
                maxWidth: "380px",
                fontFamily: "system-ui, sans-serif",
              },
            }}
          />
        </QueryClientProvider>
     
  )
}