import React from 'react';
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Fragment, InputHTMLAttributes } from "react";
import { FieldValues, UseFormRegister, Controller, Control } from "react-hook-form";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    required?: boolean;
    name: string;
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    showComponent?: boolean;
    id?: string;
    label?: string;
}

export function Field({ name, register, control, showComponent = true, ...props }: FieldProps) {
    const shouldShowTooltip = props.required && !control._formValues[name];

    return (
        <Fragment>
            <div className="flex items-center gap-2">
                {showComponent && (
                    <FloatingLabelInput id={props.id as string} label={props.label as string}>
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...props}
                                    {...field}
                                    min={0}
                                    disabled={props.disabled}
                                />
                            )}
                        />
                    </FloatingLabelInput>
                )}
                {shouldShowTooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 ml-2 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Este campo é obrigatório</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </Fragment>
    );
}
