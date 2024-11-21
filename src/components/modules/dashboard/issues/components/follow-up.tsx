'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActions } from "@/hooks/actions/use-actions";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { consequencesRNC } from "@/shared/constants/rnc/consequences-rnc";
import { itemsDaNorma } from "@/shared/constants/rnc/items-da-norma";
import { Controller, useForm } from "react-hook-form";

interface FollowUpProps {
  epicFields: Record<string, any>
}

export function FollowUp({ epicFields }: FollowUpProps) {
  const { followUp, setFollowUp } = useActions()

  const { control, setValue, trigger } = useForm();

  const handleMultiSelectChange = (selectedValues: string[]) => {
    const selectedValuesString = selectedValues.join(', ');
    setValue(CustomFields.CONSEQUENCIAS_GERADAS.id, selectedValuesString);
    trigger(CustomFields.CONSEQUENCIAS_GERADAS.id);
  }

  const getDefaultConsequences = () => {
    if (epicFields[CustomFields.CONSEQUENCIAS_GERADAS.id]) {
      return epicFields[CustomFields.CONSEQUENCIAS_GERADAS.id].split(', ');
    }
    if (followUp.customfield_11501) {
      return followUp.customfield_11501.split(', ');
    }
    return [];
  }

  return (
    <ScrollArea className="overflow-x-auto" >
      <Card>
        <CardHeader>
          <CardTitle>Acompanhamento</CardTitle>
        </CardHeader>

        <CardContent className="p-2 h-auto">
          <div className="space-y-3 py-1">
            <div className="space-y-2">
              <FloatingLabelInput id="Item Norma" label="Item Norma" >
                <Select
                  defaultValue={epicFields[CustomFields.ITEM_NORMA.id]?.value}
                  value={followUp.customfield_12002?.value}
                  onValueChange={(value) => setFollowUp((state) => ({ ...state, customfield_12002: { value } }))}
                >
                  <SelectTrigger onClick={(e) => e.stopPropagation()}>
                    <SelectValue placeholder={"Selecione"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {itemsDaNorma.map((option: Record<string, any>, idx: number) => {
                        return (
                          <SelectItem key={idx} value={option.value} onSelect={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FloatingLabelInput>
              <FloatingLabelInput id="Consequências geradas" label="Consequências geradas" >
                <Controller
                  name={CustomFields.CONSEQUENCIAS_GERADAS.id}
                  control={control}
                  defaultValue={getDefaultConsequences()}
                  render={({ field }) => {
                    return (
                      <MultiSelect
                        value={field.value}
                        options={consequencesRNC}
                        onValueChange={(values) => {
                          handleMultiSelectChange(values.map(option => option.value));
                          field.onChange(values);
                          setFollowUp((state) => ({ ...state, customfield_11501: values.join(', ') }));
                        }}
                        defaultValue={getDefaultConsequences()}
                        placeholder="Selecione"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )
                  }}
                />
              </FloatingLabelInput>
            </div>
            <div className="flex flex-col" >
              <div className="flex flex-col space-y-3" >
                <div className="flex justify-around" >
                  <FloatingLabelInput id="Atualizar riscos e oportunidade?" label="Atualizar riscos e oportunidade?" >
                    <Controller name={CustomFields.ATT_RISCOS_OPORTUNIDADES.id} control={control} render={({ field }) => {
                      return (
                        <RadioGroup
                          onValueChange={(value: "Sim" | "Não") => {
                            setFollowUp((state) => ({ ...state, customfield_11502: { value } }));
                          }}
                          defaultValue={epicFields[CustomFields.ATT_RISCOS_OPORTUNIDADES?.id]?.value}
                          value={followUp.customfield_11502?.value}
                          className="mt-5 ml-4 gap-2 flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Sim" id="Sim" />
                            <Label htmlFor="Sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Não" id="Não" />
                            <Label htmlFor="Não">Não</Label>
                          </div>
                        </RadioGroup>
                      )
                    }} />
                  </FloatingLabelInput>
                  <FloatingLabelInput id="Realizar mudanças no SGQ?" label="Realizar mudanças no SGQ?" >
                    <Controller name={CustomFields.REALIZAR_MUDANCA_SGQ.id} control={control} render={({ field }) => {
                      return (
                        <RadioGroup
                          onValueChange={(value: "Sim" | "Não") => {
                            setFollowUp((state) => ({ ...state, customfield_11503: { value } }));
                          }}
                          defaultValue={epicFields[CustomFields.REALIZAR_MUDANCA_SGQ?.id]?.value}
                          value={followUp.customfield_11503?.value}
                          className="mt-5 ml-4 gap-2 flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Sim" id="Sim" />
                            <Label htmlFor="Sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Não" id="Não" />
                            <Label htmlFor="Não">Não</Label>
                          </div>
                        </RadioGroup>
                      )
                    }} />
                  </FloatingLabelInput>
                </div>
                <FloatingLabelInput id="Existem NC's similares ou podem ocorrer?" label="Existem NC's similares ou podem ocorrer?" >
                  <Controller name={CustomFields.NC_SIMILARES_PODEM_OCORRER.id} control={control} render={({ field }) => {
                    return (
                      <RadioGroup
                        onValueChange={(value: "Sim" | "Não") => {
                          setFollowUp((state) => ({ ...state, customfield_11504: { value } }));
                        }}
                        defaultValue={epicFields[CustomFields.NC_SIMILARES_PODEM_OCORRER?.id]?.value}
                        value={followUp.customfield_11504?.value}
                        className="mt-5 ml-4 gap-2 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Sim" id="Sim" />
                          <Label htmlFor="Sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Não" id="Não" />
                          <Label htmlFor="Não">Não</Label>
                        </div>
                      </RadioGroup>
                    )
                  }} />
                </FloatingLabelInput>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}