import { ReactElement, ReactNode } from "react";
import { FadeText } from "../ui/fade-text";
import { twMerge } from "tailwind-merge";

interface BuildPageLayoutProps {
  className?: string;
  icon?: ReactElement
  title: string;
  description?: string;
  children: ReactElement | ReactNode;
}

export function BuildPage({ children, title, icon, description, className }: BuildPageLayoutProps) {
  return (
    <div className={twMerge("flex min-h-screen flex-col mt-14", className)} >
      <main className="py-4 px-6 relative flex-1" >
        <div className="relative space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary dark:text-primary-dark">
              {icon && <span className="h-6 w-6 dark:text-white">{icon}</span>}
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl dark:text-white">
                {title}
              </h1>
            </div>
            <FadeText
              className="text-lg text-black dark:text-white"
              direction="left"
              framerProps={{
                show: { transition: { delay: 0.2 } },
              }}
              text={description ?? ''}
            />
          </div>
            <div className="flex justify-start mt-60">
            {children}
            </div>
        </div>
      </main>
    </div>
  )
}