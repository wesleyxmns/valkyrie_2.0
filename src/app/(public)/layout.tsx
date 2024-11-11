import GridPattern from "@/components/features/auth/grid-background-pattern";
import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <GridPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "absolute inset-0 z-0 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
        )}
      />
      {children}
    </div>
  )
}

export default PublicLayout;