'use client'
import { categorizeIssues } from "@/components/modules/dashboard/kanban/functions/caregorizeIssues";
import { Kanban } from "@/components/modules/dashboard/kanban/kanban";
import { KanbanLoading } from "@/components/modules/dashboard/kanban/kanban-loading";
import { Header } from "@/components/modules/dashboard/main-area-header";
import { ShinyButton } from "@/components/ui/shiny-button";
import { UserDTO } from "@/dtos/responses/user-dto";
import { useAuth } from "@/hooks/auth/use-auth";
import { useKanban } from "@/hooks/kanban/use-kanban";
import { useGetAllTasks, useGetProjectDetailsQuery, useGetProjectStatusQuery } from "@/hooks/queries/use-brynhildr-queries";
import { useEffect, useMemo } from "react";

interface BoardProps {
  params: {
    projectKey: string;
  };
}

export default function BoardPage({ params }: BoardProps) {
  const { user } = useAuth();
  const { projectKey } = params;

  const { columns, updateColumns } = useKanban();
  const { data: projectDetails, isLoading } = useGetProjectDetailsQuery(projectKey);
  const { data: tasks } = useGetAllTasks(user as UserDTO, projectKey);
  const { data: statusOfEachTasks } = useGetProjectStatusQuery(projectKey)

  const filterOptionSelected: string[] = [];
  const data = tasks || [];

  const filteredTasks = useMemo(() =>
    filterOptionSelected.length === 0 ? data : tasks.filter(task =>
      filterOptionSelected.every(option => task[option])
    ), [data, tasks, filterOptionSelected]);

  const categorizedIssues = useMemo(() =>
    categorizeIssues({ statusOfEachTasks, issues: filteredTasks }),
    [statusOfEachTasks, filteredTasks]
  );

  useEffect(() => {
    updateColumns(categorizedIssues);
  }, [tasks, statusOfEachTasks]);

  return (
    <div className="h-full w-full mt-20">
      <Header>
        <Header.Content className="flex items-center justify-between mr-16" >
          <Header.H1>
            {projectDetails?.name}
          </Header.H1>
          <Header.Actions>
            {/* <ToggleCreateIssue projectKey={projectDetails.key}> */}
            <ShinyButton>
              Abrir Relatório
            </ShinyButton>
            {/* </ToggleCreateIssue> */}
          </Header.Actions>
        </Header.Content>
        {isLoading ? (
          <KanbanLoading columns={columns} />
        ) : (
          <div className="w-auto mt-10">
            <Kanban user={user as UserDTO} structure={columns} />
          </div>
        )}
      </Header>
    </div>
  );
}