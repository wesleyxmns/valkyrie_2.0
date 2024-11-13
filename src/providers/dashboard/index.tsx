import { ReactNode } from "react";
import { SocketProvider } from "../socket/socket-provider";
import { KabanProvider } from "./providers/kanban/kanban-provider";
import { WorklogProvider } from "./providers/worklog/worklog-provider";
import { ActionsProvider } from "./providers/actions/actions-provider";
import { CauseAnalysisProvider } from "./providers/cause-analysis/cause-analysis-provider";
import { CommentsProvider } from "./providers/comments/comments-provider";
import { NotificationProvider } from "./providers/notifications/notifications-provider";

export default function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <KabanProvider>
        <WorklogProvider>
          <ActionsProvider>
            <CauseAnalysisProvider>
              <CommentsProvider>
                <NotificationProvider>
                  <div className="bg-green-3 w-screen h-screen">
                    {children}
                  </div>
                </NotificationProvider>
              </CommentsProvider>
            </CauseAnalysisProvider>
          </ActionsProvider>
        </WorklogProvider>
      </KabanProvider>
    </SocketProvider>
  );
}