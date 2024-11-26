import { ReactNode } from "react";
import { SocketProvider } from "../socket/socket-provider";
import { ActionsProvider } from "./providers/actions/actions-provider";
import { CauseAnalysisProvider } from "./providers/cause-analysis/cause-analysis-provider";
import { KabanProvider } from "./providers/kanban/kanban-provider";
import { WorklogProvider } from "./providers/worklog/worklog-provider";

export default function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <KabanProvider>
        <WorklogProvider>
          <ActionsProvider>
            <CauseAnalysisProvider>
              <div className="bg-green-3 w-screen h-screen">
                {children}
              </div>
            </CauseAnalysisProvider>
          </ActionsProvider>
        </WorklogProvider>
      </KabanProvider>
    </SocketProvider>
  );
}