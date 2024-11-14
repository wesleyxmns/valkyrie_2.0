import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { hasAssurance } from "@/shared/constants/rnc/hasAssurance";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { InfoIcon } from "lucide-react";
import { Fragment } from "react";
import { Controller } from "react-hook-form";

interface SelectOrderAssuranceProps extends SelectControllerProps {
    showComponent?: boolean;
    required?: boolean;
}

export function SelectOrderAssurance({ form, name, disabled, value, required, showComponent }: SelectOrderAssuranceProps) {
    const shouldShowTooltip = required && !form.watch(name) && !value;
    const hasCOD_QTD = form.watch(CustomFields.COD_QTD.id);
    return (
        <Fragment>
            {(hasCOD_QTD || showComponent) && (
                <FloatingLabelInput id="Registrar Pedido em Garantia" label="Registrar Pedido em Garantia">
                    <div className="flex items-center" >
                        <Controller
                            name={name}
                            control={form.control}
                            render={({ field }) => (
                                <Fragment>
                                    <Select
                                        value={field.value?.id || ""}
                                        onValueChange={(value) => {
                                            const selectedItem = hasAssurance.find(item => item.value === value);
                                            field.onChange(selectedItem ? { value: selectedItem.label, id: selectedItem.value } : null);
                                        }}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={value ? value : "Selecione"}>
                                                {field.value ? field.value.value : "Selecione"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {hasAssurance?.map((item: Record<string, any>, idx: number) => (
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
                                    {shouldShowTooltip && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InfoIcon className="h-4 w-4 ml-2 text-red-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>É necessário informar se haverá necessidade de abertura do pedido de garantia.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </Fragment>
                            )}
                        />
                    </div>
                </FloatingLabelInput>
            )}
        </Fragment>
    )
}