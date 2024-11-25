'use client'
import { ActionsContext } from "@/contexts/actions/actions-context";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { Action, ActionsProviderProps } from "@/shared/interfaces/actions";
import { EffectivenessAnalysis } from "@/shared/types/effectiveness-analysis";
import { FollowUp } from "@/shared/types/follow-up";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ActionsProvider({ children }: ActionsProviderProps) {
  const form = useForm();

  const [enabled, setEnabled] = useState<boolean>(false);

  const [actions, setActions] = useState<Action[]>([]);
  const [actionsField, setActionsField] = useState<Record<string, any>>({});
  const [followUp, setFollowUp] = useState<FollowUp>({} as FollowUp);
  const [effectivenessAnalysis, setEffectivenessAnalysis] = useState<EffectivenessAnalysis>({} as EffectivenessAnalysis);

  const buildStructureSubTask = (data: Record<string, any>) => {

    const filteredSubtask = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    );

    const validateFields = (data: Record<string, any>) => {
      const requiredFields = ['issueTypeId', 'summary', 'reporter', 'assignee', 'duedate'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return false;
        }
      }
      return true;
    };

    const isValid = validateFields(filteredSubtask);

    if (!isValid) {
      toast.warning('Preencha todos os campos obrigatórios para adicionar a Ação.');
      return false;
    }

    setActions([...actions, filteredSubtask as Action]);
    setEnabled(false);
    form.reset();
  }

  function resetActions() {
    setActions([])
  }

  function onHandleAddActions(event: React.FormEvent<HTMLFormElement>): boolean {
    event.preventDefault();
    event.stopPropagation();
    const result = form.handleSubmit(buildStructureSubTask)(event);
    return !!result;
  }

  const getActionInformation = async (issueKey: string) => {
    const response = await brynhildrAPI(`/issue/${issueKey}`, {
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
      enabled,
      setEnabled,
      actions,
      actionsField,
      followUp,
      effectivenessAnalysis,
      setActions,
      setEffectivenessAnalysis,
      setFollowUp,
      onHandleAddActions,
      resetActions,
      setActionsField,
      getActionInformation
    }}>
      {children}
    </ActionsContext.Provider>
  );
}