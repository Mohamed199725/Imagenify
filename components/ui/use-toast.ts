"use client"

import { useToastManager } from "@/components/ui/toast"

type ToastOptions = {
  title?: string
  description?: string
  type?: "success" | "info" | "warning" | "error" | "loading"
  duration?: number
  className?: string
}

export function useToast() {
  const toastManager = useToastManager()

  return {
    toast: (options: ToastOptions) =>
      toastManager.add({
        title: options.title,
        description: options.description,
        type: options.type ?? "info",
        className: options.className,
      } as any),
  }
}
