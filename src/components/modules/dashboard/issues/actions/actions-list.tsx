'use client'
import { StatusFilter } from "@/components/common/status-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useActions } from "@/hooks/actions/use-actions";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { getStatusInfo } from "@/shared/functions/get-status-info";
import { TransitionProps } from "@/shared/types/transitions";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { parseCookies } from "nookies";
import { Fragment, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { CauseAnalysisSectors } from "../cause-analysis/cause-analysis-sectors";

interface ActionsListProps {
  epicFields: Record<string, any>;
  actions: Array<Record<string, any>>
  isVisible: boolean;
}

const brynhildrService = new BrynhildrService()

export function ActionsList({ isVisible, actions, epicFields }: ActionsListProps) {
  const actionsIssueKeys = actions?.map((act) => act.key);
  const epicLink = epicFields[CustomFields.EPIC_NAME.id]

  const { useGetActions } = useBrynhildrData()
  const { data: actionsFields, isLoading } = useGetActions(actionsIssueKeys)

  const { user } = useAuth();
  const groups = user?.getGroups().items.map((group: any) => group.name);
  const _groups = groups?.filter((group) => group.includes("Managers") || group.includes("Global"))
  const isQualityMember = _groups?.find((group) => group.includes("QUALIDADE - Global"))

  return (
    <Fragment>
      {isVisible && (
        <div className="space-y-5" >
          {isLoading ?
            <LoadingShares /> :
            <div>
              {actionsFields.length > 0 && (
                <Fragment>
                  {actionsFields.some((sub: Record<string, any>) =>
                    sub.fields.status.id !== JiraStatusesId.CANCELLED &&
                    sub.fields.status.id !== JiraStatusesId.DONE
                  ) &&
                    (
                      <FloatingLabelInput label="Ações" id="Ações">
                        <ScrollArea className="h-auto overflow-auto" >
                          <div className="flex gap-2 flex-col" >
                            {actionsFields.filter((act) => act.fields.issuetype.id !== IssueTypesId.CORRETIVA).
                              map((action: Record<string, any>, idx: number) => {
                                return (
                                  <ContextMenu key={action.key} >
                                    <ActionTrigger callBack={() => { }} >
                                      <ActionCard actions={actions} action={action} />
                                    </ActionTrigger>
                                    <ContextMenuContent>
                                      <TransitionsCard actionKey={action.key} isQualityMember={isQualityMember} />
                                    </ContextMenuContent>
                                  </ContextMenu>
                                )
                              })}
                          </div>
                          <ScrollBar orientation="vertical" />
                        </ScrollArea>
                      </FloatingLabelInput>
                    )
                  }
                </Fragment>
              )}
            </div>
          }
          <StatusFilter
            currentStatus={epicFields.status?.id}
            statuses={[JiraStatusesId.EM_ANALISE, JiraStatusesId.VALIDA, JiraStatusesId.INVALIDA, JiraStatusesId.AGUARDANDO_APROVACAO, JiraStatusesId.APROVADA]}
          >
            <CauseAnalysisSectors epicLink={epicLink} />
          </StatusFilter>
        </div>
      )}
    </Fragment>
  )
}

function LoadingShares() {
  return (
    <div>
      <span className="ml-1 text-sm text-primary">Buscando ações </span>
      <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite] text-primary">.</span>
      <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite] text-primary">.</span>
      <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite] text-primary">.</span>
    </div>
  )
}

interface ActionsTriggerProps {
  callBack: () => void;
  children: ReactNode;
}

function ActionTrigger({ callBack, children }: ActionsTriggerProps) {
  return (
    <ContextMenuTrigger onMouseDownCapture={callBack} >
      {children}
    </ContextMenuTrigger>
  )
}

interface ActionCardProps {
  actions: Array<Record<string, any>>,
  action: Record<string, any>,
}

function ActionCard({ actions, action }: ActionCardProps) {

  const { getIssue } = brynhildrService;

  let actionKey: '' | string = ''

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuth = `Basic ${token}`;

  const { setActionsField, setEnabled } = useActions()
  const { color: statusColor } = getStatusInfo(action.fields.status.name);
  const currentAction = actions.find((act) => act.key === action.key);

  const onHandleChangeContent = useCallback(async () => {
    if (currentAction) {
      actionKey = currentAction.key;
      if (actionKey) {
        const res = await getIssue(actionKey, userAuth)
        setActionsField(res)
      }
    }
    setEnabled((prevState) => !prevState);
  }, [actionKey, currentAction]);

  return (
    <Card>
      <CardContent onClick={onHandleChangeContent}
        className="flex flex-col overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-muted/40 hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer"
      >
        <div className="flex gap-2 py-3 items-center">
          <Badge variant="outline" className="text-xs whitespace-nowrap flex items-center gap-1">
            <Image
              unoptimized
              priority
              src={action.fields?.issuetype.iconUrl}
              width={15}
              height={15}
              alt="issue type icon"
            />
            {action.fields?.issuetype.name}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Image
              unoptimized
              priority
              src={action.fields?.priority.iconUrl}
              width={15}
              height={15}
              alt="priority icon"
            />
            {action.fields?.priority.name}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs flex items-center gap-1 ${statusColor}`}
          >
            {action.fields?.status.name}
          </Badge>
          {action.fields?.issuetype.id === IssueTypesId.CORRETIVA && (
            <Fragment>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="outline" className="text-xs whitespace-nowrap flex items-center gap-1">
                <Image
                  unoptimized
                  priority
                  src={action.fields?.issuelinks[0]?.outwardIssue.fields?.issuetype.iconUrl}
                  width={15}
                  height={15}
                  alt="issue type icon"
                />
                {action.fields?.issuelinks[0].outwardIssue.key}
              </Badge>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-xs font-semibold text-white">{action.fields?.labels.join(" - ")}</div>
            </Fragment>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className="text-xs whitespace-nowrap">{action.key}</Badge>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-xs text-muted-foreground">{action.fields?.summary}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TransitionsCardProps {
  actionKey: string;
  isQualityMember: boolean;
}

function TransitionsCard({ isQualityMember, actionKey }: TransitionsCardProps) {
  const { doTransition } = brynhildrService;

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuthorization = `Basic ${token}`;

  const { useGetTransitions } = useBrynhildrData()
  const { data: transitions } = useGetTransitions(actionKey, userAuthorization)

  return (
    <Fragment>
      <Card className="hover:ring-1 ring-primary rounded-lg p-3">
        <ContextMenuGroup className="space-y-3" >
          <span className="font-semibold text-xs text-slate-400">
            Transições
          </span>
          <div className="flex flex-col gap-1" >
            {transitions?.map((transition: TransitionProps, index: number) => {
              return (
                <ContextMenuItem
                  key={index}
                  asChild
                  className="flex gap-2 items-center justify-between"
                >
                  <Button variant="outline" onClick={async () => {
                    if (transition.id === "41" && isQualityMember) {
                      await doTransition(actionKey, transition.id);
                      return toast.success('Ação aprovada com sucesso!');
                    } else if (transition.id === "41" && !isQualityMember) {
                      return toast.error('Apenas membros da Qualidade tem permissão para aprovar essa ação.');
                    } else {
                      await doTransition(actionKey, transition.id);
                      return toast.success('Transição realizada com sucesso!');
                    }
                  }}>
                    {transition.name}
                    <MoveRight className="w-3 h-3" />
                  </Button>
                </ContextMenuItem>
              )
            })}
          </div>
        </ContextMenuGroup>
      </Card>
    </Fragment>
  )
}