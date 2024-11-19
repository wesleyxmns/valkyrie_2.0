'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import Image from "next/image";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { IssueTypeProps } from "./select-type-task";

interface SelectSubtaskProps extends SelectControllerProps {
    projectKey: string;
    defaultValue?: string
    disabled?: boolean;
    showIds: string[];  // Lista de IDs que você deseja mostrar
}

export function SelectIssueTypeSubtask({ form, name, projectKey, disabled, value, showIds, defaultValue }: SelectSubtaskProps) {
    const { useGetIssueTypes } = useBrynhildrData();
    const { data: actionsTypes } = useGetIssueTypes(projectKey);
    const issuesTypesSubtasks = actionsTypes.filter((item: Record<string, any>) => item.subtask === true);

    useEffect(() => {
        if (value) {
            const selectedOption = actionsTypes.find(option => option.name === value);
            if (selectedOption) {
                form.setValue(name, selectedOption.id);
            }
        }
    }, [value, form, name, actionsTypes]);

    const filteredIssuesTypes = issuesTypesSubtasks.filter(option => showIds?.includes(option.id));

    return (
        <Controller
            name={name}
            control={form.control}
            defaultValue={defaultValue || ""}
            render={({ field }) => (
                <Select disabled={disabled} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={field.value ? filteredIssuesTypes.find(item => item.id === field.value)?.name : "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {filteredIssuesTypes.map((option: IssueTypeProps, idx: number) => (
                                <SelectItem key={idx} value={option.id}>
                                    <div className="flex items-center gap-1">
                                        {option.iconUrl &&
                                            <Image
                                                unoptimized
                                                priority
                                                src={option.iconUrl}
                                                loader={() => option.iconUrl}
                                                width={15}
                                                height={15}
                                                alt={option.name}
                                            />
                                        }
                                        {option.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
        />
    );
}
