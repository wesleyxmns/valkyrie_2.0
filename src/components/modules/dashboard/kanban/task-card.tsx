import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { Eye } from "lucide-react";
import { Fragment, useMemo } from "react";
// import { ToggleEditIssue } from "../toogle-edit-issue";
// import { useTaskCard } from "./hooks/use-task-card";

export function TaskCard({ tasks, index, columnid }) {
  // const {
  //   onMouseDownCapture,
  //   isActive,
  //   activeTaskIndex,
  //   isRunning,
  //   TimerButton,
  //   initialTime,
  //   initialFields,
  //   setInitialFields,
  //   transitions,
  //   explainInvalidationModal,
  //   setExplainInvalidationModal,
  //   currentTransition,
  //   isLoadingTransitionsOptions,
  //   TransitionButton,
  //   reasonForInvalidation,
  //   handleTransition,
  //   SubtaskFormEditable,
  //   ExplainInvalidation,
  //   // generatePDF,
  // } = useTaskCard({ tasks, index, columnid });

  const isActionTask = useMemo(() => [
    IssueTypesId.IMEDIATA,
    IssueTypesId.CORRETIVA,
    IssueTypesId.MELHORIA
  ].includes(tasks.fields?.issuetype?.id), [tasks[index].fields?.issuetype?.id]);

  const cardHeaderClass = useMemo(() => {
    const baseClass = 'px-3 py-1 space-between flex flex-row relative rounded-t-lg';
    const typeClass = {
      [IssueTypesId.EPIC]: 'bg-purple-800 dark:bg-purple-900',
      [IssueTypesId.IMEDIATA]: 'bg-ImediateAction dark:bg-ImediateAction',
      [IssueTypesId.CORRETIVA]: 'bg-CorrectiveAction dark:bg-CorrectiveAction',
      [IssueTypesId.MELHORIA]: 'bg-ImprovementAction dark:bg-ImprovementAction'
    }[tasks[index].fields?.issuetype?.id] || '';
    return `${baseClass} ${typeClass}`;
  }, [tasks[index].fields?.issuetype?.id]);

  return (
    <Fragment>
      <ContextMenu>
        <ContextMenuTrigger
        // onMouseDownCapture={onMouseDownCapture}
        >
          <Card
          // className={`
          //   hover:ring-1 ring-primary rounded-lg
          //   ${isActive ? 'border-2 border-primary' : ''}
          //   ${activeTaskIndex && isRunning && isActionTask ? 'bg-primary-100 dark:bg-primary-900' : ''}
          // `}
          >
            <CardHeader className={cardHeaderClass}>
              <div className="flex items-center justify-between w-full">
                {isActionTask && tasks.fields?.status?.id === JiraStatusesId.IN_PROGRESS && (
                  <></>
                  // <TimerButton issueKey={tasks[index].key} initialTime={initialTime} />
                )}
                <Badge variant="outline" className="font-semibold bg-white dark:bg-gray-700 text-black dark:text-white border-none ml-auto">
                  {tasks[index].key}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-3 pt-3 pb-3 text-left whitespace-pre-wrap text-sm bg-white dark:bg-gray-700 text-black dark:text-white">
              <div className="text-ellipsis text-black dark:text-white">{tasks[index].fields?.summary}</div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            {tasks[index].fields?.issuetype?.id === "10000" ? (
              <></>
              // <ToggleEditIssue
              //   fields={initialFields}
              //   setFields={setInitialFields}
              //   projectKey={tasks[index].fields?.project?.key}
              //   issueKey={tasks[index].key}
              // >
              //   <span className="hover:bg-muted relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  justify-between">
              //     Ver
              //     <Eye className="w-3 h-3" />
              //   </span>
              // </ToggleEditIssue>
            ) : (
              <></>
              // <SubtaskFormEditable tasks={[tasks[index]]} index={0}>
              //   <span className="hover:bg-muted relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  justify-between">
              //     Ver
              //     <Eye className="w-3 h-3" />
              //   </span>
              // </SubtaskFormEditable>
            )}
          </ContextMenuItem>
          <Separator className="mt-1" />
          <ContextMenuGroup>
            <span className="font-semibold text-xs text-slate-400">Transições</span>
            {/* {isLoadingTransitionsOptions ? (
              <div className="text-xs">Carregando...</div>
            ) : (
              transitions?.map((transition) => (
                <TransitionButton key={transition.id} transition={transition} />
              ))
            )} */}
          </ContextMenuGroup>
          <Separator className="mt-1" />
          {/* <ContextMenuGroup>
            <span className="font-semibold text-xs text-slate-400">PDF</span>
            <ContextMenuItem onClick={() => generatePDF(tasks[index].key)}>
              Visualizar PDF
            </ContextMenuItem>
          </ContextMenuGroup> */}
        </ContextMenuContent>
      </ContextMenu>
      {/* <ExplainInvalidation
        showModal={explainInvalidationModal}
        onClose={() => setExplainInvalidationModal(false)}
        onConfirm={async (reason) => {
          if (currentTransition && reason.trim().length !== 0) {
            const res = await reasonForInvalidation(reason);
            if (res.status === HttpStatus.CREATED) {
              handleTransition(currentTransition);
            }
          }
          setExplainInvalidationModal(false);
        }}
      /> */}
    </Fragment>
  );
}