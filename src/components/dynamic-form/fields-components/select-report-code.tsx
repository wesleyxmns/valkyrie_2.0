'use client'
import MultiSelect from "@/components/ui/multi-select";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { CodeRncOptions } from "@/shared/constants/rnc/code-rnc-options";
import { improvementsOptions } from "@/shared/constants/rnc/improvements-options";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { useEffect, useState, useMemo } from "react";
import { Controller } from "react-hook-form";

export type SelectReporValues = {
    label: string;
    value: string;
}

export function SelectReportCode({ form, name, disabled, value }: SelectControllerProps) {
    const reportTypeValue = form.watch(CustomFields.TIPO_RELATORIO.id);
    const [data, setData] = useState<SelectReporValues[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    function dynamicValues(reportType: Record<string, any>) {
        reportType?.value === 'Melhorias' ? setData(improvementsOptions) : setData(CodeRncOptions)
    }

    useEffect(() => {
        dynamicValues(reportTypeValue)
    }, [reportTypeValue]);

    const handleMultiSelectChange = (selectedValues: string[]) => {
        const selectedValuesString = selectedValues.join(', ');
        form.setValue(CustomFields.COD_RELATORIO.id, selectedValuesString);
        form.trigger(CustomFields.COD_RELATORIO.id);
    }

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(option => 
            option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    return (
        <Controller 
            name={name} 
            control={form.control} 
            render={({ field }) => (
                <MultiSelect
                    options={filteredOptions}
                    defaultValue={field.value ? field.value.split(', ') : []}
                    onValueChange={(values) => {
                        handleMultiSelectChange(values.map(option => option.value));
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
                    onSearch={setSearchTerm}
                />
            )} 
        />
    )
}