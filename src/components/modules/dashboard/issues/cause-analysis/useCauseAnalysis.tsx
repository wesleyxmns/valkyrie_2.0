'use client'
import { useCauseAnalysisContext } from "@/hooks/cause-analysis/use-cause-analysis";
import { CauseAnalysis, Whys } from "@/shared/interfaces/cause-analysis";
import { CorrectiveAction } from "@/shared/types/corrective-action";
import { useCallback, useEffect, useState } from "react";
import { onHandleLinkCauseAnalysis } from "./functions/on-handle-link-cause-analysis";

interface CreateCauseAnalysis {
  fields: Record<string, any>;
  projectKey?: string,
  issueKey: string
}

export function useCauseAnalysis({ issueKey, fields = {} }: CreateCauseAnalysis) {

  const { form, causeAnalysis, setCauseAnalysisKeys, setCauseAnalysis } = useCauseAnalysisContext();
  const whys = ['1° Porque', '2° Porque', '3° Porque', '4° Porque', '5° Porque'];

  const [openDialog, setOpenDialog] = useState(false);
  const [localCauses, setLocalCauses] = useState<Whys[]>([]);
  const [newCorrectiveAction, setNewCorrectiveAction] = useState<CorrectiveAction>({} as CorrectiveAction);
  const [missingCorrectiveActions, setMissingCorrectiveActions] = useState<string[]>([]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setLocalCauses([]);
    setCauseAnalysis((state: CauseAnalysis) => ({ ...state, whys: [], correctiveActions: [] }));
    setNewCorrectiveAction({} as CorrectiveAction);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (!openDialog) {
      handleCloseDialog();
    }
  }, [openDialog, handleCloseDialog]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpenDialog(true);
    if (!isOpen) {
      handleCloseDialog();
    } else {
      setOpenDialog(true);
    }
  }, [handleCloseDialog]);

  async function onHandleCreateCauseAnalysis() {
    await onHandleLinkCauseAnalysis({ issueKey, causeAnalysis, setCauseAnalysisKeys, fields });
    handleCloseDialog();
  }

  return {
    openDialog,
    handleOpenChange,
    form,
    onHandleCreateCauseAnalysis,
    whys,
    causeAnalysis,
    localCauses,
    setCauseAnalysis,
    setLocalCauses,
    newCorrectiveAction,
    setNewCorrectiveAction,
    missingCorrectiveActions,
    setMissingCorrectiveActions,
  }
}