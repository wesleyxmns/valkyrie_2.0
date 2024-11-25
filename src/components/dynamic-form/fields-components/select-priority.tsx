'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data"
import { Priority } from "@/shared/enums/jira-enums/priority"
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form"
import Image from 'next/image'
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import HIGHICON from '../../../../public/svg/priorities/high.svg'
import HIGHESTICON from '../../../../public/svg/priorities/highest.svg'
import LOWICON from '../../../../public/svg/priorities/low.svg'
import LOWESTICON from '../../../../public/svg/priorities/lowest.svg'
import MEDIUMICON from '../../../../public/svg/priorities/medium.svg'


interface PriorityItem {
    id: string;
    value: string;
    label: string;
    iconUrl?: string;
}

export function SelectPriority({ name, form, disabled, value }: SelectControllerProps) {

    const { useGetListPriorities } = useBrynhildrData()
    const { data: priorities } = useGetListPriorities();

    useEffect(() => {
        if (value) {
            const initialPriority = priorities?.find(p => p.value === value);
            if (initialPriority) {
                form.setValue(name, { name: initialPriority.value });
            }
        }
    }, [value, priorities, name, form]);

    const priorityIcons = {
        [Priority.LOWEST]: LOWESTICON,
        [Priority.LOW]: LOWICON,
        [Priority.MEDIUM]: MEDIUMICON,
        [Priority.HIGH]: HIGHICON,
        [Priority.HIGHEST]: HIGHESTICON,
    }

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
                            {priorities?.map((p: PriorityItem, idx) => {
                                const label = p.label;
                                return (
                                    <SelectItem key={idx} value={p.value}>
                                        <div className="flex items-center gap-1">
                                            <Image src={priorityIcons[label]} alt="priorities-icons" />
                                            {label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
        />
    );
}

