import React, { useEffect, useState } from 'react';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { SelectControllerProps } from '@/shared/interfaces/dynamic-form';
import { IndustrySectorsOptions } from '@/shared/constants/rnc/industry-sectors-options';

interface IndustrySectorsProps extends SelectControllerProps {
  disabled?: boolean;
  formState: Record<string, any>;
}

export function SelectSubsectors({ form, name, disabled, value, formState }: IndustrySectorsProps) {
  const [options, setOptions] = useState<any[]>([]);
  const assignee = formState?.assignee?.toUpperCase();

  useEffect(() => {
    const selectedGroup = IndustrySectorsOptions.find(group => group.label === assignee);
    if (selectedGroup) {
      setOptions(selectedGroup.options);
    } else {
      setOptions([]);
    }
  }, [assignee]);

  const handleSelectChange = (selectedValue: string) => {
    form.setValue(name, { value: selectedValue });
    form.trigger(name);
  }

  return (
    <React.Fragment>
      {["PINTURA", "MONT.MECANICA", "MONT.ELETRICA", "USINAGEM", "FABRICACAO"].includes(assignee) && (
        <FloatingLabelInput id='Subsetores' label='Subsetores'  >
          <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  if (!disabled) {
                    handleSelectChange(value);
                    field.onChange({ value });
                  }
                }}
                value={field.value?.value || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={value ? value : "Selecione um subsetor"} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FloatingLabelInput>
      )}
    </React.Fragment>
  );
}