'use client'
import { SelectTypeTask } from "@/components/dynamic-form/fields-components/select-type-task";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { CauseAnalysis, Whys } from "@/shared/interfaces/cause-analysis";
import { CirclePlus, Layers2, ListX, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface CausePanelProps {
  fields?: Record<string, any>
  issueKey: string;
  projectKey: string;
  whys: string[];
  form: UseFormReturn<FieldValues, any, undefined>;
  causeAnalysis: CauseAnalysis,
  setCauseAnalysis: React.Dispatch<React.SetStateAction<CauseAnalysis>>
  localCauses: Whys[],
  setLocalCauses: React.Dispatch<React.SetStateAction<Whys[]>>
}

export function CausePanel({ fields = {}, form, projectKey, whys, localCauses, causeAnalysis, setLocalCauses, setCauseAnalysis }: CausePanelProps) {
  const sectorOrigins = fields[CustomFields.SETOR_ORIGEM.id]
  const sectorOriginsOptions = sectorOrigins?.split(', ').map(item => ({
    label: item,
    value: item
  }));

  const [isDisabled, setIsDisabled] = useState(false);

  const handleAddCause = () => {
    if (localCauses.length < 5 && causeAnalysis.originSector !== '') {
      const newWhy: Whys = {
        firstBecause: '',
        secondBecause: '',
        thirdBecause: '',
        fourthBecause: '',
        fifthBecause: '',
        rootCause: ''
      };
      setLocalCauses(prev => [...prev, newWhy]);
    }
  };

  const handleWhyChange = (causeIndex: number, key: keyof Whys, value: string) => {
    setLocalCauses(prev => {
      const newCauses = [...prev];
      newCauses[causeIndex] = { ...newCauses[causeIndex], [key]: value };
      return newCauses;
    });
  };

  const canCombineCauses = useCallback(() => {
    return localCauses.some(cause =>
      cause.firstBecause !== '' &&
      cause.secondBecause !== '' &&
      cause.rootCause !== ''
    );
  }, [localCauses]);

  const handleCombineCauses = () => {
    const validCauses = localCauses.filter(cause =>
      cause.firstBecause !== '' &&
      cause.secondBecause !== '' &&
      cause.rootCause !== ''
    );
    if (validCauses.length > 0) {
      setCauseAnalysis(prev => ({
        ...prev,
        whys: [...(prev.whys || []), ...validCauses],
      }));
    }
  };

  const handleValueChange = (value: string) => {
    setCauseAnalysis((state) => ({ ...state, originSector: value }));
    setIsDisabled(true);
  };

  const handleResetCauses = () => {
    setLocalCauses([]);
  };

  const handleRemoveCause = (index: number) => {
    setLocalCauses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4" >
      <div className="flex items-center gap-2 py-0.5" >
        <div className="flex items-center gap-2" >
          <FloatingLabelInput id="Tipo de Tarefa" label="Tipo de Tarefa">
            <SelectTypeTask disabled form={form} name="issueTypeId" projectKey={projectKey} defaultValue={IssueTypesId.ANALISE_DE_CAUSA} />
          </FloatingLabelInput>
          <FloatingLabelInput id="Selecione o Setor" label="Selecione o Setor">
            <Select disabled={isDisabled} onValueChange={handleValueChange} >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sectorOriginsOptions?.map((option, idx) => {
                    return (
                      <SelectItem key={idx} value={option.value}>{option.label}</SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FloatingLabelInput>
        </div>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={!isDisabled || localCauses.length >= 5} onClick={handleAddCause} variant="outline" type="button" >
                <CirclePlus size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar Causa</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={causeAnalysis.originSector === '' || !canCombineCauses()}
                onClick={handleCombineCauses}
                variant="outline"
                type="button"
              >
                <Layers2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Combinar Causas</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleResetCauses} variant="outline" type="button">
                <ListX size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resetar Causas</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {localCauses.map((why, causeIndex) => (
        <div key={causeIndex} className="space-y-3 p-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Causa {causeIndex + 1}</h3>
            <Button onClick={() => handleRemoveCause(causeIndex)} variant="outline" size="sm">
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {whys.map((whyLabel, whyIndex) => {
              const key = `${Object.keys(why)[whyIndex]}` as keyof Whys;
              return (
                <FloatingLabelInput id={`why-${causeIndex}-${key as string}`} label={whyLabel} key={key as string} >
                  <Input
                    value={why[key]}
                    onChange={(e) => handleWhyChange(causeIndex, key, e.target.value)}
                  />
                </FloatingLabelInput>
              );
            })}
            <FloatingLabelInput id={`why-${causeIndex}-rootCause`} label="Causa Raíz" className="text-red-500" >
              <Input
                value={why.rootCause}
                onChange={(e) => handleWhyChange(causeIndex, 'rootCause', e.target.value)}
              />
            </FloatingLabelInput>
          </div>
        </div>
      ))}
    </div >
  )
}