
'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { determineReportTypes } from "@/shared/constants/rnc/determine-report-types";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

type SelectReportType = {
    label: string;
    value: string;
}

interface SelectTypeReport extends SelectControllerProps {
    projectKey: string
    disabled?: boolean
}

export function SelectTypeReport({ form, projectKey, name, disabled, value }: SelectTypeReport) {

    const [data, setData] = useState<SelectReportType[]>([])

    useEffect(() => {
        const types = determineReportTypes(projectKey);
        setData(types);
    }, [projectKey]);

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <Select
                    value={field.value?.id || ""}
                    onValueChange={(value) => {
                        const selectedItem = data.find(item => item.value === value);
                        field.onChange(selectedItem ? { value: selectedItem.label, id: selectedItem.value } : null);
                    }}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={value ? value : 'Selecione'}>
                            {field.value ? field.value.value : "Selecione"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {data?.map((item: Record<string, any>, idx: number) => (
                                <SelectItem
                                    key={idx}
                                    value={item.value}
                                >
                                    <div className="flex items-center gap-1">
                                        {item.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
        />
    )
}