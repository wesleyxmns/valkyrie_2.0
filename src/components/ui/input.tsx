import * as React from "react"

import { cn } from "@/lib/utils/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        {Icon && <InputIcon icon={Icon} />}

        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

interface InputIconProps {
  icon: React.ElementType
}

function InputIcon({ icon: Icon }: InputIconProps) {
  return (
    <Icon className="w-5" />
  )
}

Input.displayName = "Input"

export { Input }
