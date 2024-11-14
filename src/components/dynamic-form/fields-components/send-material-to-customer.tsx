import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { sendMaterialToCustomer } from "@/shared/constants/rnc/send-material-to-customer";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { InfoIcon } from "lucide-react";
import { Fragment } from "react";
import { Controller } from "react-hook-form";

interface SelectSendMaterialToCustomerProps extends SelectControllerProps {
    showComponent?: boolean;
    required?: boolean;
}

export function SelectSendMaterialToCustomer({ form, name, disabled, value, showComponent = true, required }: SelectSendMaterialToCustomerProps) {
    const shouldShowTooltip = required && !form.watch(name) && !value;

    return (
        <Fragment>
            {showComponent && (
                <FloatingLabelInput id="Envia Material Cliente" label="Enviar Material ao Cliente">
                    <div className="flex items-center">
                        <Controller
                            name={name}
                            control={form.control}
                            render={({ field }) => (
                                <Fragment>
                                    <Select
                                        value={field.value?.id || ""}
                                        onValueChange={(value) => {
                                            const selectedItem = sendMaterialToCustomer.find(item => item.value === value);
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
                                                {sendMaterialToCustomer?.map((item: Record<string, any>, idx: number) => (
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
                                                    <p>É necessário informar se haverá necessidade de enviar material ao cliente.</p>
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