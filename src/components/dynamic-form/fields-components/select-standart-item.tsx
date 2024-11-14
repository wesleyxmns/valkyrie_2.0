import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { itemsDaNorma } from "@/shared/constants/rnc/items-da-norma";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Controller } from "react-hook-form";

export function SelectStandartItem({ form, name, disabled, value }: SelectControllerProps) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <Select
                    value={field.value?.value || ""}
                    onValueChange={(selectedValue) => {
                        const selectedItem = itemsDaNorma.find(item => item.value === selectedValue);
                        field.onChange(selectedItem ? { value: selectedItem.value } : null);
                    }}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={value ? value : "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {itemsDaNorma?.map((item: Record<string, any>, idx: number) => (
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
