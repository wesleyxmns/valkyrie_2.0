'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Priority } from "@/shared/enums/jira-enums/priority";
import { useGetListPriorities } from "../services/use-dynamic-form-queries";

interface PriorityItem {
    id: string;
    value: string;
    label: string;
    iconUrl?: string;
}

export function SelectPriority({ name, form, disabled, value }: SelectControllerProps) {

    const [priorities, setPriorities] = useState<PriorityItem[]>([]);

    function getPriorities() {
        const { data: priorities } = useGetListPriorities();
        setPriorities(priorities);
    }

    useEffect(() => {
        getPriorities();
    }, []);

    useEffect(() => {
        if (value) {
            const initialPriority = priorities.find(p => p.value === value);
            if (initialPriority) {
                form.setValue(name, { name: initialPriority.value });
            }
        }
    }, [value, priorities, name, form]);

    return (
        <Controller
            defaultValue={{ name: Priority.LOW }}
            name={name}
            control={form.control}
            render={({ field }) => (
                <Select
                    value={field.value?.name || ""}
                    onValueChange={(value) => {
                        const selectedItem = priorities.find((item) => item.value === value);
                        field.onChange(selectedItem ? { name: selectedItem.value } : null);
                    }}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={value || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {priorities.map((p, idx) => (
                                <SelectItem key={idx} value={p.value}>
                                    <div className="flex items-center gap-1">
                                        {p.iconUrl && (
                                            <Image
                                                unoptimized
                                                priority
                                                src={p.iconUrl}
                                                width={15}
                                                height={15}
                                                alt="prioridades"
                                            />
                                        )}
                                        {p.label}
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