import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Controller } from "react-hook-form";

interface SelectGlobal extends SelectControllerProps {
    data: { label: string; value: string }[]
}

export function SelectGlobal({ name, data, form, disabled, value }: SelectGlobal) {
    return (
        <Controller name={name} control={form.control} render={({ field }) => (
            <Select disabled={disabled} value={field.value} onValueChange={field.onChange} >
                <SelectTrigger>
                    <SelectValue placeholder={value ? value : "Selecione"} />
                </SelectTrigger>
                <SelectContent >
                    <SelectGroup>
                        {data?.map((item: Record<string, string>, idx: number) => (
                            <SelectItem key={idx} value={item?.value} >
                                <div className="flex items-center gap-1">
                                    {item?.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        )} />
    )
}