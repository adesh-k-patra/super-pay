import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getToastIcon = (variant?: string | null, title?: React.ReactNode) => {
    if (variant === "destructive") {
      return (
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-xl animate-in zoom-in-50 duration-300 flex-shrink-0 border border-white/20">
          <XCircle className="h-6 w-6 text-black" strokeWidth={1.5} />
        </div>
      )
    }
    
    const titleStr = typeof title === 'string' ? title.toLowerCase() : ''
    
    if (titleStr.includes('success') || titleStr.includes('activated') || titleStr.includes('created') || titleStr.includes('completed')) {
      return (
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-xl animate-in zoom-in-50 duration-300 flex-shrink-0 border border-white/20">
          <CheckCircle className="h-6 w-6 text-black" strokeWidth={1.5} />
        </div>
      )
    }
    
    if (titleStr.includes('invalid') || titleStr.includes('error') || titleStr.includes('failed')) {
      return (
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-xl animate-in zoom-in-50 duration-300 flex-shrink-0 border border-white/20">
          <XCircle className="h-6 w-6 text-black" strokeWidth={1.5} />
        </div>
      )
    }
    
    if (titleStr.includes('info') || titleStr.includes('notice')) {
      return (
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-xl animate-in zoom-in-50 duration-300 flex-shrink-0 border border-white/20">
          <Info className="h-6 w-6 text-black" strokeWidth={1.5} />
        </div>
      )
    }
    
    return (
      <div className="rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-xl animate-in zoom-in-50 duration-300 flex-shrink-0 border border-white/20">
        <CheckCircle className="h-6 w-6 text-black" strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex items-center gap-4 w-full">
              {getToastIcon(variant, title)}
              <div className="flex-1 grid gap-1.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
