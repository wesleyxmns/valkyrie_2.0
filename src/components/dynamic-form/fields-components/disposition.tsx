'use client'
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Fragment, useState } from "react";
import { Controller } from "react-hook-form";

interface DispositionProps extends SelectControllerProps {
  showComponent?: boolean;
}

export function Disposition({ form, name, value, showComponent, disabled }: DispositionProps) {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const optionsValues = [
    { label: "Devolver", value: "Devolver" },
    { label: "Sucatear", value: "Sucatear" },
    { label: "Retrabalhar", value: "Retrabalhar" },
    { label: "Segregar", value: "Segregar" },
    { label: "Concessão do Cliente", value: "Concessão do Cliente" },
  ];

  const handleCheckboxChange = (event: boolean) => {
    setIsCheckboxChecked(event);
  }

  return (
    <Fragment>
      {showComponent && (
        <FloatingLabelInput id="Disposição" label="Disposição">
          <div className="flex flex-row items-center gap-2 ">
            {!isCheckboxChecked ? (
              <div className="w-full relative flex items-center">
                <Controller
                  name={name}
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={value ? value : "Selecione"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {optionsValues.map((option: Record<string, any>, idx: number) => {
                            return (
                              <SelectItem key={idx} value={option.value} >
                                <div className="flex items-center gap-1">
                                  {option.label}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : (
              <Input placeholder="Escreva a disposição" name={`${[CustomFields.DISPOSICAO.id]}`} />
            )}
            <div className="flex flex-row whitespace-nowrap items-center justify-center gap-2">
              <Switch
                checked={isCheckboxChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <Label className="text-xs">Outro</Label>
            </div>
          </div>
        </FloatingLabelInput>
      )}
    </Fragment>
  )
}