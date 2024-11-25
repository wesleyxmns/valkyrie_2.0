import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useActions } from "@/hooks/actions/use-actions";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { Controller, useForm } from "react-hook-form";

interface EffectivenessAnalysisProps {
  epicFields: Record<string, any>
}

export function EffectivenessAnalysis({ epicFields }: EffectivenessAnalysisProps) {
  const { effectivenessAnalysis, setEffectivenessAnalysis } = useActions();
  const { control } = useForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Eficácia</CardTitle>
      </CardHeader>

      <CardContent className="p-2 h-auto"  >
        <div className="space-y-3 py-1" >
          <div className="flex justify-end items-center" >
            <FloatingLabelInput id="As Ações Imediatas foram eficazes?" label="As ações imediatas foram eficazes?" >
              <Controller name={CustomFields.ACOES_BLOQUEIO_EFICAZES.id} control={control} render={({ field }) => {
                return (
                  <RadioGroup
                    onValueChange={(value: "Sim" | "Não") => {
                      setEffectivenessAnalysis((state) => ({ ...state, customfield_11505: { value } }));
                    }}
                    defaultValue={epicFields[CustomFields.ACOES_BLOQUEIO_EFICAZES?.id]?.value}
                    value={effectivenessAnalysis.customfield_11505?.value}
                    className="mt-8 ml-4 gap-2 flex items-center"
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
            <FloatingLabelInput id="As Ações Corretivas evitam novas ocorrências?" label="As Ações Corretivas evitam novas ocorrências?" >
              <Controller name={CustomFields.ACOES_CORRETIVAS_EVITAM_OCORRENCIAS.id} control={control} render={({ field }) => {
                return (
                  <RadioGroup
                    onValueChange={(value: "Sim" | "Não") => {
                      setEffectivenessAnalysis((state) => ({ ...state, customfield_11506: { value } }));
                    }}
                    defaultValue={epicFields[CustomFields.ACOES_CORRETIVAS_EVITAM_OCORRENCIAS?.id]?.value}
                    value={effectivenessAnalysis.customfield_11506?.value}
                    className="mt-8 ml-4 gap-2 flex items-center"
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
      </CardContent>
    </Card>
  )
}