'use client'
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { typeOfShipping } from "@/shared/constants/rnc/type-of-shipping";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { InfoIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Controller } from "react-hook-form";

interface SelectTypeOfShippingProps extends SelectControllerProps {
    showComponent?: boolean;
}

export function SelectTypeOfShipping({ name, form, disabled, value, showComponent = true }: SelectTypeOfShippingProps) {

    const isSendToMaterialForCustomer = form.watch(`${[CustomFields.ENVIA_MATERIAL_CLIENTE.id]}`)

    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const handleCheckboxChange = (event: boolean) => {
        setIsCheckboxChecked(event);
    }

    const shouldShowTooltip = isSendToMaterialForCustomer?.id !== "10301" &&
        isSendToMaterialForCustomer?.id !== undefined &&
        !form.watch(name) &&
        !value;

    return (
        <Fragment>
            {showComponent && (
                <FloatingLabelInput id="Tipo de frete" label="Tipo de frete">
                    <div className="flex flex-row items-center gap-2 ">
                        {!isCheckboxChecked ? (
                            <div className="w-full relative flex items-center">
                                <Controller
                                    name={name}
                                    control={form.control}
                                    disabled={disabled}
                                    render={({ field }) => (
                                        <Select
                                            disabled={isSendToMaterialForCustomer?.id === "10301" || isSendToMaterialForCustomer?.id === undefined}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={value ? value : "Selecione"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {typeOfShipping?.map((type: Record<string, any>, idx: number) => (
                                                        <SelectItem key={idx} value={type.value} >
                                                            <div className="flex items-center gap-1">
                                                                {type.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {shouldShowTooltip && !form.watch(name) && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <InfoIcon className="h-4 w-4 ml-2 text-red-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Selecione qual o tipo de frete, pelo o qual será enviado o material ao cliente.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        ) : (
                            <Input placeholder="Escreva o tipo de frete" className="" maxLength={11} name={`${[CustomFields.TIPO_FRETE.id]}`} />
                        )}
                        <div className="flex flex-row whitespace-nowrap items-center justify-center gap-2">
                            <Switch
                                disabled={isSendToMaterialForCustomer?.id === "10301" || isSendToMaterialForCustomer?.id === undefined}
                                checked={isCheckboxChecked}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label className="text-xs">Outro</Label>
                        </div>
                    </div>
                </FloatingLabelInput>
            )}
        </Fragment>
    );
}