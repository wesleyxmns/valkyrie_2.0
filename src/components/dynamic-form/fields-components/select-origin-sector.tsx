'use client'
import MultiSelect from "@/components/ui/multi-select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { JiraSectorOptions } from "@/shared/constants/jira/jira-sector-options";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Controller } from "react-hook-form";

interface SelectOriginSectorProps extends SelectControllerProps {
  defaultValue?: string;
  disabled?: boolean;
}

export function SelectOriginSector({ form, name, value, disabled, defaultValue }: SelectOriginSectorProps) {

  const handleMultiSelectChange = (selectedValues: string[]) => {
    const selectedValuesString = selectedValues.join(', ');
    form.setValue(CustomFields.SETOR_ORIGEM.id, selectedValuesString);
    form.trigger(CustomFields.SETOR_ORIGEM.id);
  }

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div className='relative'>
          <div className="relative">
            {disabled && <div className='absolute bg-muted  h-full text-muted-foreground rounded-sm text-center items-center flex justify-center' />}
            <ScrollArea>
              <MultiSelect
                options={JiraSectorOptions}
                defaultValue={field.value ? field.value.split(', ') : []}
                onValueChange={(values) => {
                  handleMultiSelectChange(values.map(value => value.label));
                  field.onChange(values.join(', '));
                }}
                placeholder={value ? value : "Selecione"}
                variant="secondary"
                disabled={disabled}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              <ScrollBar orientation='vertical' />
            </ScrollArea>
          </div>
        </div>
      )}
    />
  );
}