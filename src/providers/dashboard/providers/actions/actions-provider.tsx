'use client'
import { ActionsContext } from "@/contexts/actions/actions-context";
import { jiraAPI } from "@/lib/fetch/jira-api";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { Action, ActionsProviderProps, EffectivenessAnalysis, FollowUp } from "@/shared/interfaces/actions";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ActionsProvider({ children }: ActionsProviderProps) {
  const form = useForm();
  const [actions, setActions] = useState<Action[]>([]);
  const [actionsField, setActionsField] = useState<Record<string, any>>({});
  const [followUp, setFollowUp] = useState<FollowUp>({} as FollowUp);
  const [effectivenessAnalysis, setEffectivenessAnalysis] = useState<EffectivenessAnalysis>({} as EffectivenessAnalysis);

  const buildStructureSubTask = (data: Record<string, any>) => {
    const newSubtask: Action = {
      issueTypeId: data.issueTypeId,
      summary: data.summary,
      reporter: data.reporter,
      assignee: data.assignee,
      description: data.description,
      duedate: data.duedate,
      customfield_12304: data[CustomFields.SUBSETOR_FABRICA.id], // SUBSETOR FABRICA
      timetracking: {
        originalEstimate: data.duration,
        remainingEstimate: data.duration,
      }
    };

    setActions([...actions, newSubtask]);
    form.reset();
  }

  function resetActions() {
    setActions([])
  }

  function handleSubmitAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit(buildStructureSubTask)(event);
    resetActions();
  }

  const getActionInformation = async (issueKey: string) => {
    const response = await jiraAPI(`/issue/${issueKey}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': buildJiraAuthorization() }
    })
    const data = (await response.json());
    if (data && issueKey) {
      setActionsField(data)
    }
  };

  return (
    <ActionsContext.Provider value={{
      form,
      actions,
      actionsField,
      followUp,
      effectivenessAnalysis,
      setActions,
      setEffectivenessAnalysis,
      setFollowUp,
      handleSubmitAction,
      resetActions,
      setActionsField,
      getActionInformation
    }}>
      {children}
    </ActionsContext.Provider>
  );
}