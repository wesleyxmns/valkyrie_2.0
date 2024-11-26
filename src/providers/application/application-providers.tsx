import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "../auth/auth-provider";
import { BrynhildrProvider } from "../brynhildr/brynhildr-data-provider";
import { NotificationProvider } from "../dashboard/providers/notifications/notifications-provider";
import ThemeProvider from "../theme/theme-provider";
import { CommentsProvider } from "../dashboard/providers/comments/comments-provider";

export default function ApplicationProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BrynhildrProvider>
          <TooltipProvider>
            <NotificationProvider>
              <CommentsProvider>
                {children}
              </CommentsProvider>
              <Toaster richColors />
            </NotificationProvider>
          </TooltipProvider>
        </BrynhildrProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}