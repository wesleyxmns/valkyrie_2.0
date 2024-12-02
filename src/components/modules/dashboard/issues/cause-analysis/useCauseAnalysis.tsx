'use client'
import { useCauseAnalysisContext } from "@/hooks/cause-analysis/use-cause-analysis";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { CauseAnalysis, Whys } from "@/shared/interfaces/cause-analysis";
import { CorrectiveAction } from "@/shared/types/corrective-action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { onHandleLinkCauseAnalysis } from "./functions/on-handle-link-cause-analysis";

interface CreateCauseAnalysis {
  fields: Record<string, any>;
  projectKey?: string,
  issueKey: string
}

export function useCauseAnalysis({ issueKey, fields = {} }: CreateCauseAnalysis) {

  const { form, causeAnalysis, setCauseAnalysisKeys, setCauseAnalysis } = useCauseAnalysisContext();
  const { formState: { isSubmitting } } = form
  const whys = ['1° Porque', '2° Porque', '3° Porque', '4° Porque', '5° Porque'];

  const [openDialog, setOpenDialog] = useState(false);
  const [localCauses, setLocalCauses] = useState<Whys[]>([]);
  const [newCorrectiveAction, setNewCorrectiveAction] = useState<CorrectiveAction>({} as CorrectiveAction);
  const [missingCorrectiveActions, setMissingCorrectiveActions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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
    if (isSubmitting) {
      return;
    }

    try {
      form.handleSubmit(async () => {
        setIsLoading(true);
        try {
          await onHandleLinkCauseAnalysis({
            issueKey,
            causeAnalysis,
            setCauseAnalysisKeys,
            fields
          });
        } catch (error) {
          toast.success('Análise de causa criada com sucesso');
          handleCloseDialog();
        } finally {
          setIsLoading(false);
        }
      })();
    } catch (validationError) {
      toast.error('Por favor, verifique os campos do formulário');
      setIsLoading(false);
    }
  }

  return {
    openDialog,
    handleOpenChange,
    form,
    isLoading,
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