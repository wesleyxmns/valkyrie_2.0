import { ReactNode, SetStateAction } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { EffectivenessAnalysis } from "../types/effectiveness-analysis";
import { FollowUp } from "../types/follow-up";

export interface Action {
  issueTypeId: string;
  summary: string;
  reporter: string;
  assignee: string;
  customfield_12304: Record<"value", string> // SUBSETOR FABRICA
  description?: string;
  duedate?: string;
  timetracking?: {
    originalEstimate: string;
    remainingEstimate: string;
  };
}

export interface ActionsProps {
  enabled: boolean;
  setEnabled: React.Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<FieldValues, any, undefined>
  actions: Action[];
  actionsField: Record<string, any>;
  followUp: FollowUp;
  effectivenessAnalysis: EffectivenessAnalysis;
  setEffectivenessAnalysis: React.Dispatch<React.SetStateAction<EffectivenessAnalysis>>;
  setActionsField: React.Dispatch<SetStateAction<Record<string, any>>>
  setFollowUp: React.Dispatch<React.SetStateAction<FollowUp>>;
  setActions: React.Dispatch<SetStateAction<Action[]>>
  resetActions: Function;
  onHandleAddActions: (event: React.FormEvent<HTMLFormElement>) => void;
  getActionInformation: Function;
}

export interface ActionsProviderProps {
  issueKey?: string;
  children: ReactNode;
}