import { FieldValues, UseFormReturn } from "react-hook-form";
import { IssueTypesId } from "../enums/jira-enums/issues-types-id";
import { CorrectiveAction } from "../types/corrective-action";

export interface Whys {
  firstBecause: string;
  secondBecause: string;
  thirdBecause: string;
  fourthBecause: string;
  fifthBecause: string;
  rootCause: string;
}

export interface CauseAnalysis {
  issueTypeId: IssueTypesId.ANALISE_DE_CAUSA;
  reporter: string;
  assignee: string;
  originSector: string;
  whys: Whys[];
  correctiveActions: CorrectiveAction[];
}

export interface CauseAnalysisContextProps {
  form: UseFormReturn<FieldValues, any, undefined>;
  causeAnalysis: CauseAnalysis;
  causeAnalysisKeys: string[];
  setCauseAnalysisKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setCauseAnalysis: React.Dispatch<React.SetStateAction<CauseAnalysis>>;
  addcauseAnalysis: (data: CauseAnalysis) => void;
}