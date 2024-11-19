'use client'
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { buildBasicInfoIssue } from "@/shared/builds/build-basic-info-issue";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useCreateAutomatic = (manualForm, setActiveTab) => {
  const form = useForm();
  const formFields = form.watch();
  const { useStorysJQLBuilder } = useBrynhildrData()

  const [listIssues, setListIssues] = useState<Array<Record<string, any>>>([]);
  const [selectedIssues, setSelectedIssues] = useState<any[]>([]);

  function fieldsToSearch() {
    const fields = Object.keys(formFields).reduce((acc, key) => {
      if (formFields[key] !== "" && formFields[key] !== undefined) {
        acc[key] = formFields[key];
      }
      return acc;
    }, {});

    return fields;
  }

  const searchFields = fieldsToSearch();

  const { data } = useStorysJQLBuilder({ infoQuery: searchFields });

  const handleSearch = async () => {
    try {
      if (data && data.issues && data.issues.length > 0) {
        const issues = data.issues.map((issue) => buildBasicInfoIssue(issue));
        setListIssues(issues);
      } else {
        toast.error("Nenhum dado encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar tarefas. Por favor, tente novamente.");
    }
  };

  const handleSelectIssue = useCallback((issue: any) => {
    setSelectedIssues((prev) =>
      prev.some((el) => el.issueKey === issue.issueKey)
        ? prev.filter((el) => el.issueKey !== issue.issueKey)
        : [...prev, issue]
    );
  }, []);

  const handleOpenReport = useCallback(() => {
    if (selectedIssues.length === 0) {
      toast.warning("Selecione pelo menos uma tarefa para abrir o relatório.");
      return;
    }

    const getUniqueValues = (key: string): string => {
      return Array.from(new Set(selectedIssues.map(issue => issue[key]))).join(', ');
    };

    const fieldMapping = {
      [CustomFields.OP.id]: 'op',
      [CustomFields.PEDIDO.id]: 'order',
      [CustomFields.CLIENTE.id]: 'cliente',
      [CustomFields.ITEM_RNC.id]: 'descricao'
    };

    Object.entries(fieldMapping).forEach(([formField, issueProperty]) => {
      const value = getUniqueValues(issueProperty);
      if (value) {
        if (formField === CustomFields.ITEM_RNC.id) {
          const issuesDescription = selectedIssues.map(issue => `${issue[issueProperty]}`).join('\n');
          manualForm.setValue(formField, issuesDescription);
        } else {
          manualForm.setValue(formField, value);
        }
      }
    });

    setActiveTab('manual');

    toast.success("Relatório aberto com as tarefas selecionadas.");
  }, [selectedIssues, manualForm, setActiveTab]);

  return {
    form,
    listIssues,
    selectedIssues,
    handleSearch: form.handleSubmit(handleSearch),
    handleSelectIssue,
    handleOpenReport,
  };
};

export default useCreateAutomatic;