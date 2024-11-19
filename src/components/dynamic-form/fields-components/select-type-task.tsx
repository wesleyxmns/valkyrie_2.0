'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import Image from "next/image";
import { Controller } from "react-hook-form";

export interface IssueTypeProps {
    self: string;
    id: string;
    description: string;
    name: string;
    iconUrl: string;
    avatarId: number;
    subtask: boolean;
}

export interface SelectProps extends SelectControllerProps {
    projectKey: string;
    defaultValue?: string;
}

export function SelectTypeTask({ form, projectKey, name, disabled, defaultValue }: SelectProps) {
    const { useGetIssueTypes } = useBrynhildrData()
    const { data: types } = useGetIssueTypes(projectKey);

    return (
        <Controller
            name={name}
            control={form.control}
            defaultValue={defaultValue || ''}
            render={({ field }) => (
                <Select disabled={disabled} value={field.value} onValueChange={field.onChange} >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {types && types.filter((el: Record<string, any>) => !el.subtask)
                                .map((option: IssueTypeProps, idx: number) => (
                                    <SelectItem key={idx} value={option.id} >
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
                                                />}
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
